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

  return (
    <section className="px-4 pt-6">
      <div
        className="relative overflow-hidden rounded-[2rem] p-5"
        style={{
          background: "linear-gradient(140deg, rgba(159,29,47,0.98) 0%, rgba(200,56,70,0.94) 55%, rgba(47,91,79,0.96) 100%)",
          boxShadow: "0 18px 36px rgba(67,17,24,0.16)",
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
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]" style={{ background: "rgba(255,255,255,0.14)", color: "#fff4f0" }}>
            <span className="material-symbols-outlined text-base">phone_iphone</span>
            V telefonu jako appka
          </div>

          <h2 className="mt-4 font-headline text-2xl font-extrabold leading-tight text-white">
            Vimperák si můžete připnout na plochu.
          </h2>
          <p className="mt-2 max-w-[30rem] text-sm leading-relaxed text-white/84">
            Nainstalujete jednou a další verze se budou při otevření aplikace aktualizovat samy. Bez další instalace.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {installed ? (
              <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(255,255,255,0.18)", color: "#ffffff" }}>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>download_done</span>
                Aplikace už je nainstalovaná
              </div>
            ) : deferredPrompt ? (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-70"
                style={{ background: "#fffaf6", color: "#431118" }}
              >
                <span className="material-symbols-outlined text-base">{installing ? "sync" : "download"}</span>
                {installing ? "Otevírám instalaci…" : "Instalovat aplikaci"}
              </button>
            ) : null}

            <Link
              href="/instalace"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-transform active:scale-95"
              style={{ background: "rgba(255,255,255,0.12)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <span className="material-symbols-outlined text-base">help</span>
              Jak na iPhone a Android
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["1", "Otevřít web", "Stačí běžná adresa v Safari nebo Chromu."],
              ["2", "Přidat na plochu", "Na Androidu instalace, na iPhonu Přidat na plochu."],
              ["3", "Používat jako appku", "Otevírá se na celou obrazovku a aktualizuje se sama."],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-[1.4rem] p-4" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black" style={{ background: "#fffaf6", color: "#9f1d2f" }}>
                  {step}
                </div>
                <p className="mt-3 text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
