"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";
import { buildSearchIndex } from "@/lib/search";

export function SearchPageClient({
  news,
  events,
  directory,
  polls,
}: {
  news: PublicNewsItem[];
  events: PublicEventItem[];
  directory: PublicDirectoryItem[];
  polls: PublicPoll[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "news" | "event" | "directory" | "poll">("all");
  const index = useMemo(() => buildSearchIndex({ news, events, directory, polls }), [directory, events, news, polls]);
  const deferredQuery = query.trim().toLowerCase();

  const results = useMemo(
    () =>
      index
        .filter((item) => (type === "all" ? true : item.type === type))
        .filter((item) => !deferredQuery || item.keywords.includes(deferredQuery))
        .slice(0, 40),
    [deferredQuery, index, type],
  );

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
          </div>
        </section>

        <section className="px-4 pt-6 space-y-3">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-[1.5rem] p-4"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                {item.type}
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
