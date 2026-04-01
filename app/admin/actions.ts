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
  AdminWorkflowStatus,
} from "@/lib/admin-types";
import {
  getContactQualityIssues,
  getContactWorkflowStatus,
  isPotentialDuplicate,
  validateDirectoryInput,
} from "@/lib/directory";
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
  workflow_status?: AdminWorkflowStatus | null;
  updated_at?: string | null;
  updated_by_email?: string | null;
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
    workflowStatus: data.workflow_status ?? undefined,
    updatedAt: data.updated_at ?? undefined,
    updatedByEmail: data.updated_by_email ?? undefined,
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

function deriveWorkflowStatusForNews(input: {
  title: string;
  summary: string;
  urgent: boolean;
}): AdminWorkflowStatus {
  if (!input.title || !input.summary) return "draft";
  if (input.urgent) return "live";
  return input.summary.length >= 40 ? "ready" : "review";
}

function deriveWorkflowStatusForEvent(input: {
  title: string;
  date: string;
  place: string;
  free: boolean;
  price: string;
}): AdminWorkflowStatus {
  if (!input.title || !input.date || !input.place) return "draft";
  if (!input.free && !input.price) return "review";
  return "ready";
}

function deriveWorkflowStatusForPoll(input: {
  question: string;
  options: string[];
}): AdminWorkflowStatus {
  if (!input.question) return "draft";
  if (input.options.filter(Boolean).length < 2) return "review";
  return "ready";
}

function deriveWorkflowStatusForDirectory(item: AdminDirectoryItem | Parameters<typeof validateDirectoryInput>[0]): AdminWorkflowStatus {
  if ("sourceKind" in item && (item.sourceKind === "vimperk_web" || item.isLocked)) return "live";
  if ("sourceKind" in item) return getContactWorkflowStatus(item);
  const validation = validateDirectoryInput({
    name: item.name,
    category: item.category,
    cityDepartment: item.cityDepartment ?? "vše",
    phone: item.phone,
    address: item.address,
    hours: item.hours ?? "",
    note: item.note ?? "",
    email: item.email ?? "",
    website: item.website ?? "",
    sourceUrl: item.sourceUrl ?? "",
    appointmentUrl: item.appointmentUrl ?? "",
    appointmentLabel: item.appointmentLabel ?? "",
  });
  if (!validation.ok) return "review";
  const issues = getContactQualityIssues({
    id: "draft",
    name: validation.normalized.name,
    category: validation.normalized.category,
    cityDepartment: validation.normalized.cityDepartment === "vše" ? undefined : validation.normalized.cityDepartment,
    phone: validation.normalized.phone,
    address: validation.normalized.address,
    hours: validation.normalized.hours || undefined,
    note: validation.normalized.note || undefined,
    email: validation.normalized.email || undefined,
    website: validation.normalized.website || undefined,
    sourceUrl: validation.normalized.sourceUrl || undefined,
    appointmentUrl: validation.normalized.appointmentUrl || undefined,
    appointmentLabel: validation.normalized.appointmentLabel || undefined,
    sourceKind: "manual",
    isLocked: false,
  });
  if (issues.some((issue) => issue.severity === "critical")) return "review";
  return issues.length > 0 ? "review" : "ready";
}

