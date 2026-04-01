"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import {
  clearRecentSearches,
  loadRecentSearches,
  saveRecentView,
  saveRecentSearch,
} from "@/lib/client-storage";
import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";
import {
  buildSearchIndex,
  getSearchTypeLabel,
  groupSearchResults,
  searchIndex,
} from "@/lib/search";

export function SearchPageClient({
  news,
  events,
  directory,
  polls,
  initialQuery = "",
}: {
  news: PublicNewsItem[];
  events: PublicEventItem[];
  directory: PublicDirectoryItem[];
  polls: PublicPoll[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<"all" | "news" | "event" | "directory" | "poll">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const index = useMemo(() => buildSearchIndex({ news, events, directory, polls }), [directory, events, news, polls]);
  const deferredQuery = query.trim().toLowerCase();

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  useEffect(() => {
    if (!deferredQuery || deferredQuery.length < 2) return;
    const timeout = window.setTimeout(() => {
      saveRecentSearch(deferredQuery);
      setRecentSearches(loadRecentSearches());
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [deferredQuery]);

  const results = useMemo(
    () => searchIndex(index, { query: deferredQuery, type, limit: 40 }),
    [deferredQuery, index, type],
  );
  const groupedResults = useMemo(() => groupSearchResults(results), [results]);

  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto pt-20 pb-28">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5">
            <h1 className="font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
              Hledat napříč Vimperkem
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              Zprávy, akce, kontakty i ankety na jednom místě.
            </p>
            <div className="mt-5 rounded-[1.4rem] px-4 py-3" style={{ background: "var(--surface-container-lowest)" }}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Hledat lékaře, uzavírku, kino, ankety..."
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--on-surface)" }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["all", "Vše"],
                ["news", "Zprávy"],
                ["event", "Akce"],
                ["directory", "Kontakty"],
                ["poll", "Ankety"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value as typeof type)}
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={type === value
                    ? { background: "var(--primary)", color: "var(--on-primary)" }
                    : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["pohotovost", "uzavírka", "kino", "matrika", "sport", "taxi"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full px-3 py-2 text-xs font-semibold"
                  style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>

        {recentSearches.length > 0 ? (
          <section className="px-4 pt-5">
            <div className="rounded-[1.6rem] p-4" style={{ background: "var(--surface-container-lowest)" }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                  Poslední hledání
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearRecentSearches();
                    setRecentSearches([]);
                  }}
                  className="text-xs font-bold"
                  style={{ color: "var(--secondary)" }}
                >
                  Smazat
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full px-3 py-2 text-xs font-semibold"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 pt-6 space-y-6">
          {type === "all"
            ? groupedResults.map((group) => (
                <div key={group.type}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                      {group.label}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--secondary)" }}>
                      {group.items.length} výsledků
                    </p>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          saveRecentView({
                            id: item.id,
                            type: item.type,
                            title: item.title,
                            href: item.href,
                            subtitle: item.subtitle,
                          });
                        }}
                        className="block rounded-[1.5rem] p-4"
                        style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                      >
                        <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                          {getSearchTypeLabel(item.type)}
                        </p>
                        <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                          {item.subtitle}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            : results.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    saveRecentView({
                      id: item.id,
                      type: item.type,
                      title: item.title,
                      href: item.href,
                      subtitle: item.subtitle,
                    });
                  }}
                  className="block rounded-[1.5rem] p-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {getSearchTypeLabel(item.type)}
                  </p>
                  <h2 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {item.subtitle}
                  </p>
                </Link>
              ))}
          {results.length === 0 ? (
            <div className="rounded-[1.5rem] p-5 text-sm" style={{ background: "var(--surface-container-lowest)" }}>
              Nic jsme nenašli. Zkus jiný výraz, typ obsahu nebo otevři kontakty a kalendář přímo.
            </div>
          ) : null}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
