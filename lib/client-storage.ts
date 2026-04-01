"use client";

import {
  DEFAULT_HOME_PREFERENCES,
  sanitizeHomePreferences,
  type HomePreferences,
} from "@/lib/user-preferences";

const HOME_PREFS_KEY = "vimperk.home.preferences";
const RECENT_SEARCHES_KEY = "vimperk.recent.searches";
const RECENT_VIEWS_KEY = "vimperk.recent.views";

export type RecentViewItem = {
  id: string;
  type: "news" | "event" | "directory" | "poll" | "page";
  title: string;
  href: string;
  subtitle?: string;
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