async function insertAuditLog(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  payload: {
    entityType: "news" | "event" | "poll" | "directory" | "report";
    entityId: string;
    action: "create" | "update" | "delete" | "workflow" | "status";
    summary: string;
    actorEmail?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("admin_audit_log").insert([
    {
      entity_type: payload.entityType,
      entity_id: payload.entityId,
      action: payload.action,
      summary: payload.summary,
      actor_email: payload.actorEmail ?? null,
      metadata: payload.metadata ?? {},
    },
  ]);

  if (error) {
    console.error("insert audit log:", error);
  }
}

async function loadDirectoryItemsForDuplicateCheck(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data, error } = await supabase
    .from("directory")
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked",
    );

  if (error || !data) {
    console.error("load directory for duplicate check:", error);
    return [];
  }

  return data.map((item) => normalizeDirectoryResult(item as DirectoryRow));
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
  const workflowStatus = deriveWorkflowStatusForNews({ ...input, urgent });
  const { data, error } = await supabase
    .from("news")
    .insert([
      {
        title: input.title,
        summary: input.summary,
        category: input.category,
        urgent,
        workflow_status: workflowStatus,
        updated_at: new Date().toISOString(),
        updated_by_email: user.email ?? null,
      },
    ])
    .select("id, title, summary, category, urgent, published_at, workflow_status, updated_at, updated_by_email")
    .single();

  if (error || !data) {
    console.error("create news:", error);
    return { ok: false, error: "Uložení zprávy do Supabase selhalo." };
  }

  revalidatePath("/admin");
  await insertAuditLog(supabase, {
    entityType: "news",
    entityId: data.id,
    action: "create",
    summary: `Vytvořena zpráva „${data.title}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      summary: data.summary,
      category: data.category,
      urgent: data.urgent,
      date: data.published_at.slice(0, 10),
      workflowStatus: data.workflow_status,
      updatedAt: data.updated_at ?? undefined,
      updatedByEmail: data.updated_by_email ?? undefined,
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
  const workflowStatus = deriveWorkflowStatusForNews({ ...input, urgent });
  const { data, error } = await supabase
    .from("news")
    .update({
      title: input.title,
      summary: input.summary,
      category: input.category,
      urgent,
      workflow_status: workflowStatus,
      updated_at: new Date().toISOString(),
      updated_by_email: user.email ?? null,
    })
    .eq("id", input.id)
    .select("id, title, summary, category, urgent, published_at, workflow_status, updated_at, updated_by_email")
    .single();

  if (error || !data) {
    console.error("update news:", error);
    return { ok: false, error: "Úprava zprávy v Supabase selhala." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/zpravodaj");
  revalidatePath("/mesto");
  await insertAuditLog(supabase, {
    entityType: "news",
    entityId: data.id,
    action: "update",
    summary: `Upravena zpráva „${data.title}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      summary: data.summary,
      category: data.category,
      urgent: data.urgent,
      date: data.published_at.slice(0, 10),
      workflowStatus: data.workflow_status,
      updatedAt: data.updated_at ?? undefined,
      updatedByEmail: data.updated_by_email ?? undefined,
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
  await insertAuditLog(supabase, {
    entityType: "news",
    entityId: id,
    action: "delete",
    summary: `Smazána zpráva ${id}`,
    actorEmail: user.email,
  });

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

  const workflowStatus = deriveWorkflowStatusForEvent(input);
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
        workflow_status: workflowStatus,
        updated_at: new Date().toISOString(),
        updated_by_email: user.email ?? null,
      },
    ])
    .select("id, title, date, time, place, category, free, price, workflow_status, updated_at, updated_by_email")
    .single();

  if (error || !data) {
    console.error("create event:", error);
    return { ok: false, error: "Uložení akce do Supabase selhalo." };
  }

  revalidatePath("/admin");
  await insertAuditLog(supabase, {
    entityType: "event",
    entityId: data.id,
    action: "create",
    summary: `Vytvořena akce „${data.title}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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
      workflowStatus: data.workflow_status,
      updatedAt: data.updated_at ?? undefined,
      updatedByEmail: data.updated_by_email ?? undefined,
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

  const workflowStatus = deriveWorkflowStatusForEvent(input);
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
      workflow_status: workflowStatus,
      updated_at: new Date().toISOString(),
      updated_by_email: user.email ?? null,
    })
    .eq("id", input.id)
    .select("id, title, date, time, place, category, free, price, workflow_status, updated_at, updated_by_email")
    .single();

  if (error || !data) {
    console.error("update event:", error);
    return { ok: false, error: "Úprava akce v Supabase selhala." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/akce");
  revalidatePath("/kalendar");
  await insertAuditLog(supabase, {
    entityType: "event",
    entityId: data.id,
    action: "update",
    summary: `Upravena akce „${data.title}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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
      workflowStatus: data.workflow_status,
      updatedAt: data.updated_at ?? undefined,
      updatedByEmail: data.updated_by_email ?? undefined,
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
  await insertAuditLog(supabase, {
    entityType: "event",
    entityId: id,
    action: "delete",
    summary: `Smazána akce ${id}`,
    actorEmail: user.email,
  });

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

  const validation = validateDirectoryInput(input);
  if (!validation.ok) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const existingItems = await loadDirectoryItemsForDuplicateCheck(supabase);
  if (isPotentialDuplicate(validation.normalized, existingItems)) {
    return { ok: false, error: "Kontakt vypadá jako duplicitní. Zkontroluj název nebo telefon a případně uprav existující záznam." };
  }
  const workflowStatus = deriveWorkflowStatusForDirectory(validation.normalized);

  const { data, error } = await supabase
    .from("directory")
    .insert([
      {
        name: validation.normalized.name,
        category: validation.normalized.category,
        city_department:
          validation.normalized.category === "město" && validation.normalized.cityDepartment !== "vše"
            ? validation.normalized.cityDepartment
            : null,
        phone: validation.normalized.phone,
        address: validation.normalized.address,
        hours: validation.normalized.hours || null,
        note: validation.normalized.note || null,
        email: validation.normalized.email || null,
        website: validation.normalized.website || null,
        source_url: validation.normalized.sourceUrl || null,
        appointment_url: validation.normalized.appointmentUrl || null,
        appointment_label: validation.normalized.appointmentLabel || null,
        source_kind: "manual",
        is_locked: false,
        workflow_status: workflowStatus,
        updated_at: new Date().toISOString(),
        updated_by_email: user.email ?? null,
      },
    ])
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked, workflow_status, updated_at, updated_by_email",
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
  await insertAuditLog(supabase, {
    entityType: "directory",
    entityId: data.id,
    action: "create",
    summary: `Vytvořen kontakt „${data.name}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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

  const validation = validateDirectoryInput(input);
  if (!validation.ok) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const existingItems = await loadDirectoryItemsForDuplicateCheck(supabase);
  if (isPotentialDuplicate(validation.normalized, existingItems, input.id)) {
    return { ok: false, error: "Kontakt vypadá jako duplicitní. Slouč ho raději s existujícím záznamem." };
  }
  const workflowStatus = deriveWorkflowStatusForDirectory(validation.normalized);

  const { data, error } = await supabase
    .from("directory")
    .update({
      name: validation.normalized.name,
      category: validation.normalized.category,
      city_department:
        validation.normalized.category === "město" && validation.normalized.cityDepartment !== "vše"
          ? validation.normalized.cityDepartment
          : null,
      phone: validation.normalized.phone,
      address: validation.normalized.address,
      hours: validation.normalized.hours || null,
      note: validation.normalized.note || null,
      email: validation.normalized.email || null,
      website: validation.normalized.website || null,
      source_url: validation.normalized.sourceUrl || null,
      appointment_url: validation.normalized.appointmentUrl || null,
      appointment_label: validation.normalized.appointmentLabel || null,
      workflow_status: workflowStatus,
      updated_at: new Date().toISOString(),
      updated_by_email: user.email ?? null,
    })
    .eq("id", input.id)
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked, workflow_status, updated_at, updated_by_email",
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
  await insertAuditLog(supabase, {
    entityType: "directory",
    entityId: data.id,
    action: "update",
    summary: `Upraven kontakt „${data.name}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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
  await insertAuditLog(supabase, {
    entityType: "directory",
    entityId: id,
    action: "delete",
    summary: `Smazán kontakt ${id}`,
    actorEmail: user.email,
  });

  return { ok: true, id };
}

export async function bulkDeleteDirectoryAction(ids: string[]): Promise<
  | { ok: true; ids: string[] }
  | { ok: false; error: string }
> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManageDirectory) {
    return { ok: false, error: "Tento účet nemá právo mazat kontakty a adresář." };
  }

  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return { ok: false, error: "Nejsou vybrané žádné kontakty." };
  }

  const { data: lockedItems, error: loadError } = await supabase
    .from("directory")
    .select("id")
    .in("id", uniqueIds)
    .eq("is_locked", true);

  if (loadError) {
    console.error("bulk load directory before delete:", loadError);
    return { ok: false, error: "Nepodařilo se ověřit vybrané kontakty před smazáním." };
  }

  if ((lockedItems ?? []).length > 0) {
    return { ok: false, error: "Ve výběru jsou synchronizované kontakty. Ty se musí měnit přes zdroj nebo sync." };
  }

  const { error } = await supabase.from("directory").delete().in("id", uniqueIds);

  if (error) {
    console.error("bulk delete directory:", error);
    return { ok: false, error: "Hromadné mazání kontaktů v Supabase selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/adresar");
  revalidatePath("/kontakty");
  revalidatePath("/mesto");
  await Promise.all(
    uniqueIds.map((id) =>
      insertAuditLog(supabase, {
        entityType: "directory",
        entityId: id,
        action: "delete",
        summary: `Hromadně smazán kontakt ${id}`,
        actorEmail: user.email,
      }),
    ),
  );

  return { ok: true, ids: uniqueIds };
}

export async function getDirectorySyncPreviewAction(): Promise<
  | {
      ok: true;
      summary: {
        total: number;
        locked: number;
        stale: number;
        missingEmail: number;
        missingHours: number;
        lastSyncedAt: string | null;
      };
    }
  | { ok: false; error: string }
> {
  const { supabase, user, access } = await getAuthorizedAccess();

  if (!user || !access.allowed || !access.permissions?.canManageDirectory) {
    return { ok: false, error: "Tento účet nemá právo načítat synchronizační náhled." };
  }

  const { data, error } = await supabase
    .from("directory")
    .select("id, category, hours, email, source_kind, source_synced_at, is_locked")
    .eq("source_kind", "vimperk_web");

  if (error || !data) {
    console.error("directory sync preview:", error);
    return { ok: false, error: "Náhled synchronizace se nepodařilo načíst." };
  }

  const staleThreshold = Date.now() - 1000 * 60 * 60 * 24 * 14;
  const syncedTimestamps = data
    .map((item) => item.source_synced_at)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime());

  return {
    ok: true,
    summary: {
      total: data.length,
      locked: data.filter((item) => item.is_locked).length,
      stale: data.filter((item) => {
        if (!item.source_synced_at) return true;
        return new Date(item.source_synced_at).getTime() < staleThreshold;
      }).length,
      missingEmail: data.filter((item) => !item.email).length,
      missingHours: data.filter((item) => !item.hours).length,
      lastSyncedAt: syncedTimestamps[0] ?? null,
    },
  };
}

