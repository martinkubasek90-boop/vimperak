import webpush from "web-push";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type NativePlatform = "android" | "ios";

export type NativePushRegistration = {
  token: string;
  platform: NativePlatform;
  topics?: string[];
  installationId?: string;
};

type NativePushRow = {
  token: string;
  platform: NativePlatform;
  last_seen_at: string;
  topics?: string[];
  installation_id?: string | null;
};

type WebPushStored = {
  subscription: webpush.PushSubscription;
  topics: string[];
  installationId?: string;
};

const webSubscriptions = new Map<string, WebPushStored>();
const nativeRegistrations = new Map<string, NativePushRow>();

function hasSupabaseServiceRole() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co",
  );
}

function createSupabaseAdminClient(): SupabaseClient | null {
  if (!hasSupabaseServiceRole()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function saveWebPushSubscription(
  subscription: webpush.PushSubscription,
  topics: string[] = [],
  installationId?: string,
) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    webSubscriptions.set(subscription.endpoint, { subscription, topics, installationId });
    return { persisted: false, total: webSubscriptions.size };
  }

  const { error } = await supabase.from("web_push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      subscription,
      topics,
      installation_id: installationId ?? null,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    throw error;
  }

  const { count, error: countError } = await supabase
    .from("web_push_subscriptions")
    .select("endpoint", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  return { persisted: true, total: count ?? 0 };
}

export async function removeWebPushSubscription(endpoint: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    webSubscriptions.delete(endpoint);
    return { persisted: false, total: webSubscriptions.size };
  }

  const { error } = await supabase.from("web_push_subscriptions").delete().eq("endpoint", endpoint);

  if (error) {
    throw error;
  }

  const { count, error: countError } = await supabase
    .from("web_push_subscriptions")
    .select("endpoint", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  return { persisted: true, total: count ?? 0 };
}

export async function saveNativePushRegistration(registration: NativePushRegistration) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    nativeRegistrations.set(registration.token, {
      token: registration.token,
      platform: registration.platform,
      topics: registration.topics,
      installation_id: registration.installationId,
      last_seen_at: new Date().toISOString(),
    });
    return { persisted: false, total: nativeRegistrations.size };
  }

  const { error } = await supabase.from("device_push_tokens").upsert(
    {
      token: registration.token,
      platform: registration.platform,
      topics: registration.topics ?? [],
      installation_id: registration.installationId ?? null,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );

  if (error) {
    throw error;
  }

  const { count, error: countError } = await supabase
    .from("device_push_tokens")
    .select("token", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  return { persisted: true, total: count ?? 0 };
}

export async function removeNativePushRegistration(token: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    nativeRegistrations.delete(token);
    return { persisted: false, total: nativeRegistrations.size };
  }

  const { error } = await supabase.from("device_push_tokens").delete().eq("token", token);

  if (error) {
    throw error;
  }

  const { count, error: countError } = await supabase
    .from("device_push_tokens")
    .select("token", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  return { persisted: true, total: count ?? 0 };
}

export async function listWebPushSubscriptions() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [...webSubscriptions.values()];
  }

  const { data, error } = await supabase
    .from("web_push_subscriptions")
    .select("subscription, topics, installation_id")
    .order("last_seen_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => ({
      subscription: row.subscription as webpush.PushSubscription | null,
      topics: Array.isArray(row.topics) ? row.topics.filter((item): item is string => typeof item === "string") : [],
      installationId: typeof row.installation_id === "string" ? row.installation_id : undefined,
    }))
    .filter((row): row is { subscription: webpush.PushSubscription; topics: string[]; installationId: string | undefined } => Boolean(row.subscription?.endpoint));
}

export async function listNativePushRegistrations() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [...nativeRegistrations.values()];
  }

  const { data, error } = await supabase
    .from("device_push_tokens")
    .select("token, platform, last_seen_at, topics, installation_id")
    .order("last_seen_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as NativePushRow[];
}

export function initVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_CONTACT ?? "mailto:info@vimperk.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}
