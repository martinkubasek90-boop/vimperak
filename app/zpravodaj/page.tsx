"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { news, events } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

const catColor: Record<string, string> = {
  upozornění: "var(--error)",
  sport:      "var(--tertiary)",
  radnice:    "var(--primary)",
  kultura:    "var(--secondary)",
  komunita:   "var(--on-surface-variant)",
};

const eventCatColor: Record<string, { bg: string; text: string }> = {
  kino:    { bg: "var(--primary-fixed)",       text: "var(--on-primary-fixed)" },
  kultura: { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  sport:   { bg: "var(--tertiary-fixed)",      text: "var(--on-tertiary-fixed)" },
  trhy:    { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  úřad:    { bg: "var(--surface-container)",   text: "var(--on-surface-variant)" },
};

function formatRelative(s: string) {
  const diff = Math.floor((Date.now() - new Date(s).getTime()) / 86400000);
  if (diff === 0) return "Dnes";
  if (diff === 1) return "Včera";
  if (diff < 7)  return `Před ${diff} dny`;
  return `Před ${Math.floor(diff / 7)} týd.`;
}

export default function ZpravodajPage() {
  const [tab, setTab] = useState<"zpravy" | "akce">("zpravy");
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">

        {/* Header */}
        <div className="px-5 pt-7 pb-5">
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface mb-5">
            Zprávy a Události
          </h1>
          {/* Toggle */}
          <div className="p-1.5 rounded-2xl flex gap-1"
               style={{ background: "var(--surface-container-low)" }}>
            {[{ id: "zpravy", label: "Zprávy z radnice" }, { id: "akce", label: "Kulturní program" }].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "zpravy" | "akce")}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                style={tab === t.id ? {
                  background: "var(--surface-container-lowest)",
                  color: "var(--primary)",
                  boxShadow: "0 1px 6px rgba(24,28,32,0.1)"
                } : {
                  color: "var(--on-surface-variant)"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "zpravy" && (
          <div className="px-4 space-y-4 pb-4">
            {/* Featured */}
            <div className="rounded-[2rem] overflow-hidden"
                 style={{ boxShadow: "0 4px 20px rgba(24,28,32,0.08)" }}>
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0"
                     style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
                {featured.urgent && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                       style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                    Důležité upozornění
                  </div>
                )}
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white/70 text-xs font-medium mb-1">{formatRelative(featured.date)}</p>
                  <h2 className="font-headline font-bold text-xl text-white leading-tight">{featured.title}</h2>
                </div>
              </div>
              <div className="p-5" style={{ background: "var(--surface-container-lowest)" }}>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-3">
                  {featured.summary}
                </p>
                <button className="flex items-center gap-1.5 text-primary font-bold text-sm group">
                  Číst více
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map((item) => (
                <div key={item.id}
                     className="rounded-[1.5rem] overflow-hidden flex flex-col justify-between transition-colors"
                     style={{ background: "var(--surface-container-low)" }}>
                  <div className="relative h-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0"
                         style={{ background: "linear-gradient(to top, rgba(24,28,32,0.52) 0%, transparent 65%)" }} />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-3">
                      <span className="text-[10px] font-bold tracking-widest uppercase"
                            style={{
                              color: "#fff",
                              background: catColor[item.category] ?? "var(--on-surface-variant)",
                              padding: "6px 10px",
                              borderRadius: "999px"
                            }}>
                        {item.category}
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.86)" }}>{formatRelative(item.date)}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-headline font-bold text-base leading-snug text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-on-surface-variant mt-2 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-5 pb-5 text-sm font-semibold text-primary">
                    Více informací
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>info</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "akce" && (
          <div className="px-4 pb-4">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="font-headline font-bold text-xl text-on-surface">Nadcházející události</h2>
                <p className="text-on-surface-variant text-sm mt-0.5">Co se děje v našem městě</p>
              </div>
              <Link href="/akce" className="text-primary font-bold text-sm">Vše →</Link>
            </div>

            <div className="space-y-3">
              {upcoming.map((event) => {
                const cs = eventCatColor[event.category] ?? { bg: "var(--surface-container)", text: "var(--on-surface-variant)" };
                return (
                  <div key={event.id}
                       className="rounded-3xl p-4 flex gap-4 items-center"
                       style={{ background: "var(--surface-container-lowest)", boxShadow: "0 1px 8px rgba(24,28,32,0.06)" }}>
                    {/* Date */}
                    <div className="w-14 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                         style={{ background: cs.bg }}>
                      <span className="font-headline font-black text-xl leading-none" style={{ color: cs.text }}>
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs uppercase font-semibold" style={{ color: cs.text, opacity: 0.7 }}>
                        {new Date(event.date).toLocaleDateString("cs-CZ", { month: "short" })}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5"
                            style={{ color: cs.text === "var(--on-primary-fixed)" ? "var(--primary)" : "var(--secondary)" }}>
                        {event.place} · {event.time}
                      </span>
                      <h4 className="font-headline font-bold text-base text-on-surface leading-tight truncate">
                        {event.title}
                      </h4>
                      <div className="mt-1.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={event.free
                                ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                                : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
                          {event.free ? "Vstup zdarma" : event.price}
                        </span>
                      </div>
                    </div>
                    {/* Calendar add */}
                    <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                            style={{ background: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_add_on</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative rounded-[2.5rem] p-7 overflow-hidden"
               style={{ background: "linear-gradient(135deg, #3c6842 0%, #2d5235 100%)" }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
                 style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                   style={{ background: "var(--secondary-container)" }}>
                <span className="material-symbols-outlined text-on-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              </div>
              <h3 className="font-headline font-extrabold text-2xl text-white mb-1">Newsletter Vimperk</h3>
              <p className="text-sm mb-5" style={{ color: "rgba(189,239,190,0.85)", maxWidth: "220px" }}>
                Nejdůležitější zprávy z města jednou týdně přímo do vašeho mailu.
              </p>
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                       style={{ background: "rgba(255,255,255,0.15)", border: "none" }}
                       placeholder="Váš e-mail" type="email" />
                <button className="px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95"
                        style={{ background: "#fff", color: "var(--secondary)" }}>
                  Přihlásit
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
      <BottomNav />
    </>
  );
}
