"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { downloadEventCalendarFile } from "@/lib/calendar";
import { loadSavedEvents, removeSavedEvent, saveSavedEvent } from "@/lib/client-storage";
import { getEventDetailHref } from "@/lib/content-links";
import { getDateBadgeParts } from "@/lib/date-display";
import { getAnonymousInstallationId } from "@/lib/push-client";
import type { PublicEventItem } from "@/lib/public-content";

type Category = PublicEventItem["category"] | "vše";

const categories: { value: Category; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "kino", label: "Kino" },
  { value: "kultura", label: "Kultura" },
  { value: "sport", label: "Sport" },
  { value: "trhy", label: "Trhy" },
  { value: "úřad", label: "Město" },
];

const categoryStyle: Record<PublicEventItem["category"], { bg: string; text: string }> = {
  kultura: { bg: "var(--primary-fixed)", text: "var(--on-primary-fixed)" },
  sport: { bg: "var(--tertiary-fixed)", text: "var(--on-tertiary-fixed)" },
  kino: { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  úřad: { bg: "var(--surface-container-high)", text: "var(--on-surface)" },
  trhy: { bg: "var(--secondary-fixed)", text: "var(--on-secondary-fixed)" },
};

export function KalendarPageClient({ events }: { events: PublicEventItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("vše");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [reminderError, setReminderError] = useState(false);

  const filtered = events
    .filter((event) => activeCategory === "vše" || event.category === activeCategory)
    .sort((a, b) => a.date.localeCompare(b.date));

  const freeEvents = filtered.filter((event) => event.free).length;

  useEffect(() => {
    setSavedIds(loadSavedEvents().map((item) => item.id));
  }, []);

  async function syncReminder(action: "save" | "remove", event: PublicEventItem) {
    const installationId = getAnonymousInstallationId();
    if (!installationId) {
      setReminderError(false);
      setReminderMessage("Akce zůstala uložená jen v tomto zařízení.");
      return;
    }
    const payload = {
      installationId,
      eventId: String(event.id),
      title: event.title,
      date: event.date,
      time: event.time,
      place: event.place,
      url: getEventDetailHref(event),
      reminderType: "1d" as const,
    };

    try {
      const response = await fetch("/api/reminders", {
        method: action === "save" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Reminder sync failed");
      }

      setReminderError(false);
      setReminderMessage(
        action === "save"
          ? "Připomenutí bylo synchronizováno."
          : "Připomenutí bylo odstraněno.",
      );
    } catch {
      setReminderError(true);
      setReminderMessage(
        action === "save"
          ? "Akce je uložená jen lokálně. Serverové připomenutí se nepodařilo vytvořit."
          : "Akce byla odebraná lokálně, ale serverové připomenutí se nepodařilo odstranit.",
      );
    }
  }

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5">
              <div>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Kalendář akcí
                </h1>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Sport, kultura, kino, workshopy i městská setkání v jednom přehledu podle termínu.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[1.4rem] p-4" style={{ background: "var(--surface-container-lowest)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>Nejbližší akce</p>
                  <p className="mt-2 font-headline text-2xl font-black" style={{ color: "var(--primary)" }}>{filtered.length}</p>
                </div>
                <div className="rounded-[1.4rem] p-4" style={{ background: "var(--secondary-container)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--on-secondary-container)" }}>Vstup zdarma</p>
                  <p className="mt-2 font-headline text-2xl font-black" style={{ color: "var(--on-secondary-container)" }}>{freeEvents}</p>
                </div>
                <div className="rounded-[1.4rem] p-4" style={{ background: "var(--tertiary-fixed)" }}>
                  <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--on-tertiary-fixed)" }}>Tento<br />týden</p>
                  <p className="mt-2 font-headline text-2xl font-black" style={{ color: "var(--on-tertiary-fixed)" }}>{Math.min(filtered.length, 4)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 pb-2 pt-5">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={activeCategory === value
                ? {
                    background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                    color: "var(--on-primary)",
                    boxShadow: "0 10px 18px rgba(67,17,24,0.14)",
                  }
                : {
                    background: "var(--surface-container-low)",
                    color: "var(--on-surface)",
                  }}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="px-4 pt-4 space-y-3">
          {reminderMessage ? (
            <div
              className="rounded-[1.4rem] px-4 py-3 text-sm font-medium"
              style={reminderError
                ? { background: "var(--error-container)", color: "var(--on-error-container)" }
                : { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
            >
              {reminderMessage}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="rounded-[2rem] px-6 py-12 text-center" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
              <span className="material-symbols-outlined mb-3 block text-5xl" style={{ color: "var(--outline)" }}>event_busy</span>
              <p className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>Pro tento filtr tu teď nic není</p>
              <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>Zkus jinou kategorii nebo se vrať později.</p>
            </div>
          ) : null}

          {filtered.map((event) => {
            const style = categoryStyle[event.category];
            const badgeDate = getDateBadgeParts(event.date);
            return (
              <Link
                key={event.id}
                href={getEventDetailHref(event)}
                className="rounded-[2rem] p-5"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 rounded-[1.3rem] px-3 py-4 text-center shrink-0" style={{ background: style.bg }}>
                    <p className="font-headline text-2xl font-black leading-none" style={{ color: style.text }}>
                      {badgeDate.day}
                    </p>
                    <p className="mt-1 text-[11px] uppercase font-bold tracking-[0.16em]" style={{ color: style.text, opacity: 0.85 }}>
                      {badgeDate.month}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: style.bg, color: style.text }}>
                        {event.category}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--secondary)" }}>{event.time}</span>
                    </div>
                    <h2 className="mt-3 font-headline text-[1.2rem] font-extrabold leading-snug" style={{ color: "var(--on-surface)" }}>
                      {event.title}
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                      {event.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full px-3 py-2 text-sm font-semibold" style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}>
                        {event.place}
                      </span>
                      <span className="rounded-full px-3 py-2 text-sm font-semibold" style={event.free
                        ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                        : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
                        {event.free ? "Vstup zdarma" : event.price}
                      </span>
                      <button
                        type="button"
                        onClick={(eventClick) => {
                          eventClick.preventDefault();
                          downloadEventCalendarFile(event);
                        }}
                        className="rounded-full px-3 py-2 text-sm font-semibold"
                        style={{ background: "var(--primary-fixed)", color: "var(--on-primary-fixed)" }}
                      >
                        Uložit termín
                      </button>
                      <button
                        type="button"
                        onClick={(eventClick) => {
                          eventClick.preventDefault();
                          const eventId = String(event.id);
                          if (savedIds.includes(eventId)) {
                            removeSavedEvent(eventId);
                            setSavedIds(loadSavedEvents().map((item) => item.id));
                            void syncReminder("remove", event);
                            return;
                          }
                          saveSavedEvent({
                            id: eventId,
                            title: event.title,
                            date: event.date,
                            time: event.time,
                            place: event.place,
                            category: event.category,
                            reminder: "1d",
                            href: getEventDetailHref(event),
                          });
                          setSavedIds(loadSavedEvents().map((item) => item.id));
                          void syncReminder("save", event);
                        }}
                        className="rounded-full px-3 py-2 text-sm font-semibold"
                        style={savedIds.includes(String(event.id))
                          ? { background: "var(--primary-fixed)", color: "var(--on-primary-fixed)" }
                          : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                      >
                        {savedIds.includes(String(event.id)) ? "Uloženo" : "Uložit"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="px-4 pt-8 pb-4">
          <Link href="/napsat-mestu" className="editorial-shell rounded-[2rem] p-5 block" style={{ boxShadow: "0 14px 30px rgba(67,17,24,0.08)" }}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>Napsat městu</h2>
              <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>arrow_forward</span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Máte dotaz ke kulturním akcím, dopravě nebo městskému provozu? Pošlete ho rovnou radnici.
            </p>
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
