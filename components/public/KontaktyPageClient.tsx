"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import { loadHomePreferences, saveHomePreferences } from "@/lib/client-storage";
import {
  buildDirectorySearchIndex,
  cityDepartmentLabels,
  scoreFeaturedContact,
} from "@/lib/directory";
import type { PublicDirectoryItem } from "@/lib/public-content";

type Cat = PublicDirectoryItem["category"] | "vše";
type CityDepartment = NonNullable<PublicDirectoryItem["cityDepartment"]> | "vše";

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

const heroFilters: { value: Cat; label: string; icon: string }[] = [
  { value: "město", label: "Město", icon: "apartment" },
  { value: "lékař", label: "Lékaři", icon: "health_and_safety" },
  { value: "lékárna", label: "Lékárny", icon: "medical_services" },
  { value: "taxi", label: "Taxi", icon: "local_taxi" },
  { value: "restaurace", label: "Gastro", icon: "restaurant" },
  { value: "sport", label: "Sport", icon: "fitness_center" },
  { value: "obchod", label: "Obchody", icon: "storefront" },
  { value: "opravna", label: "Opravny", icon: "build" },
];

const cityDepartmentFilters: { value: CityDepartment; label: string }[] = [
  { value: "vše", label: "Všechny odbory" },
  { value: "central", label: "Centrální kontakt" },
  { value: "vnitrni-veci", label: "Doklady a matrika" },
  { value: "doprava", label: "Doprava" },
  { value: "zivnostensky", label: "Podnikání" },
  { value: "vystavba", label: "Výstavba" },
  { value: "zivotni-prostredi", label: "Životní prostředí" },
  { value: "socialni", label: "Sociální oblast" },
  { value: "bezpecnost", label: "Bezpečnost" },
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

export function KontaktyPageClient({
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
  const [cityDepartment, setCityDepartment] = useState<CityDepartment>("vše");

  const municipalContacts = useMemo(
    () => directory.filter((item) => item.category === "město"),
    [directory],
  );

  const filtered = useMemo(
    () =>
      directory.filter((item) => {
        const matchCat = cat === "vše" || item.category === cat;
        const matchDepartment =
          cat !== "město" ||
          cityDepartment === "vše" ||
          item.cityDepartment === cityDepartment;
        const q = search.toLowerCase();
        const matchQ = !q || buildDirectorySearchIndex(item).includes(q);
        return matchCat && matchDepartment && matchQ;
      }),
    [cat, cityDepartment, directory, search],
  );

  const featured = useMemo(
    () =>
      [...filtered].sort(
        (left, right) => scoreFeaturedContact(right, search) - scoreFeaturedContact(left, search),
      )[0],
    [filtered, search],
  );
  const rest = filtered.filter((item) => item.id !== featured?.id);
  const showMunicipalSection = cat === "vše" && search.trim() === "";

  useEffect(() => {
    const prefs = loadHomePreferences();
    setFavoriteIds(prefs.favoriteContactIds);
  }, []);

  async function copyContact(value: string) {
    await navigator.clipboard.writeText(value);
  }

  async function shareContact(item: PublicDirectoryItem) {
    const payload = {
      title: item.name,
      text: [item.phone, item.address, item.email ?? ""].filter(Boolean).join(" · "),
    };
    if (navigator.share) {
      await navigator.share(payload);
      return;
    }
    await copyContact(`${item.name}\n${payload.text}`);
  }

  function toggleFavorite(id: string | number) {
    const prefs = loadHomePreferences();
    const next = prefs.favoriteContactIds.includes(id)
      ? prefs.favoriteContactIds.filter((item) => item !== id)
      : [...prefs.favoriteContactIds, id];
    saveHomePreferences({ ...prefs, favoriteContactIds: next });
    setFavoriteIds(next);
  }

  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto pb-4 pt-20">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5">
              <div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Kontakty
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Radnice, odbory města, městská policie i praktické služby přehledně na jednom místě.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {heroFilters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCat(item.value)}
                    className="rounded-[1.25rem] p-3 text-left transition-all active:scale-95"
                    style={
                      cat === item.value
                        ? {
                            background: "var(--secondary-container)",
                            boxShadow: "0 10px 18px rgba(53,110,92,0.12)",
                          }
                        : {
                            background: "var(--surface-container-lowest)",
                          }
                    }
                  >
                    <span className="material-symbols-outlined text-[1.3rem]" style={{ color: "var(--secondary)" }}>
                      {item.icon}
                    </span>
                    <p className="mt-2 text-[11px] font-semibold leading-tight" style={{ color: "var(--on-surface)" }}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          <div
            className="rounded-[2rem] p-4"
            style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>
                search
              </span>
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

        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-2 pt-4">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setCat(value);
                if (value !== "město") setCityDepartment("vše");
              }}
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

        {cat === "město" ? (
          <div className="hide-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-2 pt-3">
            {cityDepartmentFilters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCityDepartment(value)}
                className="flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
                style={
                  cityDepartment === value
                    ? {
                        background: "var(--secondary-container)",
                        color: "var(--on-secondary-container)",
                        boxShadow: "0 10px 18px rgba(53,110,92,0.12)",
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
        ) : null}

        {showMunicipalSection && municipalContacts.length > 0 ? (
          <section className="px-4 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
                Důležité městské kontakty
              </h2>
              <button type="button" onClick={() => setCat("město")} className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                Zobrazit vše
              </button>
            </div>

            <div className="space-y-3">
              {municipalContacts.slice(0, 3).map((item) => (
                <div
                  key={`${item.id}-${item.name}`}
                  className="rounded-[1.8rem] p-5"
                  style={{ background: "var(--secondary-container)", border: "1px solid rgba(53, 110, 92, 0.10)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-headline text-base font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
                        {item.name}
                      </p>
                      {item.cityDepartment ? (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(31, 36, 34, 0.74)" }}>
                          {cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm" style={{ color: "var(--on-secondary-container)" }}>{item.phone}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--on-secondary-container)" }}>{item.address}</p>
                      {item.hours ? (
                        <p className="mt-1 text-xs" style={{ color: "rgba(31, 36, 34, 0.74)" }}>
                          {item.hours}
                        </p>
                      ) : null}
                    </div>
                    <a
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(255,255,255,0.65)", color: "var(--secondary)" }}
                    >
                      <span className="material-symbols-outlined">call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3 px-4 pt-6">
          {featured ? (
            <div
              className="rounded-[2rem] p-6"
              style={{
                background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)",
                boxShadow: "0 16px 34px rgba(67,17,24,0.18)",
              }}
            >
              <span
                className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}
              >
                Doporučený kontakt
              </span>
              <button
                type="button"
                onClick={() => toggleFavorite(featured.id)}
                className="ml-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}
              >
                {favoriteIds.includes(featured.id) ? "V oblíbených" : "Do oblíbených"}
              </button>
              <h3 className="mt-4 font-headline text-2xl font-extrabold text-white">{featured.name}</h3>
              <div className="mt-4 space-y-1.5 text-sm text-white/90">
                <div>{featured.phone}</div>
                <div>{featured.address}</div>
                {featured.email ? <div>{featured.email}</div> : null}
              </div>
              {featured.cityDepartment ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/75">
                  {cityDepartmentLabels[featured.cityDepartment] ?? featured.cityDepartment}
                </p>
              ) : null}
              {featured.note ? <p className="mt-3 text-sm text-white/85">{featured.note}</p> : null}
              {(featured.appointmentUrl || featured.website || featured.sourceUrl) ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {featured.appointmentUrl ? (
                    <a
                      href={featured.appointmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full px-4 py-3 text-sm font-bold"
                      style={{ background: "rgba(255,255,255,0.92)", color: "var(--primary)" }}
                    >
                      {featured.appointmentLabel ?? "Objednat termín online"}
                    </a>
                  ) : null}
                  {featured.website ? (
                    <a
                      href={featured.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full px-4 py-3 text-sm font-bold"
                      style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      Web pracoviště
                    </a>
                  ) : null}
                  {!featured.website && featured.sourceUrl && featured.category === "město" ? (
                    <a
                      href={featured.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full px-4 py-3 text-sm font-bold"
                      style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                    >
                      Detail odboru
                    </a>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.email ? (
                  <a
                    href={`mailto:${featured.email}`}
                    className="rounded-full px-4 py-3 text-sm font-bold"
                    style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    Napsat e-mail
                  </a>
                ) : null}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(featured.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  Otevřít mapu
                </a>
                <button
                  type="button"
                  onClick={() => shareContact(featured)}
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  Sdílet kontakt
                </button>
                {featured.category === "město" ? (
                  <Link
                    href="/napsat-mestu"
                    className="rounded-full px-4 py-3 text-sm font-bold"
                    style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    Napsat městu
                  </Link>
                ) : null}
                <Link
                  href="/zhlasit"
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.16)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  Nahlásit závadu
                </Link>
              </div>
            </div>
          ) : null}

          {rest.map((item) => (
            <div
              key={`${item.id}-${item.name}`}
              className="flex items-center gap-4 rounded-[1.8rem] p-5"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
                border: "1px solid rgba(159,29,47,0.05)",
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: item.category === "město" ? "var(--secondary-container)" : "var(--surface-container-low)" }}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: item.category === "město" ? "var(--secondary)" : "var(--on-surface-variant)" }}>
                  {catIcon[item.category] ?? "call"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline text-base font-bold leading-snug" style={{ color: "var(--on-surface)" }}>
                  {item.name}
                </h3>
                <button
                  type="button"
                  onClick={() => toggleFavorite(item.id)}
                  className="mt-2 rounded-full px-3 py-2 text-xs font-bold"
                  style={favoriteIds.includes(item.id)
                    ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                    : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                >
                  {favoriteIds.includes(item.id) ? "Uloženo" : "Do oblíbených"}
                </button>
                {item.cityDepartment ? (
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--secondary)" }}>
                    {cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment}
                  </div>
                ) : null}
                {item.hours ? (
                  <div className="mt-1 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    {item.hours}
                  </div>
                ) : null}
                <div className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.phone}</div>
                <div className="mt-0.5 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.address}</div>
                {item.note ? (
                  <div className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                    {item.note}
                  </div>
                ) : null}
                {(item.appointmentUrl || item.website || item.sourceUrl) ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.appointmentUrl ? (
                      <a
                        href={item.appointmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-3 py-2 text-xs font-bold"
                        style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                      >
                        {item.appointmentLabel ?? "Objednat online"}
                      </a>
                    ) : null}
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-3 py-2 text-xs font-bold"
                        style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                      >
                        Web
                      </a>
                    ) : null}
                    {!item.website && item.sourceUrl && item.category === "město" ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-3 py-2 text-xs font-bold"
                        style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                      >
                        Detail odboru
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.email ? (
                    <a
                      href={`mailto:${item.email}`}
                      className="rounded-full px-3 py-2 text-xs font-bold"
                      style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                    >
                      E-mail
                    </a>
                  ) : null}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full px-3 py-2 text-xs font-bold"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  >
                    Mapa
                  </a>
                  <button
                    type="button"
                    onClick={() => copyContact(item.phone)}
                    className="rounded-full px-3 py-2 text-xs font-bold"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  >
                    Kopírovat telefon
                  </button>
                  <button
                    type="button"
                    onClick={() => shareContact(item)}
                    className="rounded-full px-3 py-2 text-xs font-bold"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  >
                    Sdílet
                  </button>
                  {item.category === "město" ? (
                    <Link
                      href="/napsat-mestu"
                      className="rounded-full px-3 py-2 text-xs font-bold"
                      style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                    >
                      Napsat městu
                    </Link>
                  ) : null}
                </div>
              </div>
              <a
                href={`tel:${item.phone.replace(/\s/g, "")}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                  color: "var(--on-primary)",
                  boxShadow: "0 8px 18px rgba(67,17,24,0.14)",
                }}
              >
                <span className="material-symbols-outlined">call</span>
              </a>
            </div>
          ))}
          {filtered.length === 0 ? (
            <div
              className="rounded-[1.8rem] p-5 text-sm"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
              }}
            >
              Nenašel se žádný kontakt. Zkuste jinou kategorii, telefon, odbor nebo klíčové slovo.
            </div>
          ) : null}
        </section>

        <section className="px-4 pb-4 pt-8">
          <Link
            href="/napsat-mestu"
            className="editorial-shell block rounded-[2rem] p-5"
            style={{ boxShadow: "0 14px 30px rgba(67,17,24,0.08)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
                Napsat městu
              </h2>
              <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>
                arrow_forward
              </span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Nenašli jste správný kontakt nebo potřebujete něco poslat přímo městu? Použijte jednoduchý formulář.
            </p>
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
