import { directory as mockDirectory, events as mockEvents, news as mockNews, reports as mockReports } from "@/lib/admin-mock";
import type {
  AdminDirectoryItem,
  AdminEventItem,
  AdminNewsItem,
  AdminReportItem,
  AdminReportStatus,
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
  };
}

export async function getAdminNews(): Promise<AdminNewsItem[]> {
  if (!isSupabaseConfigured()) {
    return mockNews;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, summary, category, urgent, published_at")
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("admin news:", error);
    return mockNews;
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.category,
    urgent: item.urgent,
    date: formatDate(item.published_at),
  }));
}

export async function getAdminEvents(): Promise<AdminEventItem[]> {
  if (!isSupabaseConfigured()) {
    return mockEvents.map((item) => ({
      ...item,
      price: item.price ?? "",
    }));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, date, time, place, category, free, price")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error || !data) {
    console.error("admin events:", error);
    return mockEvents.map((item) => ({
      ...item,
      price: item.price ?? "",
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
      "id, name, category, city_department, phone, address, hours, note, email, website, source_url, appointment_url, appointment_label",
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
  }));
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
    .select("id, title, description, category, status, created_at")
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
  }));
}
