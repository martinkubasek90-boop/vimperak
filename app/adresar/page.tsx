"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { directory, type DirectoryItem } from "@/lib/data";

type Cat = DirectoryItem["category"] | "vše";

const filters: { value: Cat; label: string }[] = [
  { value: "vše",        label: "Vše" },
  { value: "město",      label: "Město" },
  { value: "taxi",       label: "Taxi" },
  { value: "lékárna",    label: "Lékárny" },
  { value: "restaurace", label: "Restaurace" },
  { value: "lékař",      label: "Lékaři" },
  { value: "sport",      label: "Sport & Fitness" },
  { value: "opravna",    label: "Opravny" },
  { value: "ubytování",  label: "Ubytování" },
  { value: "obchod",     label: "Obchody" },
];

const catIcon: Record<string, string> = {
  město:      "apartment",
  taxi:       "local_taxi",
  lékárna:    "medical_services",
  restaurace: "restaurant",
  lékař:      "health_and_safety",
  opravna:    "build",
  sport:      "fitness_center",
  ubytování:  "hotel",
  obchod:     "storefront",
};

const catStyle: Record<string, { bg: string; color: string }> = {
  město:      { bg: "var(--primary-fixed)",         color: "var(--on-primary-fixed)" },
  taxi:       { bg: "var(--secondary-container)",  color: "var(--on-secondary-container)" },
  lékárna:    { bg: "var(--tertiary-fixed)",        color: "var(--on-tertiary-fixed)" },
  restaurace: { bg: "var(--surface-container)",     color: "var(--on-surface-variant)" },
  lékař:      { bg: "var(--primary-fixed)",         color: "var(--on-primary-fixed)" },
  opravna:    { bg: "var(--secondary-container)",   color: "var(--on-secondary-container)" },
  sport:      { bg: "var(--tertiary-fixed)",        color: "var(--on-tertiary-fixed)" },
  ubytování:  { bg: "var(--surface-container-high)",color: "var(--on-surface)" },
  obchod:     { bg: "var(--surface-container-high)",color: "var(--on-surface)" },
};

const openIds = [1, 2, 4, 5, 6, 7, 9, 10, 22, 23, 25];

export default function AdresarPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Cat>("vše");

  const filtered = directory.filter((item) => {
    const matchCat = cat === "vše" || item.category === cat;
    const q = search.toLowerCase();
    const matchQ = !q || [item.name, item.address, item.note ?? ""].join(" ").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const [featured, ...rest] = filtered;

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">

        {/* Header */}
        <div className="px-5 pt-7 pb-2">
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">
            Adresář a Služby
          </h1>
          <p className="text-on-surface-variant text-base mt-1">Najděte vše potřebné ve Vimperku</p>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: "20px" }}>search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat firmy, taxi, opravny..."
              className="w-full h-14 pl-12 pr-28 rounded-2xl text-sm outline-none transition-all"
              style={{
                background: "var(--surface-container-low)",
                border: "2px solid transparent",
                color: "var(--on-surface)",
              }}
              onFocus={e => (e.currentTarget.style.border = "2px solid var(--primary)")}
              onBlur={e => (e.currentTarget.style.border = "2px solid transparent")}
            />
            <div className="absolute right-2 inset-y-2">
              <button className="h-full px-4 rounded-xl font-semibold text-sm text-on-primary transition-opacity hover:opacity-90"
                      style={{ background: "var(--primary)" }}>
                Hledat
              </button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 pb-2 pt-3">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCat(value)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={cat === value ? {
                background: "var(--primary-container)",
                color: "var(--on-primary)",
                boxShadow: "0 2px 8px rgba(178,0,28,0.25)"
              } : {
                background: "var(--surface-container-low)",
                color: "var(--on-surface)"
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 pt-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">search_off</span>
              <p className="font-semibold">Nic nenalezeno</p>
            </div>
          )}

          {/* Featured promoted card */}
          {featured && (
            <div className="relative rounded-[2.5rem] p-6 overflow-hidden"
                 style={{
                   background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                   boxShadow: "0 8px 32px rgba(178,0,28,0.25)"
                 }}>
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full -mr-16 -mt-16 opacity-15"
                   style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}>
                  Doporučené
                </span>
                <h3 className="font-headline font-extrabold text-2xl text-white mt-4">{featured.name}</h3>
                {featured.rating && (
                  <div className="flex items-center gap-2 mt-2 text-white">
                    <span className="material-symbols-outlined text-yellow-300 text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold">{featured.rating}</span>
                    {featured.note && (
                      <span className="text-sm opacity-80">· {featured.note}</span>
                    )}
                  </div>
                )}
                {!featured.rating && featured.note && (
                  <div className="mt-2 text-sm text-white/85">{featured.note}</div>
                )}
                <div className="mt-4 space-y-1.5 text-sm text-white/90">
                  <div>{featured.phone}</div>
                  <div>{featured.address}</div>
                  {featured.email && <div>{featured.email}</div>}
                </div>
                <div className="flex gap-3 mt-5">
                  <a href={`tel:${featured.phone.replace(/\s/g,"")}`}
                     className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                     style={{ background: "#fff", color: "var(--primary)" }}>
                    <span className="material-symbols-outlined text-sm">call</span>
                    Zavolat hned
                  </a>
                  <button className="w-12 h-12 rounded-2xl flex items-center justify-center active:scale-95"
                          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                    <span className="material-symbols-outlined">map</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Regular entries */}
          {rest.map((item) => {
            const isOpen = openIds.includes(item.id);
            const style = catStyle[item.category] ?? { bg: "var(--surface-container)", color: "var(--on-surface-variant)" };
            return (
              <div key={item.id}
                   className="rounded-[2rem] p-5 flex items-center gap-4 active:scale-[0.98] transition-all"
                   style={{ background: "var(--surface-container-lowest)", boxShadow: "0 1px 8px rgba(24,28,32,0.06)" }}>
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                     style={{ background: style.bg }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: style.color }}>
                    {catIcon[item.category] ?? "store"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-headline font-bold text-base text-on-surface leading-snug">{item.name}</h3>
                    {item.rating && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg shrink-0"
                           style={{ background: "var(--surface-container-low)" }}>
                        <span className="material-symbols-outlined text-yellow-500"
                              style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}>star</span>
                        <span className="text-sm font-bold text-on-surface">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: isOpen ? "var(--secondary)" : "var(--error)" }} />
                    <span className="text-sm font-semibold"
                          style={{ color: isOpen ? "var(--secondary)" : "var(--error)" }}>
                      {isOpen ? "Otevřeno teď" : "Zavřeno"}
                    </span>
                    {item.hours && (
                      <span className="text-xs text-on-surface-variant">· {item.hours}</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-on-surface-variant">
                    {item.phone}
                  </div>
                  <div className="mt-0.5 text-sm text-on-surface-variant">
                    {item.address}
                  </div>
                  {item.email && (
                    <div className="mt-0.5 text-xs text-on-surface-variant break-all">
                      {item.email}
                    </div>
                  )}
                  {item.note && (
                    <div className="mt-1 text-xs text-on-surface-variant">
                      {item.note}
                    </div>
                  )}
                </div>

                {/* Call */}
                <a href={`tel:${item.phone.replace(/\s/g,"")}`}
                   className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95"
                   style={isOpen ? {
                     background: "var(--primary-container)",
                     color: "var(--on-primary)",
                     boxShadow: "0 4px 12px rgba(178,0,28,0.2)"
                   } : {
                     background: "var(--surface-container-low)",
                     color: "var(--on-surface-variant)"
                   }}>
                  <span className="material-symbols-outlined">call</span>
                </a>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
