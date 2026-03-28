"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/admin-access";
import type {
  AdminEventItem,
  AdminNewsItem,
  AdminReportItem,
  AdminReportStatus,
} from "@/lib/admin-types";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ActionResult<T> =
  | { ok: true; item: T }
  | { ok: false; error: string };

async function getAuthorizedAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = getAdminAccess(user?.email);
  return { supabase, user, access };
}

export async function createNewsAction(input: {
  title: string;
  summary: string;
  category: string;
  urgent: boolean;
}): Promise<ActionResult<AdminNewsItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canCreateNews) {
    return { ok: false, error: "Tento účet nemá právo vytvářet zprávy." };
  }

  const urgent = access.permissions.canPublishUrgent ? input.urgent : false;
  const { data, error } = await supabase
    .from("news")
    .insert([
      {
        title: input.title,
        summary: input.summary,
        category: input.category,
        urgent,
      },
    ])
    .select("id, title, summary, category, urgent, published_at")
    .single();

  if (error || !data) {
    console.error("create news:", error);
    return { ok: false, error: "Uložení zprávy do Supabase selhalo." };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      summary: data.summary,
      category: data.category,
      urgent: data.urgent,
      date: data.published_at.slice(0, 10),
    },
  };
}

export async function createEventAction(input: {
  title: string;
  date: string;
  time: string;
  place: string;
  category: string;
  free: boolean;
  price: string;
}): Promise<ActionResult<AdminEventItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canCreateEvents) {
    return { ok: false, error: "Tento účet nemá právo vytvářet akce." };
  }

  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title: input.title,
        date: input.date,
        time: input.time,
        place: input.place,
        category: input.category,
        free: input.free,
        price: input.free ? null : input.price,
      },
    ])
    .select("id, title, date, time, place, category, free, price")
    .single();

  if (error || !data) {
    console.error("create event:", error);
    return { ok: false, error: "Uložení akce do Supabase selhalo." };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      date: data.date,
      time: data.time.slice(0, 5),
      place: data.place,
      category: data.category,
      free: data.free,
      price: data.price ?? "",
    },
  };
}

export async function updateReportStatusAction(input: {
  id: string;
  status: AdminReportStatus;
}): Promise<ActionResult<AdminReportItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canResolveReports) {
    return { ok: false, error: "Tento účet nemá právo měnit stav závad." };
  }

  const { data, error } = await supabase
    .from("reports")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.id)
    .select("id, title, description, category, status, created_at")
    .single();

  if (error || !data) {
    console.error("update report:", error);
    return { ok: false, error: "Změna stavu závady v Supabase selhala." };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      date: data.created_at.slice(0, 10),
    },
  };
}
