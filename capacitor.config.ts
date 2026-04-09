import type { CapacitorConfig } from "@capacitor/cli";

// Release builds should always resolve to a stable production URL unless a local
// debug server is explicitly requested. Android emulators must reach the host via
// 10.0.2.2 instead of localhost.
const productionAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vimperaci.cz";
const capacitorPlatform = process.env.CAPACITOR_PLATFORM;
const useLocalServer = process.env.CAPACITOR_USE_LOCAL_SERVER === "true";
const localServerUrl = process.env.CAPACITOR_LOCAL_SERVER_URL || "http://localhost:3001";

function resolveServerUrl() {
  const baseAppUrl = useLocalServer ? localServerUrl : productionAppUrl;

  if (!baseAppUrl.startsWith("http://localhost")) {
    return baseAppUrl;
  }

  if (capacitorPlatform === "android") {
    return baseAppUrl.replace("http://localhost", "http://10.0.2.2");
  }

  return baseAppUrl;
}

const appUrl = resolveServerUrl();

const config: CapacitorConfig = {
  appId: "cz.vimperaci.app",
  appName: "Vimperak",
  webDir: ".next",
  server: {
    url: appUrl,
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  },
};

export default config;
