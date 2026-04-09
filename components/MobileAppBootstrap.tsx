"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PushNotifications } from "@capacitor/push-notifications";
import { isNativeApp } from "@/lib/push-client";

export default function MobileAppBootstrap() {
  const router = useRouter();

  useEffect(() => {
    if (!isNativeApp()) return;

    let actionListener: { remove: () => Promise<void> } | null = null;

    const bindListeners = async () => {
      actionListener = await PushNotifications.addListener("pushNotificationActionPerformed", (event) => {
        const rawUrl = event.notification.data?.url;

        if (typeof rawUrl !== "string" || !rawUrl.startsWith("/")) {
          return;
        }

        router.push(rawUrl);
      });
    };

    void bindListeners();

    return () => {
      void actionListener?.remove();
    };
  }, [router]);

  return null;
}
