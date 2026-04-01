"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import PushNotificationButton from "@/components/PushNotificationButton";
import {
  loadHomePreferences,
  loadRecentViews,
  loadSavedEvents,
  loadTrackedReports,
  saveHomePreferences,
  updateSavedEventReminder,
  type RecentViewItem,
  type SavedEventItem,
  type TrackedReportItem,
} from "@/lib/client-storage";
import { getAnonymousInstallationId } from "@/lib/push-client";
import type { PublicDirectoryItem } from "@/lib/public-content";
import type { HomePreferences } from "@/lib/user-preferences";

export function MojePageClient({ directory }: { directory: PublicDirectoryItem[] }) {
  const [preferences, setPreferences] = useState<HomePreferences | null>(null);
  const [recentViews, setRecentViews] = useState<RecentViewItem[]>([]);
  const [savedEvents, setSavedEvents] = useState<SavedEventItem[]>([]);
  const [trackedReports, setTrackedReports] = useState<TrackedReportItem[]>([]);

  useEffect(() => {
    setPreferences(loadHomePreferences());
    setRecentViews(loadRecentViews());
    setSavedEvents(loadSavedEvents());
    setTrackedReports(loadTrackedReports());
  }, []);

  const favoriteContacts = useMemo(() => {
    if (!preferences) return [];
    return directory.filter((item) => preferences.favoriteContactIds.includes(item.id));
  }, [directory, preferences]);

  async function syncReminder(event: SavedEventItem, reminder: SavedEventItem["reminder"]) {
    const installationId = getAnonymousInstallationId();
    if (!installationId) return;

    try {
      if (reminder === "none") {
        await fetch("/api/reminders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            installationId,
            eventId: event.id,
          }),
        });
        return;
      }

      await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installationId,
          eventId: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          place: event.place,
          url: event.href,
          reminderType: reminder,
        }),
      });
    } catch {
      // Local anonymous fallback remains active in this device.
    }
  }

  function updateReminder(event: SavedEventItem, reminder: SavedEventItem["reminder"]) {
    updateSavedEventReminder(event.id, reminder);
    setSavedEvents(loadSavedEvents());
    void syncReminder(event, reminder);
  }

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "var(--secondary)" }}>
              Osobní přehled
            </p>
            <h1 className="mt-3 font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
              Moje
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Oblíbené kontakty, uložené akce, moje hlášení, poslední otevřené a notifikace na jednom místě.
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Bez účtu a bez veřejného profilu. Osobní věci jsou navázané anonymně jen na tohle zařízení.
            </p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Oblíbené kontakty", value: favoriteContacts.length },
              { label: "Uložené akce", value: savedEvents.length },
              { label: "Moje hlášení", value: trackedReports.length },
              { label: "Nedávno otevřené", value: recentViews.length },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.4rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--on-surface-variant)" }}>{item.label}</p>
                <p className="mt-2 font-headline text-2xl font-black" style={{ color: "var(--primary)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <Section title="Uložené akce" actionHref="/kalendar">
          {savedEvents.length > 0 ? savedEvents.map((event) => (
            <div key={event.id} className="rounded-[1.6rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
              <Link href={event.href} className="block">
                <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                  {event.category} · {event.date} · {event.time}
                </p>
                <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>{event.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>{event.place}</p>
              </Link>
              <p className="mt-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                Reminder: {event.reminder === "1d" ? "1 den předem" : event.reminder === "2h" ? "2 hodiny předem" : "vypnutý"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { value: "1d", label: "1 den" },
                  { value: "2h", label: "2 hodiny" },
                  { value: "none", label: "Vypnout" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateReminder(event, option.value as SavedEventItem["reminder"])}
                    className="rounded-full px-3 py-1.5 text-xs font-bold"
                    style={event.reminder === option.value
                      ? { background: "var(--primary-fixed)", color: "var(--on-primary-fixed)" }
                      : { background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )) : <Empty text="Zatím tu nemáš uloženou žádnou akci." />}
        </Section>

        <Section title="Moje hlášení" actionHref="/zhlasit">
          {trackedReports.length > 0 ? trackedReports.map((report) => (
            <Link key={report.id} href={`/zhlasit/${encodeURIComponent(report.id)}`} className="block rounded-[1.6rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                {report.category}
              </p>
              <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>{report.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>{report.status}</p>
            </Link>
          )) : <Empty text="Zatím tu nemáš žádné hlášení závad." />}
        </Section>

        <Section title="Oblíbené kontakty" actionHref="/kontakty">
          {favoriteContacts.length > 0 ? favoriteContacts.map((contact) => (
            <Link key={contact.id} href={`/kontakty/${encodeURIComponent(String(contact.id))}`} className="block rounded-[1.6rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
              <p className="font-bold" style={{ color: "var(--on-surface)" }}>{contact.name}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>{contact.phone}</p>
              <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>{contact.address}</p>
            </Link>
          )) : <Empty text="Zatím tu nemáš oblíbené kontakty." />}
        </Section>

        <Section title="Nedávno otevřené">
          {recentViews.length > 0 ? recentViews.map((item) => (
            <Link key={`${item.type}-${item.id}-${item.savedAt}`} href={item.href} className="block rounded-[1.6rem] p-4" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>{item.type}</p>
              <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>{item.title}</h3>
              {item.subtitle ? <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>{item.subtitle}</p> : null}
            </Link>
          )) : <Empty text="Historie otevřených položek je zatím prázdná." />}
        </Section>

        <section className="px-4 pt-8">
          <div className="rounded-[1.8rem] p-6" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
            <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
              Notifikace
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              Vyber si témata, která chceš dostávat. Nastavení se propsalo i do homepage.
            </p>
            <div className="mt-5">
              <PushNotificationButton
                topics={preferences?.notificationTopics ?? []}
                onTopicsChange={(topics) => {
                  if (!preferences) return;
                  const next = { ...preferences, notificationTopics: topics };
                  setPreferences(next);
                  saveHomePreferences(next);
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

function Section({
  title,
  actionHref,
  children,
}: {
  title: string;
  actionHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 pt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>{title}</h2>
        {actionHref ? <Link href={actionHref} className="text-sm font-bold" style={{ color: "var(--secondary)" }}>Otevřít</Link> : null}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-[1.6rem] p-4 text-sm" style={{ background: "var(--surface-container-lowest)" }}>
      {text}
    </div>
  );
}
