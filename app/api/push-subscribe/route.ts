import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import {
  initVapid,
  removeNativePushRegistration,
  removeWebPushSubscription,
  saveNativePushRegistration,
  saveWebPushSubscription,
} from "@/lib/push-subscriptions";

export const dynamic = "force-dynamic";

type PushSubscribeRequest =
  | {
      type: "web";
      subscription: webpush.PushSubscription;
      topics?: string[];
    }
  | {
      type: "native";
      token: string;
      platform: "android" | "ios";
      topics?: string[];
    };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PushSubscribeRequest;

    if (body.type === "native") {
      if (!body.token || !body.platform) {
        return NextResponse.json({ error: "Invalid native token" }, { status: 400 });
      }

      const result = await saveNativePushRegistration({
        token: body.token,
        platform: body.platform,
        topics: body.topics ?? [],
      });

      return NextResponse.json({ success: true, mode: "native", ...result });
    }

    const subscription = body.type === "web" ? body.subscription : body;
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    initVapid();
    const result = await saveWebPushSubscription(subscription, body.type === "web" ? body.topics ?? [] : []);

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Vimperk — notifikace aktivní ✓",
        body: "Budete informováni o důležitých zprávách z Vimperka.",
        icon: "/icons/icon-192.png",
        url: "/",
      })
    );

    return NextResponse.json({ success: true, mode: "web", ...result });
  } catch (err) {
    console.error("[push-subscribe]", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as { type?: "web" | "native"; endpoint?: string; token?: string };

    if (body.type === "native") {
      if (!body.token) {
        return NextResponse.json({ error: "Missing native token" }, { status: 400 });
      }

      const result = await removeNativePushRegistration(body.token);
      return NextResponse.json({ success: true, mode: "native", ...result });
    }

    if (!body.endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const result = await removeWebPushSubscription(body.endpoint);
    return NextResponse.json({ success: true, mode: "web", ...result });
  } catch (err) {
    console.error("[push-unsubscribe]", err);
    return NextResponse.json({ error: "Unsubscribe failed" }, { status: 500 });
  }
}
