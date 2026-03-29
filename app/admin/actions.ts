"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/admin-access";
import type {
  AdminDirectoryItem,
  AdminEventItem,
  AdminNewsItem,
  AdminPollItem,
  AdminReportItem,
  AdminReportStatus,
} from "@/lib/admin-types";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ActionResult<T> =
  | { ok: true; item: T }
  | { ok: false; error: string };

type DeleteActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

type DirectoryRow = {
  id: string;
  name: string;
  category: string;
  city_department: string | null;
  phone: string;
  address: string;
  hours: string | null;
  note: string | null;
  email: string | null;
  website: string | null;
  source_url: string | null;
  appointment_url: string | null;
  appointment_label: string | null;
  source_kind: "manual" | "vimperk_web" | "import" | null;
  source_external_id: string | null;
  source_synced_at: string | null;
  is_locked: boolean | null;
};

function normalizeDirectoryResult(data: DirectoryRow): AdminDirectoryItem {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    cityDepartment: data.city_department ?? undefined,
    phone: data.phone,
    address: data.address,
    hours: data.hours ?? undefined,
    note: data.note ?? undefined,
    email: data.email ?? undefined,
    website: data.website ?? undefined,
    sourceUrl: data.source_url ?? undefined,
    appointmentUrl: data.appointment_url ?? undefined,
    appointmentLabel: data.appointment_label ?? undefined,
    sourceKind: data.source_kind ?? "manual",
    sourceExternalId: data.source_external_id ?? undefined,
    sourceSyncedAt: data.source_synced_at ?? undefined,
    isLocked: data.is_locked ?? false,
  };
}

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

export async function updateNewsAction(input: {
  id: string;
  title: string;
  summary: string;
  category: string;
  urgent: boolean;
}): Promise<ActionResult<AdminNewsItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canCreateNews) {
    return { ok: false, error: "Tento účet nemá právo upravovat zprávy." };
  }

  const urgent = access.permissions.canPublishUrgent ? input.urgent : false;
  const { data, error } = await supabase
    .from("news")
    .update({
      title: input.title,
      summary: input.summary,
      category: input.category,
      urgent,
    })
    .eq("id", input.id)
    .select("id, title, summary, category, urgent, published_at")
    .single();

  if (error || !data) {
    console.error("update news:", error);
    return { ok: false, error: "Úprava zprávy v Supabase selhala." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/zpravodaj");
  revalidatePath("/mesto");

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

export async function deleteNewsAction(id: string): Promise<DeleteActionResult> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canCreateNews) {
    return { ok: false, error: "Tento účet nemá právo mazat zprávy." };
  }

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("delete news:", error);
    return { ok: false, error: "Smazání zprávy v Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/zpravodaj");
  revalidatePath("/mesto");

  return { ok: true, id };
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

export async function updateEventAction(input: {
  id: string;
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
    return { ok: false, error: "Tento účet nemá právo upravovat akce." };
  }

  const { data, error } = await supabase
    .from("events")
    .update({
      title: input.title,
      date: input.date,
      time: input.time,
      place: input.place,
      category: input.category,
      free: input.free,
      price: input.free ? null : input.price,
    })
    .eq("id", input.id)
    .select("id, title, date, time, place, category, free, price")
    .single();

  if (error || !data) {
    console.error("update event:", error);
    return { ok: false, error: "Úprava akce v Supabase selhala." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/akce");
  revalidatePath("/kalendar");

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

export async function deleteEventAction(id: string): Promise<DeleteActionResult> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canCreateEvents) {
    return { ok: false, error: "Tento účet nemá právo mazat akce." };
  }

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("delete event:", error);
    return { ok: false, error: "Smazání akce v Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/akce");
  revalidatePath("/kalendar");

  return { ok: true, id };
}

export async function createDirectoryAction(input: {
  name: string;
  category: string;
  cityDepartment: string;
  phone: string;
  address: string;
  hours: string;
  note: string;
  email: string;
  website: string;
  sourceUrl: string;
  appointmentUrl: string;
  appointmentLabel: string;
}): Promise<ActionResult<AdminDirectoryItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManageDirectory) {
    return { ok: false, error: "Tento účet nemá právo spravovat kontakty a adresář." };
  }

  const { data, error } = await supabase
    .from("directory")
    .insert([
      {
        name: input.name,
        category: input.category,
        city_department:
          input.category === "město" && input.cityDepartment !== "vše"
            ? input.cityDepartment
            : null,
        phone: input.phone,
        address: input.address,
        hours: input.hours || null,
        note: input.note || null,
        email: input.email || null,
        website: input.website || null,
        source_url: input.sourceUrl || null,
        appointment_url: input.appointmentUrl || null,
        appointment_label: input.appointmentLabel || null,
        source_kind: "manual",
        is_locked: false,
      },
    ])
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked",
    )
    .single();

  if (error || !data) {
    console.error("create directory:", error);
    return { ok: false, error: "Uložení kontaktu do Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/adresar");
  revalidatePath("/kontakty");
  revalidatePath("/mesto");

  return {
    ok: true,
    item: normalizeDirectoryResult(data as DirectoryRow),
  };
}

