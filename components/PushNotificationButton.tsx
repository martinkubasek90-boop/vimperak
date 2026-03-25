"use client";

import { useState, useEffect } from "react";

type State = "idle" | "loading" | "subscribed" | "denied" | "unsupported";

export default function PushNotificationButton() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "granted") setState("subscribed");
    if (Notification.permission === "denied")  setState("denied");
  }, []);

  async function subscribe() {
    setState("loading");
    try {
      // Register SW
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Request permission
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState("denied"); return; }

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      });

      // Send to server
      await fetch("/api/push-subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(sub),
      });

      setState("subscribed");
    } catch (err) {
      console.error("[push]", err);
      setState("idle");
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push-subscribe", {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("idle");
    } catch (err) {
      console.error("[push unsubscribe]", err);
    }
  }

  if (state === "unsupported") return null;

  return (
    <div>
      {state === "subscribed" ? (
        <button
          onClick={unsubscribe}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-2xl transition-all active:scale-95"
          style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            notifications_active
          </span>
          Notifikace zapnuty
        </button>
      ) : state === "denied" ? (
        <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-2xl"
             style={{ background: "var(--error-container)", color: "var(--on-error-container)" }}>
          <span className="material-symbols-outlined text-base">notifications_off</span>
          Notifikace blokovány v nastavení prohlížeče
        </div>
      ) : (
        <button
          onClick={subscribe}
          disabled={state === "loading"}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-2xl transition-all active:scale-95 disabled:opacity-60"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          <span className="material-symbols-outlined text-base">
            {state === "loading" ? "sync" : "notifications"}
          </span>
          {state === "loading" ? "Aktivuji…" : "Zapnout notifikace"}
        </button>
      )}
    </div>
  );
}

