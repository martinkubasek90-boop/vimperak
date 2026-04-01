"use client";

import {
  DEFAULT_HOME_PREFERENCES,
  sanitizeHomePreferences,
  type HomePreferences,
} from "@/lib/user-preferences";

const HOME_PREFS_KEY = "vimperk.home.preferences";
const RECENT_SEARCHES_KEY = "vimperk.recent.searches";
const RECENT_VIEWS_KEY = "vimperk.recent.views";
const TRACKED_REPORTS_KEY = "vimperk.tracked.reports";
const SAVED_EVENTS_KEY = "vimperk.saved.events";
const VOTED_POLLS_KEY = "vimperk.voted.polls";

export type RecentViewItem = {
  id: string;
  type: "news" | "event" | "directory" | "poll" | "page";
  title: string;
  href: string;
  subtitle?: string;
  savedAt: string;
};

export type TrackedReportItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  address?: string;
};

export type SavedEventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  category: string;
  reminder: "none" | "2h" | "1d";
  href: string;
  savedAt: string;
};

function isLocalStorageAvailable() {
  return typeof window !== "undefined";
}

function normalizeRecentView(input: unknown): RecentViewItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Partial<RecentViewItem>;
  if (!item.id || !item.type || !item.title || !item.href || !item.savedAt) return null;
  return {
    id: String(item.id),
    type: item.type,
    title: String(item.title),
    href: String(item.href),
    subtitle: item.subtitle ? String(item.subtitle) : undefined,
    savedAt: String(item.savedAt),
  };
}

function normalizeTrackedReport(input: unknown): TrackedReportItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Partial<TrackedReportItem>;
  if (!item.id || !item.title || !item.category || !item.status || !item.createdAt) return null;
  return {
    id: String(item.id),
    title: String(item.title),
    category: String(item.category),
    status: String(item.status),
    createdAt: String(item.createdAt),
    updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
    description: item.description ? String(item.description) : undefined,
    address: item.address ? String(item.address) : undefined,
  };
}

function normalizeSavedEvent(input: unknown): SavedEventItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Partial<SavedEventItem>;
  if (!item.id || !item.title || !item.date || !item.time || !item.place || !item.category || !item.reminder || !item.href || !item.savedAt) {
    return null;
  }
  return {
    id: String(item.id),
    title: String(item.title),
    date: String(item.date),
    time: String(item.time),
    place: String(item.place),
    category: String(item.category),
    reminder: item.reminder,
    href: String(item.href),
    savedAt: String(item.savedAt),
  };
}

async function syncHomePreferences(preferences: HomePreferences) {
  if (!isLocalStorageAvailable()) return;
  try {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homePreferences: preferences }),
    });
  } catch {
    // Guest mode and offline mode both fall back to local storage.
  }
}

export function loadHomePreferences(): HomePreferences {
  if (!isLocalStorageAvailable()) return DEFAULT_HOME_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(HOME_PREFS_KEY);
    if (!raw) return DEFAULT_HOME_PREFERENCES;
    return sanitizeHomePreferences(JSON.parse(raw) as Partial<HomePreferences>);
  } catch {
    return DEFAULT_HOME_PREFERENCES;
  }
}

export function saveHomePreferences(preferences: HomePreferences) {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(HOME_PREFS_KEY, JSON.stringify(preferences));
  void syncHomePreferences(preferences);
}

export async function loadRemoteHomePreferences() {
  if (!isLocalStorageAvailable()) return null;
  try {
    const response = await fetch("/api/preferences", { method: "GET", cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { homePreferences?: Partial<HomePreferences> | null };
    if (!payload.homePreferences) return null;
    const normalized = sanitizeHomePreferences(payload.homePreferences);
    window.localStorage.setItem(HOME_PREFS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return null;
  }
}

export function loadRecentSearches() {
  if (!isLocalStorageAvailable()) return [] as string[];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, 8)
      : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string) {
  if (!isLocalStorageAvailable()) return;
  const normalized = query.trim();
  if (!normalized) return;
  const next = [
    normalized,
    ...loadRecentSearches().filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
  ].slice(0, 8);
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function clearRecentSearches() {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function loadRecentViews() {
  if (!isLocalStorageAvailable()) return [] as RecentViewItem[];
  try {
    const raw = window.localStorage.getItem(RECENT_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeRecentView(item)).filter((item): item is RecentViewItem => Boolean(item)).slice(0, 8)
      : [];
  } catch {
    return [];
  }
}

export function saveRecentView(item: Omit<RecentViewItem, "savedAt">) {
  if (!isLocalStorageAvailable()) return;
  const nextItem: RecentViewItem = {
    ...item,
    savedAt: new Date().toISOString(),
  };
  const next = [
    nextItem,
    ...loadRecentViews().filter((current) => !(current.id === nextItem.id && current.type === nextItem.type && current.href === nextItem.href)),
  ].slice(0, 8);
  window.localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(next));
}

export function clearRecentViews() {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.removeItem(RECENT_VIEWS_KEY);
}

export function loadTrackedReports() {
  if (!isLocalStorageAvailable()) return [] as TrackedReportItem[];
  try {
    const raw = window.localStorage.getItem(TRACKED_REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeTrackedReport(item)).filter((item): item is TrackedReportItem => Boolean(item)).slice(0, 12)
      : [];
  } catch {
    return [];
  }
}

export function saveTrackedReport(item: TrackedReportItem) {
  if (!isLocalStorageAvailable()) return;
  const next = [
    item,
    ...loadTrackedReports().filter((current) => current.id !== item.id),
  ].slice(0, 12);
  window.localStorage.setItem(TRACKED_REPORTS_KEY, JSON.stringify(next));
}

export function replaceTrackedReports(items: TrackedReportItem[]) {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(TRACKED_REPORTS_KEY, JSON.stringify(items.slice(0, 12)));
}

export function findTrackedReport(id: string) {
  return loadTrackedReports().find((item) => item.id === id) ?? null;
}

export function loadSavedEvents() {
  if (!isLocalStorageAvailable()) return [] as SavedEventItem[];
  try {
    const raw = window.localStorage.getItem(SAVED_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeSavedEvent(item)).filter((item): item is SavedEventItem => Boolean(item)).slice(0, 24)
      : [];
  } catch {
    return [];
  }
}

export function saveSavedEvent(item: Omit<SavedEventItem, "savedAt">) {
  if (!isLocalStorageAvailable()) return;
  const nextItem: SavedEventItem = { ...item, savedAt: new Date().toISOString() };
  const next = [nextItem, ...loadSavedEvents().filter((current) => current.id !== nextItem.id)].slice(0, 24);
  window.localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(next));
}

export function removeSavedEvent(id: string) {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(
    SAVED_EVENTS_KEY,
    JSON.stringify(loadSavedEvents().filter((item) => item.id !== id)),
  );
}

export function updateSavedEventReminder(id: string, reminder: SavedEventItem["reminder"]) {
  if (!isLocalStorageAvailable()) return;
  const next = loadSavedEvents().map((item) => (
    item.id === id
      ? { ...item, reminder, savedAt: new Date().toISOString() }
      : item
  ));
  window.localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(next));
}

export function loadVotedPolls() {
  if (!isLocalStorageAvailable()) return {} as Record<string, string>;
  try {
    const raw = window.localStorage.getItem(VOTED_POLLS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([key, value]) => typeof key === "string" && typeof value === "string",
      ),
    ) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

export function saveVotedPoll(pollId: string | number, optionId: string | number) {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(
    VOTED_POLLS_KEY,
    JSON.stringify({
      ...loadVotedPolls(),
      [String(pollId)]: String(optionId),
    }),
  );
}