export async function updateDirectoryAction(input: {
  id: string;
  name: string;
  category: string;
  cityDepartment: string;
  phone: string;
  address: string;
  hours: string;
  note: string;
  email: string;
  website: string;
  sourceUrl: string;
  appointmentUrl: string;
  appointmentLabel: string;
}): Promise<ActionResult<AdminDirectoryItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManageDirectory) {
    return { ok: false, error: "Tento účet nemá právo upravovat kontakty a adresář." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("directory")
    .select("is_locked, source_kind")
    .eq("id", input.id)
    .single();

  if (existingError || !existing) {
    console.error("load directory before update:", existingError);
    return { ok: false, error: "Kontakt se nepodařilo načíst před úpravou." };
  }

  if (existing.is_locked) {
    return { ok: false, error: "Oficiální synchronizovaný kontakt se ručně nepřepisuje. Upravte zdroj na vimperk.cz nebo synchronizaci." };
  }

  const { data, error } = await supabase
    .from("directory")
    .update({
      name: input.name,
      category: input.category,
      city_department:
        input.category === "město" && input.cityDepartment !== "vše"
          ? input.cityDepartment
          : null,
      phone: input.phone,
      address: input.address,
      hours: input.hours || null,
      note: input.note || null,
      email: input.email || null,
      website: input.website || null,
      source_url: input.sourceUrl || null,
      appointment_url: input.appointmentUrl || null,
      appointment_label: input.appointmentLabel || null,
    })
    .eq("id", input.id)
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked",
    )
    .single();

  if (error || !data) {
    console.error("update directory:", error);
    return { ok: false, error: "Úprava kontaktu v Supabase selhala." };
  }

  revalidatePath("/admin");
  revalidatePath("/adresar");
  revalidatePath("/kontakty");
  revalidatePath("/mesto");

  return {
    ok: true,
    item: normalizeDirectoryResult(data as DirectoryRow),
  };
}

export async function deleteDirectoryAction(id: string): Promise<DeleteActionResult> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManageDirectory) {
    return { ok: false, error: "Tento účet nemá právo mazat kontakty a adresář." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("directory")
    .select("is_locked")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    console.error("load directory before delete:", existingError);
    return { ok: false, error: "Kontakt se nepodařilo načíst před smazáním." };
  }

  if (existing.is_locked) {
    return { ok: false, error: "Oficiální synchronizovaný kontakt se nemaže ručně. Odstraňte ho ve zdroji nebo v synchronizaci." };
  }

  const { error } = await supabase.from("directory").delete().eq("id", id);

  if (error) {
    console.error("delete directory:", error);
    return { ok: false, error: "Smazání kontaktu v Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/adresar");
  revalidatePath("/kontakty");
  revalidatePath("/mesto");

  return { ok: true, id };
}

function normalizePollResult(data: {
  id: string;
  question: string;
  category: string;
  ends_at: string;
  poll_options?: Array<{ id: string; text: string; votes: number; sort_order?: number | null }>;
}): AdminPollItem {
  const options = [...(data.poll_options ?? [])]
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes,
    }));

  return {
    id: data.id,
    question: data.question,
    category: data.category,
    endsAt: data.ends_at,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    options,
  };
}

