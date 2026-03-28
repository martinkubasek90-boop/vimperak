import { events as mockEvents, news as mockNews, reports as mockReports } from "@/lib/admin-mock";
import type {
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
