"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { busLines } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function JizdyPage() {
  const [now, setNow] = useState("");
  const [activeLine, setActiveLine] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      <TopBar />

      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline font-extrabold text-3xl tracking-tight mb-1"
              style={{ color: "var(--on-surface)" }}>
            Jízdní řády
          </h1>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            Autobusové spoje z&nbsp;Vimperka
          </p>
        </div>

        {/* Live clock card */}
        <div className="rounded-3xl p-5 mb-8 flex items-center gap-4"
             style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: "rgba(255,255,255,0.15)" }}>
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <div>
            <p className="text-sm opacity-75 font-medium">Aktuální čas</p>
            <p className="text-4xl font-headline font-black tracking-tight">{now || "––:––"}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs opacity-60">Ověřte na</p>
            <p className="font-bold text-sm">IDOS.cz</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-8"
             style={{ background: "var(--tertiary-fixed)", color: "var(--on-tertiary-fixed)" }}>
          <span className="material-symbols-outlined text-xl mt-0.5">info</span>
          <p className="text-sm leading-relaxed">
            Jízdní řády jsou orientační. Vždy ověřte na&nbsp;IDOS.cz nebo u&nbsp;dopravce.
          </p>
        </div>

        {/* Bus line cards */}
        <div className="space-y-4">
          {busLines.map((line) => {
            const nextDep = line.departures.find((d) => d > now);
            const upcomingDeps = line.departures.filter((d) => d > now).slice(0, 3);
            const expanded = activeLine === line.id;

            return (
              <div key={line.id} className="rounded-[2rem] overflow-hidden"
                   style={{ background: "var(--surface-container-lowest)", boxShadow: "0 2px 12px rgba(24,28,32,0.06)" }}>

                {/* Line header */}
                <button
                  onClick={() => setActiveLine(expanded ? null : line.id)}
                  className="w-full text-left px-5 pt-5 pb-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Line number badge */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-headline font-black text-lg"
                           style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                        {line.number}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-lg leading-tight"
                           style={{ color: "var(--on-surface)" }}>
                          {line.from}
                          <span className="font-normal mx-2" style={{ color: "var(--on-surface-variant)" }}>→</span>
                          {line.to}
                        </p>
                        {line.note && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
                            {line.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Next departure */}
                    {nextDep ? (
                      <div className="shrink-0 text-right">
                        <p className="text-xs mb-0.5" style={{ color: "var(--on-surface-variant)" }}>Nejbližší</p>
                        <p className="font-headline font-black text-2xl" style={{ color: "var(--primary)" }}>
                          {nextDep}
                        </p>
                      </div>
                    ) : (
                      <div className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold"
                           style={{ background: "var(--surface-container-high)", color: "var(--on-surface-variant)" }}>
                        Dnes odeto
                      </div>
                    )}
                  </div>

                  {/* Next 3 departures preview */}
                  {upcomingDeps.length > 0 && !expanded && (
                    <div className="flex items-center gap-2 mt-3">
                      <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>Dále:</p>
                      {upcomingDeps.map((d) => (
                        <span key={d} className="text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}>
                          {d}
                        </span>
                      ))}
                      <span className="material-symbols-outlined text-sm ml-auto transition-transform"
                            style={{ color: "var(--on-surface-variant)", transform: expanded ? "rotate(180deg)" : "none" }}>
                        expand_more
                      </span>
                    </div>
                  )}
                  {expanded && (
                    <div className="flex justify-end mt-1">
                      <span className="material-symbols-outlined text-sm"
                            style={{ color: "var(--on-surface-variant)" }}>expand_less</span>
                    </div>
                  )}
                </button>

                {/* Expanded: all departures */}
                {expanded && (
                  <div className="px-5 pb-5">
                    <div className="h-px mb-4" style={{ background: "var(--outline-variant)" }} />
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                       style={{ color: "var(--on-surface-variant)" }}>Všechny odjezdy</p>
                    <div className="flex flex-wrap gap-2">
                      {line.departures.map((dep) => {
                        const isPast = now && dep < now;
                        const isNext = dep === nextDep;
                        return (
                          <span
                            key={dep}
                            className="text-sm font-mono px-3 py-1.5 rounded-xl font-medium transition-all"
                            style={
                              isNext
                                ? { background: "var(--primary)", color: "var(--on-primary)", fontWeight: 800 }
                                : isPast
                                ? { background: "var(--surface-container-high)", color: "var(--outline)", textDecoration: "line-through" }
                                : { background: "var(--surface-container-low)", color: "var(--on-surface)" }
                            }
                          >
                            {dep}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* IDOS link */}
        <a
          href="https://idos.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-semibold transition-all active:scale-95"
          style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
        >
          <span className="material-symbols-outlined">open_in_new</span>
          Otevřít IDOS.cz — kompletní jízdní řády
        </a>
      </main>

      <BottomNav />
    </div>
  );
}