function normalizePollResult(data: {
  id: string;
  question: string;
  category: string;
  ends_at: string;
  workflow_status?: AdminWorkflowStatus;
  updated_at?: string | null;
  updated_by_email?: string | null;
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
    workflowStatus: data.workflow_status ?? undefined,
    updatedAt: data.updated_at ?? undefined,
    updatedByEmail: data.updated_by_email ?? undefined,
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
  const workflowStatus = deriveWorkflowStatusForPoll({
    question: input.question,
    options: sanitizedOptions,
  });

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert([
      {
        question: input.question,
        category: input.category,
        ends_at: input.endsAt,
        workflow_status: workflowStatus,
        updated_at: new Date().toISOString(),
        updated_by_email: user.email ?? null,
      },
    ])
    .select("id, question, category, ends_at, workflow_status, updated_at, updated_by_email")
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
    .select("id, question, category, ends_at, workflow_status, updated_at, updated_by_email, poll_options(id, text, votes, sort_order)")
    .eq("id", poll.id)
    .single();

  if (error || !data) {
    console.error("reload poll:", error);
    return { ok: false, error: "Načtení uložené ankety selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/hlasovani");
  revalidatePath("/mesto");
  await insertAuditLog(supabase, {
    entityType: "poll",
    entityId: poll.id,
    action: "create",
    summary: `Vytvořena anketa „${poll.question}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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
  const workflowStatus = deriveWorkflowStatusForPoll({
    question: input.question,
    options: sanitizedOptions,
  });

  const { error: pollError } = await supabase
    .from("polls")
    .update({
      question: input.question,
      category: input.category,
      ends_at: input.endsAt,
      workflow_status: workflowStatus,
      updated_at: new Date().toISOString(),
      updated_by_email: user.email ?? null,
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
    .select("id, question, category, ends_at, workflow_status, updated_at, updated_by_email, poll_options(id, text, votes, sort_order)")
    .eq("id", input.id)
    .single();

  if (error || !data) {
    console.error("reload updated poll:", error);
    return { ok: false, error: "Načtení upravené ankety selhalo." };
  }

  revalidatePath("/admin");
  revalidatePath("/hlasovani");
  revalidatePath("/mesto");
  await insertAuditLog(supabase, {
    entityType: "poll",
    entityId: input.id,
    action: "update",
    summary: `Upravena anketa „${data.question}“`,
    actorEmail: user.email,
    metadata: { workflowStatus },
  });

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
  await insertAuditLog(supabase, {
    entityType: "poll",
    entityId: id,
    action: "delete",
    summary: `Smazána anketa ${id}`,
    actorEmail: user.email,
  });

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
    .update({ status: input.status, updated_at: new Date().toISOString(), updated_by_email: user.email ?? null })
    .eq("id", input.id)
    .select("id, title, description, category, status, created_at, updated_at, updated_by_email")
    .single();

  if (error || !data) {
    console.error("update report:", error);
    return { ok: false, error: "Změna stavu závady v Supabase selhala." };
  }

  revalidatePath("/admin");
  await insertAuditLog(supabase, {
    entityType: "report",
    entityId: input.id,
    action: "status",
    summary: `Změněn stav závady „${data.title}“ na ${input.status}`,
    actorEmail: user.email,
    metadata: { status: input.status },
  });

  return {
    ok: true,
    item: {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      date: data.created_at.slice(0, 10),
      updatedAt: data.updated_at ?? undefined,
      updatedByEmail: data.updated_by_email ?? undefined,
    },
  };
}
