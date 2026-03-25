/**
 * Unified data service — tries Supabase, falls back to mock data.
 * Pages use this instead of importing from supabase or data directly.
 */
import { supabase } from "./supabase";
import * as mock from "./data";

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co";

// ─── Events ───────────────────────────────────────────────────────────────────
export async function getEvents() {
  if (!isSupabaseConfigured) return mock.events;
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  if (error) { console.error("events:", error); return mock.events; }
  return data ?? mock.events;
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNews() {
  if (!isSupabaseConfigured) return mock.news;
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) { console.error("news:", error); return mock.news; }
  return data ?? mock.news;
}

// ─── Directory ────────────────────────────────────────────────────────────────
export async function getDirectory() {
  if (!isSupabaseConfigured) return mock.directory;
  const { data, error } = await supabase
    .from("directory")
    .select("*")
    .order("name");
  if (error) { console.error("directory:", error); return mock.directory; }
  return data ?? mock.directory;
}

// ─── Bus Lines ────────────────────────────────────────────────────────────────
export async function getBusLines() {
  if (!isSupabaseConfigured) return mock.busLines;
  const { data, error } = await supabase
    .from("bus_lines")
    .select("*")
    .order("number");
  if (error) { console.error("bus_lines:", error); return mock.busLines; }
  return data ?? mock.busLines;
}

// ─── Polls ────────────────────────────────────────────────────────────────────
export async function getPolls() {
  if (!isSupabaseConfigured) return mock.polls;
  const { data, error } = await supabase
    .from("polls")
    .select("*, poll_options(*)")
    .order("created_at", { ascending: false });
  if (error) { console.error("polls:", error); return mock.polls; }
  return data ?? mock.polls;
}

// ─── Vote ─────────────────────────────────────────────────────────────────────
export async function castVote(optionId: string) {
  if (!isSupabaseConfigured) return { success: true };
  const { error } = await supabase.rpc("increment_vote", { option_id: optionId });
  if (error) { console.error("vote:", error); return { success: false }; }
  return { success: true };
}

// ─── Submit Report ────────────────────────────────────────────────────────────
export async function submitReport(report: {
  title: string;
  description: string;
  category: string;
  lat?: number;
  lng?: number;
  address?: string;
  photo_url?: string;
  reporter_email?: string;
}) {
  if (!isSupabaseConfigured) {
    console.log("Mock report submitted:", report);
    return { success: true, id: "mock-" + Date.now() };
  }
  const { data, error } = await supabase.from("reports").insert([report]).select("id").single();
  if (error) { console.error("report:", error); return { success: false }; }
  return { success: true, id: data.id };
}

// ─── Admin: Insert News ────────────────────────────────────────────────────────
export async function insertNews(item: {
  title: string;
  summary: string;
  body?: string;
  category: string;
  urgent: boolean;
}) {
  if (!isSupabaseConfigured) return { success: true };
  const { error } = await supabase.from("news").insert([item]);
  if (error) { console.error("insert news:", error); return { success: false }; }
  return { success: true };
}

// ─── Admin: Insert Event ───────────────────────────────────────────────────────
export async function insertEvent(item: {
  title: string;
  description?: string;
  date: string;
  time: string;
  place: string;
  category: string;
  free: boolean;
  price?: string;
}) {
  if (!isSupabaseConfigured) return { success: true };
  const { error } = await supabase.from("events").insert([item]);
  if (error) { console.error("insert event:", error); return { success: false }; }
  return { success: true };
}
