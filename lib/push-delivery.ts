import { createPrivateKey, createSign } from "node:crypto";
import webpush from "web-push";
import { initVapid, listNativePushRegistrations, listWebPushSubscriptions } from "@/lib/push-subscriptions";

type NativePlatform = "android" | "ios";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  urgent?: boolean;
  topics?: string[];
  installationIds?: string[];
};

type DeliveryStats = {
  attempted: number;
  delivered: number;
  failed: number;
};

type DeliveryReport = {
  web: DeliveryStats;
  android: DeliveryStats;
  ios: DeliveryStats;
};

type FirebaseAccessTokenCache = {
  token: string;
  expiresAt: number;
} | null;

let firebaseAccessTokenCache: FirebaseAccessTokenCache = null;

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getEnvMultiline(name: string) {
  const value = process.env[name];
  return value?.replace(/\\n/g, "\n");
}

function createJwt(payload: Record<string, unknown>, privateKeyPem: string, header: Record<string, unknown>) {
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();

  const signature = signer.sign(createPrivateKey(privateKeyPem));
  return `${unsignedToken}.${toBase64Url(signature)}`;
}

function createApnsJwt(teamId: string, keyId: string, privateKeyPem: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const encodedHeader = toBase64Url(JSON.stringify({ alg: "ES256", kid: keyId }));
  const encodedPayload = toBase64Url(JSON.stringify({ iss: teamId, iat: issuedAt }));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign("SHA256");
  signer.update(unsignedToken);
  signer.end();

  const signature = signer.sign({
    key: createPrivateKey(privateKeyPem),
    dsaEncoding: "ieee-p1363",
  });

  return `${unsignedToken}.${toBase64Url(signature)}`;
}

async function getFirebaseAccessToken() {
  if (firebaseAccessTokenCache && firebaseAccessTokenCache.expiresAt > Date.now() + 60_000) {
    return firebaseAccessTokenCache.token;
  }

  const projectId = process.env.FCM_PROJECT_ID;
  const clientEmail = process.env.FCM_CLIENT_EMAIL;
  const privateKeyPem = getEnvMultiline("FCM_PRIVATE_KEY");

  if (!projectId || !clientEmail || !privateKeyPem) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const assertion = createJwt(
    {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: issuedAt,
      exp: issuedAt + 3600,
    },
    privateKeyPem,
    { alg: "RS256", typ: "JWT" },
  );

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`FCM auth failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  firebaseAccessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

async function sendWebPush(payload: PushPayload) {
  initVapid();
  const subscriptions = await listWebPushSubscriptions();
  const filteredSubscriptions = subscriptions.filter(({ topics }) =>
    !payload.topics?.length || topics.length === 0 || topics.some((topic) => payload.topics?.includes(topic)),
  ).filter(({ installationId }) =>
    !payload.installationIds?.length || (installationId ? payload.installationIds.includes(installationId) : false),
  ).filter((row): row is { subscription: webpush.PushSubscription; topics: string[]; installationId?: string } => Boolean(row.subscription?.endpoint));
  const report: DeliveryStats = {
    attempted: filteredSubscriptions.length,
    delivered: 0,
    failed: 0,
  };

  await Promise.all(
    filteredSubscriptions.map(async ({ subscription }) => {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            url: payload.url ?? "/",
            tag: payload.tag,
            urgent: payload.urgent ?? false,
          }),
        );
        report.delivered += 1;
      } catch (error) {
        report.failed += 1;
        console.error("[push-send:web]", subscription.endpoint, error);
      }
    }),
  );

  return report;
}

async function sendFirebasePush(tokens: string[], payload: PushPayload) {
  const report: DeliveryStats = {
    attempted: tokens.length,
    delivered: 0,
    failed: 0,
  };

  if (!tokens.length) return report;

  const accessToken = await getFirebaseAccessToken();
  const projectId = process.env.FCM_PROJECT_ID;

  if (!accessToken || !projectId) {
    return report;
  }

  await Promise.all(
    tokens.map(async (token) => {
      try {
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: {
                title: payload.title,
                body: payload.body,
              },
              data: {
                url: payload.url ?? "/",
                tag: payload.tag ?? "",
                urgent: String(payload.urgent ?? false),
              },
              android: {
                priority: payload.urgent ? "high" : "normal",
                notification: {
                  clickAction: "OPEN_ACTIVITY_1",
                  tag: payload.tag,
                },
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`FCM send failed: ${response.status} ${await response.text()}`);
        }

        report.delivered += 1;
      } catch (error) {
        report.failed += 1;
        console.error("[push-send:android]", token, error);
      }
    }),
  );

  return report;
}

async function sendApnsPush(tokens: string[], payload: PushPayload) {
  const report: DeliveryStats = {
    attempted: tokens.length,
    delivered: 0,
    failed: 0,
  };

  if (!tokens.length) return report;

  const teamId = process.env.APNS_TEAM_ID;
  const keyId = process.env.APNS_KEY_ID;
  const privateKeyPem = getEnvMultiline("APNS_PRIVATE_KEY");
  const bundleId = process.env.APNS_BUNDLE_ID ?? "cz.vimperaci.app";

  if (!teamId || !keyId || !privateKeyPem) {
    return report;
  }

  const jwt = createApnsJwt(teamId, keyId, privateKeyPem);
  const host = process.env.APNS_USE_SANDBOX === "true"
    ? "https://api.sandbox.push.apple.com"
    : "https://api.push.apple.com";

  await Promise.all(
    tokens.map(async (token) => {
      try {
        const response = await fetch(`${host}/3/device/${token}`, {
          method: "POST",
          headers: {
            authorization: `bearer ${jwt}`,
            "apns-topic": bundleId,
            "apns-priority": payload.urgent ? "10" : "5",
            "apns-push-type": "alert",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              sound: "default",
            },
            url: payload.url ?? "/",
            tag: payload.tag ?? "",
          }),
        });

        if (!response.ok) {
          throw new Error(`APNs send failed: ${response.status} ${await response.text()}`);
        }

        report.delivered += 1;
      } catch (error) {
        report.failed += 1;
        console.error("[push-send:ios]", token, error);
      }
    }),
  );

  return report;
}

export async function sendPushToAll(payload: PushPayload): Promise<DeliveryReport> {
  const registrations = await listNativePushRegistrations();
  const filteredRegistrations = registrations.filter((row) =>
    !payload.topics?.length || !row.topics?.length || row.topics.some((topic) => payload.topics?.includes(topic)),
  ).filter((row) =>
    !payload.installationIds?.length || (row.installation_id ? payload.installationIds.includes(row.installation_id) : false),
  );
  const androidTokens = filteredRegistrations.filter((row) => row.platform === "android").map((row) => row.token);
  const iosTokens = filteredRegistrations.filter((row) => row.platform === "ios").map((row) => row.token);

  const [web, android, ios] = await Promise.all([
    sendWebPush(payload),
    sendFirebasePush(androidTokens, payload),
    sendApnsPush(iosTokens, payload),
  ]);

  return { web, android, ios };
}