export async function createPollAction(input: {
  question: string;
  category: string;
  endsAt: string;
  options: string[];
}): Promise<ActionResult<AdminPollItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManagePolls) {
    return { ok: false, error: "Tento účet nemá právo spravovat ankety." };
  }

  const sanitizedOptions = input.options.map((option) => option.trim()).filter(Boolean);
  if (sanitizedOptions.length < 2) {
    return { ok: false, error: "Anketa musí mít alespoň dvě možnosti." };
  }

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert([
      {
        question: input.question,
        category: input.category,
        ends_at: input.endsAt,
      },
    ])
    .select("id, question, category, ends_at")
    .single();

  if (pollError || !poll) {
    console.error("create poll:", pollError);
    return { ok: false, error: "Uložení ankety do Supabase selhalo." };
  }

  const { error: optionsError } = await supabase.from("poll_options").insert(
    sanitizedOptions.map((text, index) => ({
      poll_id: poll.id,
      text,
      votes: 0,
      sort_order: index + 1,
    })),
  );

  if (optionsError) {
    console.error("create poll options:", optionsError);
    await supabase.from("polls").delete().eq("id", poll.id);
    return { ok: false, error: "Uložení možností ankety do Supabase selhalo." };
  }

  const { data, error } = await supabase
    .from("polls")
    .select("id, question, category, ends_at, poll_options(id, text, votes, sort_order)")
    .eq("id", poll.id)
    .single();

  if (error || !data) {
    console.error("reload poll:", error);
    return { ok: false, error: "Načtení uložené ankety selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/hlasovani");
  revalidatePath("/mesto");

  return { ok: true, item: normalizePollResult(data) };
}

export async function updatePollAction(input: {
  id: string;
  question: string;
  category: string;
  endsAt: string;
  options: Array<{ id?: string; text: string }>;
}): Promise<ActionResult<AdminPollItem>> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManagePolls) {
    return { ok: false, error: "Tento účet nemá právo upravovat ankety." };
  }

  const sanitizedOptions = input.options.map((option) => option.text.trim()).filter(Boolean);
  if (sanitizedOptions.length < 2) {
    return { ok: false, error: "Anketa musí mít alespoň dvě možnosti." };
  }

  const { error: pollError } = await supabase
    .from("polls")
    .update({
      question: input.question,
      category: input.category,
      ends_at: input.endsAt,
    })
    .eq("id", input.id);

  if (pollError) {
    console.error("update poll:", pollError);
    return { ok: false, error: "Úprava ankety v Supabase selhala." };
  }

  const { error: deleteOptionsError } = await supabase
    .from("poll_options")
    .delete()
    .eq("poll_id", input.id);

  if (deleteOptionsError) {
    console.error("delete poll options:", deleteOptionsError);
    return { ok: false, error: "Smazání původních možností ankety selhalo." };
  }

  const { error: insertOptionsError } = await supabase.from("poll_options").insert(
    sanitizedOptions.map((text, index) => ({
      poll_id: input.id,
      text,
      votes: 0,
      sort_order: index + 1,
    })),
  );

  if (insertOptionsError) {
    console.error("insert poll options:", insertOptionsError);
    return { ok: false, error: "Uložení nových možností ankety selhalo." };
  }

  const { data, error } = await supabase
    .from("polls")
    .select("id, question, category, ends_at, poll_options(id, text, votes, sort_order)")
    .eq("id", input.id)
    .single();

  if (error || !data) {
    console.error("reload updated poll:", error);
    return { ok: false, error: "Načtení upravené ankety selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/hlasovani");
  revalidatePath("/mesto");

  return { ok: true, item: normalizePollResult(data) };
}

export async function deletePollAction(id: string): Promise<DeleteActionResult> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManagePolls) {
    return { ok: false, error: "Tento účet nemá právo mazat ankety." };
  }

  const { error } = await supabase.from("polls").delete().eq("id", id);

  if (error) {
    console.error("delete poll:", error);
    return { ok: false, error: "Smazání ankety v Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/hlasovani");
  revalidatePath("/mesto");

  return { ok: true, id };
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
