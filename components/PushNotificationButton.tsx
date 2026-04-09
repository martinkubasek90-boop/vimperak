"use client";

import { useState, useEffect } from "react";
import type { PluginListenerHandle } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import {
  base64UrlToUint8Array,
  getAnonymousInstallationId,
  getNativePlatform,
  isNativeApp,
} from "@/lib/push-client";
import { NOTIFICATION_TOPICS, type NotificationTopicId } from "@/lib/user-preferences";

type State = "idle" | "loading" | "subscribed" | "denied" | "unsupported";

export default function PushNotificationButton({
  topics = [],
  onTopicsChange,
}: {
  topics?: NotificationTopicId[];
  onTopicsChange?: (topics: NotificationTopicId[]) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [nativeToken, setNativeToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const installationId = getAnonymousInstallationId();

  useEffect(() => {
    if (isNativeApp()) {
      let registrationListener: PluginListenerHandle | null = null;
      let registrationErrorListener: PluginListenerHandle | null = null;

      const setupNativePush = async () => {
        const permission = await PushNotifications.checkPermissions();

        if (permission.receive === "granted") {
          setState("subscribed");
        } else if (permission.receive === "denied") {
          setState("denied");
        } else {
          setState("idle");
        }
        setErrorMessage(null);
      };

      const bindNativeListeners = async () => {
        registrationListener = await PushNotifications.addListener("registration", async ({ value }) => {
          const platform = getNativePlatform();

          if (!platform) {
            setState("unsupported");
            setErrorMessage("Nepodařilo se rozpoznat zařízení pro notifikace.");
            return;
          }

          setNativeToken(value);

          const response = await fetch("/api/push-subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "native",
              token: value,
              platform,
              topics,
              installationId,
            }),
          });

          if (!response.ok) {
            setState("idle");
            setErrorMessage("Registrace notifikací se nepodařila dokončit.");
            throw new Error("Native push registration upload failed");
          }

          setErrorMessage(null);
          setState("subscribed");
        });

        registrationErrorListener = await PushNotifications.addListener("registrationError", (error) => {
          console.error("[native push registration]", error);
          setErrorMessage("Systém odmítl registraci notifikací.");
          setState("idle");
        });
      };

      void setupNativePush();
      void bindNativeListeners();

      return () => {
        void registrationListener?.remove();
        void registrationErrorListener?.remove();
      };
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      setErrorMessage(null);
      return;
    }
    if (Notification.permission === "granted") setState("subscribed");
    if (Notification.permission === "denied")  setState("denied");
  }, [topics]);

  useEffect(() => {
    if (state !== "subscribed") return;

    if (isNativeApp()) {
      if (!nativeToken) return;
      const platform = getNativePlatform();
      if (!platform) return;
      void fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "native",
          token: nativeToken,
          platform,
          topics,
          installationId,
        }),
      });
      return;
    }

    if (!("serviceWorker" in navigator)) return;
    void (async () => {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (!sub) return;
      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "web", subscription: sub.toJSON(), topics, installationId }),
      });
    })();
  }, [nativeToken, state, topics]);

  async function subscribe() {
    setState("loading");
    setErrorMessage(null);
    try {
      if (isNativeApp()) {
        const permission = await PushNotifications.requestPermissions();

        if (permission.receive !== "granted") {
          setState("denied");
          return;
        }

        await PushNotifications.register();
        return;
      }

      // Register SW
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Request permission
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState("denied"); return; }

      // Subscribe to push
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("Missing VAPID public key");
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: base64UrlToUint8Array(vapidPublicKey),
      });

      // Send to server
      await fetch("/api/push-subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type: "web", subscription: sub.toJSON(), topics, installationId }),
      });

      setState("subscribed");
    } catch (err) {
      console.error("[push]", err);
      setErrorMessage("Notifikace se nepodařilo zapnout. Zkus to prosím znovu.");
      setState("idle");
    }
  }

  async function unsubscribe() {
    try {
      setErrorMessage(null);
      if (isNativeApp()) {
        if (nativeToken) {
          await fetch("/api/push-subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "native", token: nativeToken }),
          });
        }

        setNativeToken(null);
        setState("idle");
        return;
      }

      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push-subscribe", {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ type: "web", endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("idle");
    } catch (err) {
      console.error("[push unsubscribe]", err);
      setErrorMessage("Notifikace se nepodařilo vypnout.");
    }
  }

  if (state === "unsupported") return null;

  const deniedMessage = isNativeApp()
    ? "Notifikace blokovány v nastavení zařízení"
    : "Notifikace blokovány v nastavení prohlížeče";

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
          {deniedMessage}
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

      {errorMessage ? (
        <p className="mt-3 text-sm font-medium" style={{ color: "var(--error)" }}>
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
          Témata notifikací
        </p>
        <div className="flex flex-wrap gap-2">
          {NOTIFICATION_TOPICS.map((topic) => {
            const active = topics.includes(topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  if (!onTopicsChange) return;
                  onTopicsChange(
                    active
                      ? topics.filter((item) => item !== topic.id)
                      : [...topics, topic.id],
                  );
                }}
                className="rounded-full px-3 py-2 text-xs font-semibold"
                style={active
                  ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                  : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
              >
                {topic.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
