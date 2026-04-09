"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { downloadEventCalendarFile } from "@/lib/calendar";
import { loadSavedEvents, removeSavedEvent, saveSavedEvent } from "@/lib/client-storage";
import { getEventDetailHref } from "@/lib/content-links";
import { getAnonymousInstallationId } from "@/lib/push-client";
import type { PublicEventItem } from "@/lib/public-content";

export function EventDetailClient({
  item,
  related,
}: {
  item: PublicEventItem;
  related: PublicEventItem[];
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(loadSavedEvents().some((entry) => entry.id === String(item.id)));
  }, [item.id]);

  async function syncReminder(action: "save" | "remove") {
    const installationId = getAnonymousInstallationId();
    if (!installationId) return;

    try {
      await fetch("/api/reminders", {
        method: action === "save" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installationId,
          eventId: String(item.id),
          title: item.title,
          date: item.date,
          time: item.time,
          place: item.place,
          url: getEventDetailHref(item),
          reminderType: "1d",
        }),
      });
    } catch {
      // Local fallback remains active.
    }
  }

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "var(--secondary)" }}>
              {item.category} · {item.date} · {item.time}
            </p>
            <h1 className="mt-3 font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
              {item.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              {item.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}>
                {item.place}
              </span>
              <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={item.free
                ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
                {item.free ? "Vstup zdarma" : item.price}
              </span>
            </div>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div className="rounded-[1.8rem] p-6" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
            <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
              Co s akcí dál
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              Ulož si termín do kalendáře nebo se vrať do seznamu všech akcí.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => downloadEventCalendarFile(item)}
                className="rounded-full px-4 py-3 text-sm font-bold"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                Přidat do kalendáře
              </button>
              <button
                type="button"
                onClick={() => {
                  const eventId = String(item.id);
                  if (saved) {
                    removeSavedEvent(eventId);
                    setSaved(false);
                    void syncReminder("remove");
                    return;
                  }
                  saveSavedEvent({
                    id: eventId,
                    title: item.title,
                    date: item.date,
                    time: item.time,
                    place: item.place,
                    category: item.category,
                    reminder: "1d",
                    href: getEventDetailHref(item),
                  });
                  setSaved(true);
                  void syncReminder("save");
                }}
                className="rounded-full px-4 py-3 text-sm font-bold"
                style={saved
                  ? { background: "var(--primary-fixed)", color: "var(--on-primary-fixed)" }
                  : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
              >
                {saved ? "Uloženo s reminderem" : "Uložit akci"}
              </button>
              <Link
                href="/kalendar"
                className="rounded-full px-4 py-3 text-sm font-bold"
                style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
              >
                Zpět do kalendáře
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="px-4 pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                Podobné akce
              </h2>
              <Link href="/kalendar" className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                Celý kalendář
              </Link>
            </div>
            <div className="space-y-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={getEventDetailHref(entry)}
                  className="block rounded-[1.6rem] p-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {entry.date} · {entry.time} · {entry.place}
                  </p>
                  <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {entry.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
