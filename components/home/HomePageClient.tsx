"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import PwaInstallCard from "@/components/PwaInstallCard";
import PushNotificationButton from "@/components/PushNotificationButton";
import { downloadEventCalendarFile } from "@/lib/calendar";
import { loadHomePreferences, saveHomePreferences } from "@/lib/client-storage";
import {
  DEFAULT_HOME_PREFERENCES,
  type HomePreferences,
  type HomeSectionId,
} from "@/lib/user-preferences";
import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";

const quickLinks = [
  { href: "/kalendar", label: "Kalendář", icon: "calendar_month" },
  { href: "/kontakty", label: "Kontakty", icon: "call" },
  { href: "/mesto", label: "Město", icon: "location_city" },
  { href: "/zhlasit", label: "Nahlásit závadu", icon: "warning" },
  { href: "/zpravodaj", label: "Zprávy", icon: "newspaper" },
  { href: "/hlasovani", label: "Hlasování", icon: "how_to_vote" },
  { href: "/hledat", label: "Hledat", icon: "search" },
];

type HomePageClientProps = {
  events: PublicEventItem[];
  news: PublicNewsItem[];
  directory: PublicDirectoryItem[];
  polls: PublicPoll[];
};

export function HomePageClient({
  events,
  news,
  directory,
  polls,
}: HomePageClientProps) {
  const [preferences, setPreferences] = useState<HomePreferences>(DEFAULT_HOME_PREFERENCES);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setPreferences(loadHomePreferences());
  }, []);

  useEffect(() => {
    saveHomePreferences(preferences);
  }, [preferences]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysEvents = useMemo(
    () => events.filter((event) => event.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [events, today],
  );
  const upcomingEvents = useMemo(
    () => [...events].filter((event) => event.date >= today).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 4),
    [events, today],
  );
  const urgentNews = useMemo(
    () => [...news].filter((item) => item.urgent).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2),
    [news],
  );
  const latestNews = useMemo(
    () => [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [news],
  );
  const activePolls = useMemo(
    () => polls.filter((poll) => poll.endsAt >= today).slice(0, 2),
    [polls, today],
  );
  const favoriteContacts = useMemo(
    () => directory.filter((item) => preferences.favoriteContactIds.includes(item.id)),
    [directory, preferences.favoriteContactIds],
  );
  const fallbackTodayItems = useMemo(
    () => ({
      news: urgentNews[0] ?? latestNews[0] ?? null,
      nextEvent: upcomingEvents[0] ?? null,
      poll: activePolls[0] ?? null,
    }),
    [activePolls, latestNews, upcomingEvents, urgentNews],
  );

  function updatePreferences(next: Partial<HomePreferences>) {
    setPreferences((current) => ({ ...current, ...next }));
  }

  function toggleSection(section: HomeSectionId) {
    updatePreferences({
      hiddenSections: preferences.hiddenSections.includes(section)
        ? preferences.hiddenSections.filter((item) => item !== section)
        : [...preferences.hiddenSections, section],
    });
  }

  function moveSection(section: HomeSectionId, direction: -1 | 1) {
    const order = [...preferences.sectionOrder];
    const index = order.indexOf(section);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
    updatePreferences({ sectionOrder: order });
  }

  function toggleQuickLink(href: string) {
    updatePreferences({
      pinnedQuickLinks: preferences.pinnedQuickLinks.includes(href)
        ? preferences.pinnedQuickLinks.filter((item) => item !== href)
        : [...preferences.pinnedQuickLinks, href].slice(-4),
    });
  }

  const visibleQuickLinks = quickLinks.filter((item) =>
    preferences.pinnedQuickLinks.includes(item.href),
  );

  const sectionLabels: Record<HomeSectionId, string> = {
    today: "Dnešek ve Vimperku",
    quick: "Moje zkratky",
    favorites: "Oblíbené kontakty",
    events: "Nadcházející akce",
    news: "Zprávy",
    polls: "Aktivní ankety",
    notifications: "Notifikace",
  };

  const renderedSections: Record<HomeSectionId, ReactNode> = {
    today: (
      <section className="px-4 pt-6">
        <SectionHeader title="Dnešek ve Vimperku" subtitle="Denní přehled bez prázdných stavů" />
        <div className="space-y-3">
          {todaysEvents.length > 0 ? (
            todaysEvents.map((event) => (
              <div
                key={`today-${event.id}`}
                className="rounded-[1.8rem] p-5"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                      Dnes · {event.time} · {event.place}
                    </p>
                    <h3 className="mt-2 font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      {event.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadEventCalendarFile(event)}
                    className="rounded-full px-4 py-2 text-sm font-bold"
                    style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                  >
                    Přidat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              className="rounded-[1.8rem] p-5"
              style={{ background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)", boxShadow: "0 16px 34px rgba(67,17,24,0.18)" }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/75">
                Klidnější den ve městě
              </p>
              <h3 className="mt-2 font-headline text-2xl font-extrabold text-white">
                Dnes není v kalendáři žádná hlavní akce.
              </h3>
              <p className="mt-3 text-sm text-white/85">
                Proto místo prázdna ukazujeme to nejdůležitější: novinky, nejbližší program a otevřená městská témata.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <FallbackCard
                  title={fallbackTodayItems.news?.title ?? "Bez nového upozornění"}
                  meta={fallbackTodayItems.news ? `${fallbackTodayItems.news.category} · ${fallbackTodayItems.news.date}` : "Zpravodaj"}
                  href="/zpravodaj"
                />
                <FallbackCard
                  title={fallbackTodayItems.nextEvent?.title ?? "Další akce zatím není"}
                  meta={fallbackTodayItems.nextEvent ? `${fallbackTodayItems.nextEvent.date} · ${fallbackTodayItems.nextEvent.time}` : "Kalendář"}
                  href="/kalendar"
                />
                <FallbackCard
                  title={fallbackTodayItems.poll?.question ?? "Žádná aktivní anketa"}
                  meta={fallbackTodayItems.poll ? `Do ${fallbackTodayItems.poll.endsAt}` : "Hlasování"}
                  href="/hlasovani"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    quick: (
      <section className="px-4 pt-8">
        <SectionHeader title="Moje zkratky" subtitle="Rychlé cesty na věci, které otevíráš nejčastěji" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {visibleQuickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] p-4"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>
                {item.icon}
              </span>
              <p className="mt-3 text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </section>
    ),
    favorites: (
      <section className="px-4 pt-8">
        <SectionHeader title="Oblíbené kontakty" subtitle="Rychlé volání a návrat k často používaným místům" />
        <div className="space-y-3">
          {favoriteContacts.length > 0 ? (
            favoriteContacts.map((contact) => (
              <div
                key={`favorite-${contact.id}`}
                className="rounded-[1.6rem] p-4 flex items-center justify-between gap-3"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
              >
                <div>
                  <p className="font-bold" style={{ color: "var(--on-surface)" }}>{contact.name}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>{contact.phone}</p>
                  <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{contact.address}</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                >
                  Volat
                </a>
              </div>
            ))
          ) : (
            <div className="rounded-[1.6rem] p-4 text-sm" style={{ background: "var(--surface-container-lowest)" }}>
              Zatím nemáš uložené žádné oblíbené kontakty. Přidej si je v adresáři nebo kontaktech.
            </div>
          )}
        </div>
      </section>
    ),
    events: (
      <section className="px-4 pt-8">
        <SectionHeader title="Nadcházející akce" subtitle="S tlačítkem rovnou do kalendáře" actionHref="/kalendar" />
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={`upcoming-${event.id}`}
              className="rounded-[1.8rem] p-5"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {event.date} · {event.time} · {event.place}
                  </p>
                  <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {event.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadEventCalendarFile(event)}
                  className="rounded-full px-4 py-3 text-xs font-bold"
                  style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                >
                  Přidat do kalendáře
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    news: (
      <section className="px-4 pt-8">
        <SectionHeader title="Zprávy" subtitle="Urgentní a nejnovější zprávy na jednom místě" actionHref="/zpravodaj" />
        <div className="grid gap-3 md:grid-cols-3">
          {latestNews.map((item) => (
            <Link
              key={`news-${item.id}`}
              href="/zpravodaj"
              className="rounded-[1.6rem] p-4"
              style={{ background: item.urgent ? "var(--error-container)" : "var(--surface-container-lowest)" }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: item.urgent ? "var(--on-error-container)" : "var(--secondary)" }}>
                {item.category} · {item.date}
              </p>
              <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                {item.title}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    ),
    polls: (
      <section className="px-4 pt-8">
        <SectionHeader title="Aktivní ankety" subtitle="Co město řeší právě teď" actionHref="/hlasovani" />
        <div className="space-y-3">
          {activePolls.map((poll) => (
            <Link
              key={`poll-${poll.id}`}
              href="/hlasovani"
              className="block rounded-[1.6rem] p-4"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                {poll.category} · do {poll.endsAt}
              </p>
              <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                {poll.question}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                {poll.options.slice(0, 2).map((option) => option.text).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    ),
    notifications: (
      <section id="notifikace" className="px-4 pt-8 pb-28">
        <SectionHeader title="Chytré notifikace" subtitle="Vyber si témata, která tě mají zajímat" />
        <div className="rounded-[1.8rem] p-5" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
          <PushNotificationButton
            topics={preferences.notificationTopics}
            onTopicsChange={(topics) => updatePreferences({ notificationTopics: topics })}
          />
        </div>
      </section>
    ),
  };

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[24rem]"
            style={{ boxShadow: "0 18px 40px rgba(50,24,18,0.18)", background: "#45211d" }}
          >
            <Image
              src="/editorial/castle-hero.svg"
              alt="Stylizovaná ilustrace zámku ve Vimperku"
              fill
              priority
              className="object-cover object-[64%_center]"
            />
            <div
              className="relative z-10 flex min-h-[24rem] flex-col justify-end p-5"
              style={{ background: "linear-gradient(to top, rgba(25,16,15,0.78) 0%, rgba(25,16,15,0.10) 58%)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#d7e8df" }}>
                {new Date().toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h1 className="mt-2 font-headline text-[2.4rem] font-extrabold leading-[0.94] text-white">
                Vimperk na jeden pohled.
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/85">
                Přehled dne, rychlé cesty, oblíbené kontakty a městská upozornění bez zbytečného klikání.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/hledat"
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.92)", color: "var(--primary)" }}
                >
                  Hledat napříč appkou
                </Link>
                <button
                  type="button"
                  onClick={() => setSettingsOpen((current) => !current)}
                  className="rounded-full px-4 py-3 text-sm font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  Přizpůsobit domovskou stránku
                </button>
              </div>
            </div>
          </div>
        </section>

        <PwaInstallCard />

        {settingsOpen ? (
          <section className="px-4 pt-6">
            <div className="rounded-[1.8rem] p-5" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                    Personalizace homepage
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Schovej sekce, změň pořadí a vyber si svoje zkratky.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full px-3 py-2 text-xs font-bold"
                  style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                >
                  Zavřít
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {preferences.sectionOrder.map((section, index) => (
                  <div key={section} className="flex items-center justify-between gap-3 rounded-[1.2rem] p-3" style={{ background: "var(--surface-container-low)" }}>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--on-surface)" }}>{sectionLabels[section]}</p>
                      <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                        {preferences.hiddenSections.includes(section) ? "Skryto" : "Zobrazeno"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => moveSection(section, -1)} disabled={index === 0} className="rounded-full px-3 py-2 text-xs font-bold" style={{ background: "var(--surface-container-high)", color: "var(--on-surface)" }}>↑</button>
                      <button type="button" onClick={() => moveSection(section, 1)} disabled={index === preferences.sectionOrder.length - 1} className="rounded-full px-3 py-2 text-xs font-bold" style={{ background: "var(--surface-container-high)", color: "var(--on-surface)" }}>↓</button>
                      <button type="button" onClick={() => toggleSection(section)} className="rounded-full px-3 py-2 text-xs font-bold" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
                        {preferences.hiddenSections.includes(section) ? "Ukázat" : "Skrýt"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold" style={{ color: "var(--on-surface)" }}>Moje zkratky</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickLinks.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => toggleQuickLink(item.href)}
                      className="rounded-full px-4 py-2 text-sm font-semibold"
                      style={preferences.pinnedQuickLinks.includes(item.href)
                        ? { background: "var(--primary)", color: "var(--on-primary)" }
                        : { background: "var(--surface-container-high)", color: "var(--on-surface)" }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {preferences.sectionOrder.map((section) =>
          preferences.hiddenSections.includes(section) ? null : <div key={section}>{renderedSections[section]}</div>,
        )}
      </main>
      <BottomNav />
    </>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actionHref ? (
        <Link href={actionHref} className="text-sm font-bold" style={{ color: "var(--primary)" }}>
          Vše →
        </Link>
      ) : null}
    </div>
  );
}

function FallbackCard({
  title,
  meta,
  href,
}: {
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.2rem] p-4"
      style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.16)" }}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">{meta}</p>
      <h3 className="mt-2 text-sm font-bold text-white">{title}</h3>
    </Link>
  );
}
