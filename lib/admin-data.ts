import {
  auditLog as mockAuditLog,
  directory as mockDirectory,
  events as mockEvents,
  news as mockNews,
  polls as mockPolls,
  reports as mockReports,
} from "@/lib/admin-mock";
import type {
  AdminDirectoryItem,
  AdminAuditLogItem,
  AdminEventItem,
  AdminNewsItem,
  AdminPollItem,
  AdminReportItem,
  AdminReportStatus,
  AdminWorkflowStatus,
} from "@/lib/admin-types";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co",
  );
}

function formatDate(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function normalizeMockDirectoryItem(item: (typeof mockDirectory)[number]): AdminDirectoryItem {
  const candidate = item as {
    id: number;
    name: string;
    category: string;
    cityDepartment?: string;
    phone: string;
    address: string;
    hours?: string;
    note?: string;
    email?: string;
    website?: string;
    sourceUrl?: string;
    appointmentUrl?: string;
    appointmentLabel?: string;
    workflowStatus?: AdminWorkflowStatus;
  };

  return {
    id: candidate.id,
    name: candidate.name,
    category: candidate.category,
    cityDepartment: candidate.cityDepartment,
    phone: candidate.phone,
    address: candidate.address,
    hours: candidate.hours,
    note: candidate.note,
    email: candidate.email,
    website: candidate.website,
    sourceUrl: candidate.sourceUrl,
    appointmentUrl: candidate.appointmentUrl,
    appointmentLabel: candidate.appointmentLabel,
    workflowStatus: candidate.workflowStatus,
  };
}

export async function getAdminNews(): Promise<AdminNewsItem[]> {
  if (!isSupabaseConfigured()) {
    return mockNews.map((item) => ({
      ...item,
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, summary, category, urgent, published_at, workflow_status, updated_at, updated_by_email")
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("admin news:", error);
    return mockNews.map((item) => ({
      ...item,
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.category,
    urgent: item.urgent,
    date: formatDate(item.published_at),
    workflowStatus: item.workflow_status,
    updatedAt: item.updated_at ?? undefined,
    updatedByEmail: item.updated_by_email ?? undefined,
  }));
}

export async function getAdminEvents(): Promise<AdminEventItem[]> {
  if (!isSupabaseConfigured()) {
    return mockEvents.map((item) => ({
      ...item,
      price: item.price ?? "",
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, date, time, place, category, free, price, workflow_status, updated_at, updated_by_email")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error || !data) {
    console.error("admin events:", error);
    return mockEvents.map((item) => ({
      ...item,
      price: item.price ?? "",
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    time: item.time.slice(0, 5),
    place: item.place,
    category: item.category,
    free: item.free,
    price: item.price ?? "",
    workflowStatus: item.workflow_status,
    updatedAt: item.updated_at ?? undefined,
    updatedByEmail: item.updated_by_email ?? undefined,
  }));
}

export async function getAdminDirectory(): Promise<AdminDirectoryItem[]> {
  if (!isSupabaseConfigured()) {
    return mockDirectory.map(normalizeMockDirectoryItem);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("directory")
    .select(
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label, source_kind, source_external_id, source_synced_at, is_locked, workflow_status, updated_at, updated_by_email",
    )
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("admin directory:", error);
    return mockDirectory.map(normalizeMockDirectoryItem);
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    cityDepartment: item.city_department ?? undefined,
    phone: item.phone,
    address: item.address,
    hours: item.hours ?? undefined,
    note: item.note ?? undefined,
    email: item.email ?? undefined,
    website: item.website ?? undefined,
    sourceUrl: item.source_url ?? undefined,
    appointmentUrl: item.appointment_url ?? undefined,
    appointmentLabel: item.appointment_label ?? undefined,
    sourceKind: item.source_kind ?? "manual",
    sourceExternalId: item.source_external_id ?? undefined,
    sourceSyncedAt: item.source_synced_at ?? undefined,
    isLocked: item.is_locked ?? false,
    workflowStatus: item.workflow_status ?? undefined,
    updatedAt: item.updated_at ?? undefined,
    updatedByEmail: item.updated_by_email ?? undefined,
  }));
}

export async function getAdminPolls(): Promise<AdminPollItem[]> {
  if (!isSupabaseConfigured()) {
    return mockPolls.map((item) => ({
      ...item,
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("polls")
    .select("id, question, category, ends_at, workflow_status, updated_at, updated_by_email, poll_options(id, text, votes, sort_order)")
    .order("ends_at", { ascending: true });

  if (error || !data) {
    console.error("admin polls:", error);
    return mockPolls.map((item) => ({
      ...item,
      workflowStatus: item.workflowStatus as AdminWorkflowStatus | undefined,
    }));
  }

  return data.map((item) => {
    const options = [...(item.poll_options ?? [])]
      .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
      .map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      }));

    return {
      id: item.id,
      question: item.question,
      category: item.category,
      endsAt: item.ends_at,
      totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
      options,
      workflowStatus: item.workflow_status ?? undefined,
      updatedAt: item.updated_at ?? undefined,
      updatedByEmail: item.updated_by_email ?? undefined,
    };
  });
}

export async function getAdminReports(): Promise<AdminReportItem[]> {
  if (!isSupabaseConfigured()) {
    return mockReports.map((item) => ({
      ...item,
      status: item.status as AdminReportStatus,
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, title, description, category, status, created_at, updated_at, updated_by_email")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("admin reports:", error);
    return mockReports.map((item) => ({
      ...item,
      status: item.status as AdminReportStatus,
    }));
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    date: formatDate(item.created_at),
    updatedAt: item.updated_at ?? undefined,
    updatedByEmail: item.updated_by_email ?? undefined,
  }));
}

export async function getAdminAuditLog(): Promise<AdminAuditLogItem[]> {
  if (!isSupabaseConfigured()) {
    return mockAuditLog as AdminAuditLogItem[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("id, entity_type, entity_id, action, summary, actor_email, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    console.error("admin audit log:", error);
    return mockAuditLog as AdminAuditLogItem[];
  }

  return data.map((item) => ({
    id: item.id,
    entityType: item.entity_type,
    entityId: item.entity_id,
    action: item.action,
    summary: item.summary,
    actorEmail: item.actor_email ?? undefined,
    createdAt: item.created_at,
  }));
}
