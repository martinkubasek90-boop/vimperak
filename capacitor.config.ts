import type { CapacitorConfig } from "@capacitor/cli";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vimperaci.cz";

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
