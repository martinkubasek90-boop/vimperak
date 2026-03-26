"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import LipnoTopBar from "@/components/lipno/LipnoTopBar";
import LipnoBottomNav from "@/components/lipno/LipnoBottomNav";
import { lipnoBrand, lipnoExperiences, type LipnoExperience } from "@/lib/lipno-data";

type Category = LipnoExperience["category"] | "vše";

const filters: { value: Category; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "rodiny", label: "Rodiny" },
  { value: "sport", label: "Sport" },
  { value: "voda", label: "Voda" },
  { value: "adrenalin", label: "Adrenalin" },
  { value: "wellness", label: "Relax" },
];

export default function LipnoExperiencesPage() {
  const [active, setActive] = useState<Category>("vše");

  const items = useMemo(
    () => lipnoExperiences.filter((item) => active === "vše" || item.category === active),
    [active],
  );

  return (
    <>
      <LipnoTopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto" style={{ background: lipnoBrand.sand }}>
        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-5 md:p-6" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)" }}>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-[2.7rem]" style={{ color: lipnoBrand.primary }}>
              Zážitky na Lipně
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
              Rodinné top atrakce, zimní provoz, voda i lehký adrenalin v jednom přehledu podle typu dne.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[1.4rem] p-4" style={{ background: "#fff" }}>
                <p className="text-xs font-semibold" style={{ color: lipnoBrand.muted }}>Celkem tipů</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.primary }}>{lipnoExperiences.length}</p>
              </div>
              <div className="rounded-[1.4rem] p-4" style={{ background: lipnoBrand.secondarySoft }}>
                <p className="text-xs font-semibold" style={{ color: lipnoBrand.secondary }}>Celoročně</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.secondary }}>3</p>
              </div>
              <div className="rounded-[1.4rem] p-4" style={{ background: lipnoBrand.accentSoft }}>
                <p className="text-xs font-semibold" style={{ color: lipnoBrand.accent }}>Rodiny</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: lipnoBrand.accent }}>4</p>
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
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-[2rem] p-5 block"
              style={{ background: "#fff", boxShadow: "0 12px 24px rgba(12,74,110,0.06)", border: "1px solid rgba(12,74,110,0.06)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: lipnoBrand.primarySoft, color: lipnoBrand.primary }}>
                      {item.season}
                    </span>
                    <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: lipnoBrand.accentSoft, color: lipnoBrand.accent }}>
                      {item.duration}
                    </span>
                  </div>
                  <h2 className="mt-3 font-headline text-lg font-extrabold leading-snug" style={{ color: lipnoBrand.ink }}>{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>{item.summary}</p>
                </div>
                <span className="material-symbols-outlined" style={{ color: lipnoBrand.primary }}>arrow_outward</span>
              </div>
              <p className="mt-3 text-sm font-semibold" style={{ color: lipnoBrand.secondary }}>{item.highlight}</p>
            </a>
          ))}
        </section>

        <section className="px-4 pt-8 pb-4">
          <Link
            href="/lipno/servis"
            className="block rounded-[2rem] p-5"
            style={{ background: "#fff", boxShadow: "0 14px 30px rgba(12,74,110,0.08)", border: "1px solid rgba(12,74,110,0.08)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-3xl font-extrabold" style={{ color: lipnoBrand.primary }}>Servis a vstupenky</h2>
              <span className="material-symbols-outlined text-2xl" style={{ color: lipnoBrand.primary }}>arrow_forward</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
              Otevírací doby, webkamery, parkování a rychlý vstup do oficiálního prodeje.
            </p>
          </Link>
        </section>
      </main>
      <LipnoBottomNav />
    </>
  );
}
