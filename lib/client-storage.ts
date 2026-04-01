"use client";

import {
  DEFAULT_HOME_PREFERENCES,
  sanitizeHomePreferences,
  type HomePreferences,
} from "@/lib/user-preferences";

const HOME_PREFS_KEY = "vimperk.home.preferences";

export function loadHomePreferences(): HomePreferences {
  if (typeof window === "undefined") return DEFAULT_HOME_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(HOME_PREFS_KEY);
    if (!raw) return DEFAULT_HOME_PREFERENCES;
    return sanitizeHomePreferences(JSON.parse(raw) as Partial<HomePreferences>);
  } catch {
    return DEFAULT_HOME_PREFERENCES;
  }
}

export function saveHomePreferences(preferences: HomePreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOME_PREFS_KEY, JSON.stringify(preferences));
}
