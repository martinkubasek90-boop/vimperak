"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import { loadHomePreferences, saveHomePreferences } from "@/lib/client-storage";
import type { PublicDirectoryItem } from "@/lib/public-content";

type Cat = PublicDirectoryItem["category"] | "vše";

const filters: { value: Cat; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "město", label: "Město" },
  { value: "taxi", label: "Taxi" },
  { value: "lékárna", label: "Lékárny" },
  { value: "restaurace", label: "Restaurace" },
  { value: "lékař", label: "Lékaři" },
  { value: "sport", label: "Sport & Fitness" },
  { value: "opravna", label: "Opravny" },
  { value: "ubytování", label: "Ubytování" },
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

const catStyle: Record<string, { bg: string; color: string }> = {
  město: { bg: "var(--primary-fixed)", color: "var(--on-primary-fixed)" },
  taxi: { bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  lékárna: { bg: "var(--tertiary-fixed)", color: "var(--on-tertiary-fixed)" },
  restaurace: { bg: "var(--surface-container)", color: "var(--on-surface-variant)" },
  lékař: { bg: "var(--primary-fixed)", color: "var(--on-primary-fixed)" },
  opravna: { bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  sport: { bg: "var(--tertiary-fixed)", color: "var(--on-tertiary-fixed)" },
  ubytování: { bg: "var(--surface-container-high)", color: "var(--on-surface)" },
  obchod: { bg: "var(--surface-container-high)", color: "var(--on-surface)" },
};

export function AdresarPageClient({
  directory,
  initialCategory = "vše",
}: {
  directory: PublicDirectoryItem[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Array<string | number>>([]);
  const [cat, setCat] = useState<Cat>(
    filters.some((item) => item.value === initialCategory)
      ? (initialCategory as Cat)
      : "vše",
  );

  const filtered = useMemo(
    () =>
      directory.filter((item) => {
        const matchCat = cat === "vše" || item.category === cat;
        const q = search.toLowerCase();
        const matchQ =
          !q ||
          [item.name, item.address, item.note ?? "", item.email ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(q);
        return matchCat && matchQ;
      }),
    [cat, directory, search],
  );

  const [featured, ...rest] = filtered;

  useEffect(() => {
    const prefs = loadHomePreferences();
    setFavoriteIds(prefs.favoriteContactIds);
  }, []);

  function toggleFavorite(id: string | number) {
    const prefs = loadHomePreferences();
    const next = prefs.favoriteContactIds.includes(id)
      ? prefs.favoriteContactIds.filter((item) => item !== id)
      : [...prefs.favoriteContactIds, id];
    const updated = { ...prefs, favoriteContactIds: next };
    saveHomePreferences(updated);
    setFavoriteIds(next);
  }

  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto pb-4 pt-20">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5 md:grid-cols-[1.12fr_0.88fr] md:items-center">
              <div>
                <span
                  className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]"
                  style={{ background: "rgba(159,29,47,0.08)", color: "var(--primary)" }}
                >
                  Místní služby
                </span>
                <h1
                  className="font-headline text-3xl font-extrabold tracking-tight md:text-[2.6rem]"
                  style={{ color: "var(--primary)" }}
                >
                  Adresář a služby
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Praktické kontakty, podniky a rychlé spojení na místa, která ve Vimperku potřebujete nejčastěji.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "apartment", label: "Město", tone: "var(--primary-fixed)" },
                  { icon: "local_taxi", label: "Taxi", tone: "var(--secondary-fixed)" },
                  { icon: "medical_services", label: "Zdraví", tone: "var(--tertiary-fixed)" },
                  { icon: "restaurant", label: "Gastro", tone: "var(--surface-container)" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] p-4"
                    style={{ background: item.tone, border: "1px solid rgba(159,29,47,0.06)" }}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>
                      {item.icon}
                    </span>
                    <p className="mt-3 text-sm font-semibold" style={{ color: "var(--on-surface)" }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 pb-2 pt-4">
          <div className="editorial-shell relative rounded-[1.8rem] p-3">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: "20px" }}>
                search
              </span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Hledat firmy, taxi, lékaře..."
              className="h-14 w-full rounded-2xl pl-12 pr-4 text-sm outline-none transition-all"
              style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(159,29,47,0.08)",
                color: "var(--on-surface)",
              }}
            />
          </div>
        </div>

        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-2 pt-3">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCat(value)}
              className="flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
              style={
                cat === value
                  ? {
                      background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                      color: "var(--on-primary)",
                      boxShadow: "0 10px 18px rgba(67,17,24,0.14)",
                    }
                  : {
                      background: "var(--surface-container-low)",
                      color: "var(--on-surface)",
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3 px-4 pt-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined mb-3 block text-5xl opacity-40">search_off</span>
              <p className="font-semibold">Nic nenalezeno</p>
            </div>
          ) : null}

          {featured ? (
            <div
              className="relative overflow-hidden rounded-[2.5rem] p-6"
              style={{
                background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)",
                boxShadow: "0 16px 34px rgba(67,17,24,0.18)",
              }}
            >
              <div
                className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
              />
              <div className="relative z-10">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                >
                  Doporučené
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(featured.id)}
                  className="ml-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "rgba(255,255,255,0.16)", color: "white" }}
                >
                  {favoriteIds.includes(featured.id) ? "V oblíbených" : "Přidat"}
                </button>
                <h3 className="mt-4 font-headline text-2xl font-extrabold text-white">{featured.name}</h3>
                {featured.rating ? (
                  <div className="mt-2 flex items-center gap-2 text-white">
                    <span
                      className="material-symbols-outlined text-base text-yellow-300"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold">{featured.rating}</span>
                  </div>
                ) : null}
                <div className="mt-4 space-y-1.5 text-sm text-white/90">
                  <div>{featured.phone}</div>
                  <div>{featured.address}</div>
                  {featured.email ? <div>{featured.email}</div> : null}
                  {featured.hours ? <div>{featured.hours}</div> : null}
                </div>
                {featured.note ? <div className="mt-3 text-sm text-white/85">{featured.note}</div> : null}
              </div>
            </div>
          ) : null}

          {rest.map((item) => {
            const style = catStyle[item.category] ?? {
              bg: "var(--surface-container)",
              color: "var(--on-surface-variant)",
            };

            return (
              <div
                key={`${item.id}-${item.name}`}
                className="flex items-center gap-4 rounded-[2rem] p-5 transition-all active:scale-[0.98]"
                style={{
                  background: "var(--surface-container-lowest)",
                  boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
                  border: "1px solid rgba(159,29,47,0.05)",
                }}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: style.bg }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: style.color }}>
                    {catIcon[item.category] ?? "store"}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-headline text-base font-bold leading-snug text-on-surface">{item.name}</h3>
                    {item.rating ? (
                      <div className="shrink-0 rounded-lg px-2 py-0.5" style={{ background: "var(--surface-container-low)" }}>
                        <span className="text-sm font-bold text-on-surface">{item.rating}</span>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.id)}
                    className="mt-2 rounded-full px-3 py-1 text-xs font-bold"
                    style={favoriteIds.includes(item.id)
                      ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                      : { background: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}
                  >
                    {favoriteIds.includes(item.id) ? "Uloženo" : "Do oblíbených"}
                  </button>
                  {item.hours ? <div className="mt-1 text-xs text-on-surface-variant">{item.hours}</div> : null}
                  <div className="mt-2 text-sm text-on-surface-variant">{item.phone}</div>
                  <div className="mt-0.5 text-sm text-on-surface-variant">{item.address}</div>
                  {item.email ? <div className="mt-0.5 break-all text-xs text-on-surface-variant">{item.email}</div> : null}
                  {item.note ? <div className="mt-1 text-xs text-on-surface-variant">{item.note}</div> : null}
                  {(item.website || item.sourceUrl) ? (
                    <div className="mt-2 flex gap-3 text-xs">
                      {item.website ? (
                        <a href={item.website} target="_blank" rel="noreferrer" className="font-semibold text-primary">
                          Web
                        </a>
                      ) : null}
                      {item.sourceUrl ? (
                        <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-on-surface-variant">
                          Zdroj
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <a
                  href={`tel:${item.phone.replace(/\s/g, "")}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                    color: "var(--on-primary)",
                    boxShadow: "0 8px 18px rgba(67,17,24,0.14)",
                  }}
                >
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
