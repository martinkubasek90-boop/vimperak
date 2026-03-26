"use client";

import { useMemo, useState } from "react";
import LipnoTopBar from "@/components/lipno/LipnoTopBar";
import LipnoBottomNav from "@/components/lipno/LipnoBottomNav";
import { lipnoBrand, lipnoEvents, type LipnoEvent } from "@/lib/lipno-data";

type Category = LipnoEvent["category"] | "vše";

const filters: { value: Category; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "rodiny", label: "Rodiny" },
  { value: "sport", label: "Sport" },
  { value: "festival", label: "Festivaly" },
  { value: "vecer", label: "Večer" },
];

export default function LipnoCalendarPage() {
  const [active, setActive] = useState<Category>("vše");

  const items = useMemo(
    () => lipnoEvents.filter((item) => active === "vše" || item.category === active),
    [active],
  );

  return (
    <>
      <LipnoTopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto" style={{ background: lipnoBrand.sand }}>
        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-5 md:p-6" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ecfeff 100%)" }}>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-[2.6rem]" style={{ color: lipnoBrand.primary }}>
              Kalendář Lipna
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
              Denní program, sezónní akce, dětské animace i sportovní dění v areálu.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[1.4rem] p-4" style={{ background: "#fff" }}>
                <p className="text-xs font-semibold" style={{ color: lipnoBrand.muted }}>Nejbližší akce</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.primary }}>{items.length}</p>
              </div>
              <div className="rounded-[1.4rem] p-4" style={{ background: lipnoBrand.secondarySoft }}>
                <p className="text-xs font-semibold" style={{ color: lipnoBrand.secondary }}>Rodiny</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.secondary }}>{lipnoEvents.filter((item) => item.category === "rodiny").length}</p>
              </div>
              <div className="rounded-[1.4rem] p-4" style={{ background: lipnoBrand.accentSoft }}>
                <p className="text-xs font-semibold leading-tight" style={{ color: lipnoBrand.accent }}>
                  Tento
                  <br />
                  týden
                </p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.accent }}>{Math.min(items.length, 4)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 pb-2 pt-5">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActive(filter.value)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={active === filter.value ? {
                background: `linear-gradient(135deg, ${lipnoBrand.primary}, ${lipnoBrand.secondary})`,
                color: "#fff",
              } : {
                background: "#fff",
                color: lipnoBrand.ink,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <section className="px-4 pt-4 space-y-3">
          {items.map((event) => (
            <a
              key={event.id}
              href={event.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-[2rem] p-5 block"
              style={{ background: "#fff", boxShadow: "0 12px 24px rgba(12,74,110,0.06)", border: "1px solid rgba(12,74,110,0.06)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: lipnoBrand.primarySoft, color: lipnoBrand.primary }}>
                    {event.dateLabel}
                  </span>
                  <h2 className="mt-3 font-headline text-lg font-extrabold leading-snug" style={{ color: lipnoBrand.ink }}>{event.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>{event.summary}</p>
                </div>
                <span className="material-symbols-outlined" style={{ color: lipnoBrand.primary }}>arrow_outward</span>
              </div>
            </a>
          ))}
        </section>
      </main>
      <LipnoBottomNav />
    </>
  );
}
