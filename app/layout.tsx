import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileAppBootstrap from "@/components/MobileAppBootstrap";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vimperaci.cz";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Vimperk — Tvoje město online",
  description: "Komunitní portál pro obyvatele Vimperka. Akce, jízdní řády, adresář a hlasování.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/branding/vimperk-mark.png",
    apple: "/branding/vimperk-shield.png",
    shortcut: "/branding/vimperk-mark.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vimperk",
  },
  openGraph: {
    title: "Vimperk — Tvoje město online",
    description: "Komunitní portál pro obyvatele Vimperka. Akce, jízdní řády, adresář a hlasování.",
    url: appUrl,
    siteName: "Vimperk",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/branding/vimperk-shield.png",
        width: 512,
        height: 512,
        alt: "Znak města Vimperk",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Vimperk — Tvoje město online",
    description: "Komunitní portál pro obyvatele Vimperka. Akce, jízdní řády, adresář a hlasování.",
    images: ["/branding/vimperk-shield.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#b2001c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/branding/vimperk-shield.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="pb-32" style={{ background: "var(--surface)", color: "var(--on-surface)", fontFamily: "Inter, sans-serif" }}>
        <MobileAppBootstrap />
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
