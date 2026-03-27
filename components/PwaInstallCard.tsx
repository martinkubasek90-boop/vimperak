"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export default function PwaInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    setInstalled(isStandalone());
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setDeferredPrompt(null);
      }
    } finally {
      setInstalling(false);
    }
  }

  if (installed) {
    return null;
  }

  return (
    <section className="px-4 pt-6">
      <div
        className="relative overflow-hidden rounded-[1.6rem] p-4"
        style={{
          background: "linear-gradient(140deg, rgba(159,29,47,0.98) 0%, rgba(200,56,70,0.94) 55%, rgba(47,91,79,0.96) 100%)",
          boxShadow: "0 14px 26px rgba(67,17,24,0.14)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.12), transparent 32%)",
          }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]" style={{ background: "rgba(255,255,255,0.14)", color: "#fff4f0" }}>
            <span className="material-symbols-outlined text-sm">phone_iphone</span>
            Instalace
          </div>

          <h2 className="mt-3 font-headline text-lg font-extrabold leading-tight text-white md:text-xl">
            Připnout Vimperák na plochu telefonu.
          </h2>
          <p className="mt-1.5 max-w-[34rem] text-xs leading-relaxed text-white/84 md:text-sm">
            Instalace je jednorázová. Další verze se při otevření aplikace aktualizují samy.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-70"
                style={{ background: "#fffaf6", color: "#431118" }}
              >
                <span className="material-symbols-outlined text-base">{installing ? "sync" : "download"}</span>
                {installing ? "Otevírám…" : "Instalovat"}
              </button>
            ) : null}

            <Link
              href="/instalace"
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-transform active:scale-95"
              style={{ background: "rgba(255,255,255,0.12)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <span className="material-symbols-outlined text-base">help</span>
              Návod
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
