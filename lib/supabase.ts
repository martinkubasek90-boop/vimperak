import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types matching the DB schema ─────────────────────────────────────────────

export type DbEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  place: string;
  category: "kultura" | "sport" | "kino" | "úřad" | "trhy";
  free: boolean;
  price: string | null;
  created_at: string;
};

export type DbNews = {
  id: string;
  title: string;
  summary: string;
  body: string | null;
  category: "radnice" | "sport" | "kultura" | "upozornění" | "komunita";
  urgent: boolean;
  published_at: string;
};

export type DbDirectoryItem = {
  id: string;
  name: string;
  category: "taxi" | "restaurace" | "lékař" | "lékárna" | "opravna" | "sport" | "ubytování" | "obchod";
  phone: string;
  address: string;
  hours: string | null;
  rating: number | null;
  note: string | null;
};

export type DbBusLine = {
  id: string;
  number: string;
  from_stop: string;
  to_stop: string;
  departures: string[];
  note: string | null;
};

export type DbPoll = {
  id: string;
  question: string;
  category: string;
  ends_at: string;
  poll_options: DbPollOption[];
};

export type DbPollOption = {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
  sort_order: number;
};

export type DbReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "přijato" | "v řešení" | "vyřešeno" | "zamítnuto";
  lat: number | null;
  lng: number | null;
  address: string | null;
  photo_url: string | null;
  reporter_email: string | null;
  created_at: string;
};
