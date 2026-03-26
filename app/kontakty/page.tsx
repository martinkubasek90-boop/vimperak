"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { directory, type DirectoryItem } from "@/lib/data";

type Cat = DirectoryItem["category"] | "vše";

const filters: { value: Cat; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "město", label: "Město a úřady" },
  { value: "lékař", label: "Lékaři" },
  { value: "lékárna", label: "Lékárny" },
  { value: "taxi", label: "Taxi" },
  { value: "restaurace", label: "Restaurace" },
  { value: "sport", label: "Sport" },
  { value: "obchod", label: "Obchody" },
];

const catIcon: Record<string, string> = {
  město: "apartment",
  taxi: "local_taxi",
  lékárna: "medical_services",
  restaurace: "restaurant",
  lékař: "health_and_safety",
  opravna: "build",
  sport: "fitness_center",
  ubytování: "hotel",
  obchod: "storefront",
};

const municipalIds = [22, 24, 25, 26, 27, 23];
const openIds = [1, 2, 4, 5, 6, 7, 9, 10, 22, 23, 25];

export default function KontaktyPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Cat>("vše");

  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("k") as Cat | null;
    if (filter && filters.some((item) => item.value === filter)) {
      setCat(filter);
    }
  }, []);

  const municipalContacts = municipalIds
    .map((id) => directory.find((item) => item.id === id))
    .filter((item): item is DirectoryItem => Boolean(item));

  const filtered = directory.filter((item) => {
    const matchCat = cat === "vše" || item.category === cat;
    const q = search.toLowerCase();
    const matchQ = !q || [item.name, item.address, item.note ?? ""].join(" ").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const featured = filtered.find((item) => item.category === "město") ?? filtered[0];
  const rest = filtered.filter((item) => item.id !== featured?.id);

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase mb-3"
                  style={{ background: "rgba(53, 110, 92, 0.14)", color: "var(--secondary)" }}
                >
                  Potřebuji někoho najít
                </span>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Kontakty
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  Radnice, odbory města, městská policie i praktické služby přehledně na jednom místě.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {municipalContacts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.4rem] p-4"
                    style={{ background: item.category === "město" ? "var(--secondary-container)" : "var(--surface-container-lowest)" }}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: "var(--secondary)" }}>
                      {catIcon[item.category] ?? "call"}
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-snug" style={{ color: "var(--on-surface)" }}>
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>search</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Hledat radnici, policii, lékaře nebo služby..."
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--on-surface)" }}
              />
            </div>
          </div>
        </section>

        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 pb-2 pt-4">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCat(value)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={cat === value ? {
                background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                color: "var(--on-primary)",
                boxShadow: "0 10px 18px rgba(67,17,24,0.14)",
              } : {
                background: "var(--surface-container-low)",
                color: "var(--on-surface)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
              Důležité městské kontakty
            </h2>
            <button onClick={() => setCat("město")} className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
              Zobrazit vše
            </button>
          </div>

          <div className="space-y-3">
            {municipalContacts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-[1.8rem] p-5"
                style={{ background: "var(--secondary-container)", border: "1px solid rgba(53, 110, 92, 0.10)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-headline text-base font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
                      {item.name}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--on-secondary-container)" }}>{item.phone}</p>
                    <p className="mt-1 text-sm" style={{ color: "var(--on-secondary-container)" }}>{item.address}</p>
                    {item.hours && <p className="mt-1 text-xs" style={{ color: "rgba(31, 36, 34, 0.74)" }}>{item.hours}</p>}
                  </div>
                  <a
                    href={`tel:${item.phone.replace(/\s/g, "")}`}
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.65)", color: "var(--secondary)" }}
                  >
                    <span className="material-symbols-outlined">call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6 space-y-3">
          {featured && (
            <div
              className="rounded-[2rem] p-6"
              style={{ background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)", boxShadow: "0 16px 34px rgba(67,17,24,0.18)" }}
            >
              <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}>
                Doporučený kontakt
              </span>
              <h3 className="font-headline font-extrabold text-2xl text-white mt-4">{featured.name}</h3>
              <div className="mt-4 space-y-1.5 text-sm text-white/90">
                <div>{featured.phone}</div>
                <div>{featured.address}</div>
                {featured.email && <div>{featured.email}</div>}
              </div>
              {featured.note && <p className="mt-3 text-sm text-white/85">{featured.note}</p>}
            </div>
          )}

          {rest.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="rounded-[1.8rem] p-5 flex items-center gap-4"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: item.category === "město" ? "var(--secondary-container)" : "var(--surface-container-low)" }}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ color: item.category === "město" ? "var(--secondary)" : "var(--on-surface-variant)" }}>
                    {catIcon[item.category] ?? "call"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-base leading-snug" style={{ color: "var(--on-surface)" }}>{item.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isOpen ? "var(--secondary)" : "var(--error)" }} />
                    <span className="text-sm font-semibold" style={{ color: isOpen ? "var(--secondary)" : "var(--error)" }}>
                      {isOpen ? "Otevřeno teď" : "Mimo provoz"}
                    </span>
                    {item.hours && <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>· {item.hours}</span>}
                  </div>
                  <div className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.phone}</div>
                  <div className="mt-0.5 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.address}</div>
                </div>
                <a
                  href={`tel:${item.phone.replace(/\s/g, "")}`}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={isOpen ? {
                    background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                    color: "var(--on-primary)",
                    boxShadow: "0 8px 18px rgba(67,17,24,0.14)",
                  } : {
                    background: "var(--surface-container-low)",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <span className="material-symbols-outlined">call</span>
                </a>
              </div>
            );
          })}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
