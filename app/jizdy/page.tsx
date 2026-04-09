"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { busLines } from "@/lib/data";
import { cn } from "@/lib/utils";

const DEFAULT_FROM = "Vimperk";

function buildIdosConnectionLink(to: string) {
  const params = new URLSearchParams({
    f: DEFAULT_FROM,
    t: to,
    submit: "true",
  });

  return `https://idos.idnes.cz/vlakyautobusy/spojeni/?${params.toString()}`;
}

function buildIdosDeparturesLink(stop: string) {
  const params = new URLSearchParams({
    f: stop,
    submit: "true",
  });

  return `https://idos.idnes.cz/autobusy/odjezdy/?${params.toString()}`;
}

const featuredDestinations = [
  { label: "Prachatice", hint: "rychlé spojení", href: buildIdosConnectionLink("Prachatice") },
  { label: "České Budějovice", hint: "přestupy i přímé linky", href: buildIdosConnectionLink("České Budějovice") },
  { label: "Volary", hint: "směr Šumava", href: buildIdosConnectionLink("Volary") },
  { label: "Kašperské Hory", hint: "turistický směr", href: buildIdosConnectionLink("Kašperské Hory") },
];

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
        <section className="mb-6">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5 md:grid-cols-[1.08fr_0.92fr] md:items-center">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase mb-3"
                  style={{ background: "rgba(159,29,47,0.08)", color: "var(--primary)" }}
                >
                  Doprava
                </span>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]"
                    style={{ color: "var(--primary)" }}>
                  Jízdní řády
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  V appce držíme rychlý přehled nejčastějších směrů z Vimperka. Pro přesný aktuální odjezd otevřete předvyplněný detail v IDOS.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Prachatice", tone: "var(--primary-fixed)" },
                  { label: "Budějovice", tone: "var(--tertiary-fixed)" },
                  { label: "Volary", tone: "var(--secondary-fixed)" },
                  { label: "IDOS detail", tone: "var(--surface-container)" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.35rem] p-4" style={{ background: item.tone }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>directions_bus</span>
                    <p className="mt-3 text-sm font-semibold" style={{ color: "var(--on-surface)" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="rounded-[2rem] p-5" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
                  Nejčastější směry
                </p>
                <h2 className="mt-1 font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                  Otevřít spojení z Vimperka
                </h2>
              </div>
              <a
                href={buildIdosDeparturesLink(DEFAULT_FROM)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold"
                style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
              >
                <span className="material-symbols-outlined text-base">schedule</span>
                Odjezdy z Vimperka
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {featuredDestinations.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.35rem] p-4 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--surface-container-low)", border: "1px solid rgba(159,29,47,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold" style={{ color: "var(--on-surface)" }}>{item.label}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.hint}</p>
                    </div>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>open_in_new</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Live clock card */}
        <div className="rounded-3xl p-5 mb-8 flex items-center gap-4"
             style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 62%, var(--tertiary) 100%)", color: "var(--on-primary)", boxShadow: "0 16px 28px rgba(67,17,24,0.16)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: "rgba(255,255,255,0.15)" }}>
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <div>
            <p className="text-sm opacity-75 font-medium">Aktuální čas</p>
            <p className="text-4xl font-headline font-black tracking-tight">{now || "––:––"}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs opacity-60">Právě teď</p>
            <p className="font-bold text-sm">zkontrolujte odjezd</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-8"
             style={{ background: "var(--tertiary-fixed)", color: "var(--on-tertiary-fixed)", boxShadow: "0 8px 18px rgba(67,17,24,0.06)" }}>
          <span className="material-symbols-outlined text-xl mt-0.5">info</span>
          <p className="text-sm leading-relaxed">
            Přehled v appce je orientační a rychlý na první pohled. Přesné odjezdy, zpoždění a aktuální spojení vždy ověřte v&nbsp;IDOS.
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
                   style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}>

                {/* Line header */}
                <button
                  onClick={() => setActiveLine(expanded ? null : line.id)}
                  className="w-full text-left px-5 pt-5 pb-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Line number badge */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-headline font-black text-lg"
                           style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "var(--on-primary)" }}>
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
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest"
                         style={{ color: "var(--on-surface-variant)" }}>Všechny odjezdy</p>
                      <a
                        href={buildIdosConnectionLink(line.to)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold"
                        style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                        Ověřit v IDOS
                      </a>
                    </div>
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
      </main>

      <BottomNav />
    </div>
  );
}
