import { Capacitor } from "@capacitor/core";

const INSTALLATION_ID_KEY = "vimperk.installation.id";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function getNativePlatform() {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android" ? platform : null;
}

export function base64UrlToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function getAnonymousInstallationId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(INSTALLATION_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(INSTALLATION_ID_KEY, generated);
  return generated;
}
