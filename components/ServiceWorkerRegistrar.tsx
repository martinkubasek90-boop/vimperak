"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/push-client";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (isNativeApp()) return;
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;

    const activateWaitingWorker = (registration: ServiceWorkerRegistration) => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          updateViaCache: "none",
        });

        console.log("[SW] Registered, scope:", registration.scope);

        if (registration.waiting) {
          activateWaitingWorker(registration);
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              activateWaitingWorker(registration);
            }
          });
        });

        const refresh = () => registration.update().catch((err) => console.error("[SW] Update check failed:", err));
        window.addEventListener("focus", refresh);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") refresh();
        });
      } catch (err) {
        console.error("[SW] Registration failed:", err);
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    void registerServiceWorker();
  }, []);

  return null;
}
