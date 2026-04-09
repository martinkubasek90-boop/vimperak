"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import {
  getEventDetailHref,
  getNewsDetailHref,
  getPollDetailHref,
} from "@/lib/content-links";
import { formatRelativeDateLabel, getDateBadgeParts } from "@/lib/date-display";
import type {
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";

const quickLinks = [
  { href: "/kalendar", label: "Kalendář", icon: "calendar_month", tone: "#f2e6df" },
  { href: "/kontakty", label: "Kontakty", icon: "contact_phone", tone: "#dceee9" },
  { href: "/mesto", label: "Město", icon: "location_city", tone: "#f3ddd2" },
  { href: "/zpravodaj", label: "Zprávy", icon: "newspaper", tone: "#f7ddd6" },
  { href: "/sport", label: "Sport", icon: "sports_soccer", tone: "#efe6dc" },
  { href: "/napsat-mestu", label: "Napsat městu", icon: "edit_square", tone: "#f7dad7" },
];

type HomePageClientProps = {
  events: PublicEventItem[];
  news: PublicNewsItem[];
  polls: PublicPoll[];
};

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base: string, offset: number) {
  const date = new Date(`${base}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return formatIsoDate(date);
}

function getCalendarCategoryLabel(category: PublicEventItem["category"]) {
  switch (category) {
    case "kino":
      return "Kino";
    case "sport":
      return "Sport";
    case "kultura":
      return "Kultura";
    case "trhy":
      return "Trhy";
    case "úřad":
      return "Město";
    default:
      return "Akce";
  }
}

export function HomePageClient({
  events,
  news,
  polls,
}: HomePageClientProps) {
  const today = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const showcaseEvents = useMemo<PublicEventItem[]>(
    () => [
      {
        id: 91001,
        title: "Kino: Letní příběh — CZ dabing",
        date: addDays(today, 1),
        time: "17:30",
        place: "Kino Vimperk",
        category: "kino",
        description: "Rodinné promítání pro děti i rodiče v podvečerním čase.",
        free: false,
        price: "140 Kč",
      },
      {
        id: 91002,
        title: "Večerní komentovaná prohlídka zámku",
        date: addDays(today, 2),
        time: "18:00",
        place: "Zámek Vimperk",
        category: "kultura",
        description: "Speciální komentovaná prohlídka s výkladem o historii města.",
        free: false,
        price: "90 Kč",
      },
      {
        id: 91003,
        title: "Turnaj mladších žáků ve florbalu",
        date: addDays(today, 3),
        time: "10:00",
        place: "Sportovní hala Vimperk",
        category: "sport",
        description: "Sobotní dopolední turnaj místních týmů a hostů z okolí.",
        free: true,
      },
      {
        id: 91004,
        title: "Farmářské dopoledne na náměstí",
        date: addDays(today, 4),
        time: "09:00",
        place: "Náměstí Svobody",
        category: "trhy",
        description: "Místní výrobci, pečivo, sýry a sezónní nabídka z regionu.",
        free: true,
      },
      {
        id: 91005,
        title: "Setkání s občany na radnici",
        date: addDays(today, 6),
        time: "17:00",
        place: "Radnice Vimperk",
        category: "úřad",
        description: "Otevřené setkání s vedením města a prostor pro dotazy.",
        free: true,
      },
      {
        id: 91006,
        title: "Workshop: Šumava objektivem",
        date: addDays(today, 8),
        time: "16:30",
        place: "Kulturní dům Vimperk",
        category: "kultura",
        description: "Praktický workshop krajinářské fotografie pro začátečníky.",
        free: false,
        price: "180 Kč",
      },
    ],
    [today],
  );

  const upcomingEvents = useMemo(() => {
    const futureEvents = [...events]
      .filter((event) => event.date >= today)
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

    const seen = new Set(futureEvents.map((event) => `${event.title}-${event.date}-${event.time}`));
    const supplemental = showcaseEvents.filter((event) => !seen.has(`${event.title}-${event.date}-${event.time}`));

    return [...futureEvents, ...supplemental].slice(0, 6);
  }, [events, showcaseEvents, today]);

  const freeEventsCount = upcomingEvents.filter((event) => event.free).length;
  const thisWeekEventsCount = upcomingEvents.filter((event) => {
    const eventDate = new Date(`${event.date}T12:00:00`);
    const todayDate = new Date(`${today}T12:00:00`);
    const diffInDays = Math.round((eventDate.getTime() - todayDate.getTime()) / 86400000);
    return diffInDays >= 0 && diffInDays <= 7;
  }).length;

  const sortedNews = useMemo(
    () => [...news].sort((a, b) => b.date.localeCompare(a.date)),
    [news],
  );

  const featuredNews = sortedNews[0] ?? null;
  const supportingNews = sortedNews.slice(1, 3);
  const activePoll = useMemo(
    () => polls.filter((poll) => poll.endsAt >= today)[0] ?? polls[0] ?? null,
    [polls, today],
  );

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-2">
          <div
            className="relative overflow-hidden rounded-[2rem]"
            style={{ minHeight: "27rem", boxShadow: "0 18px 40px rgba(50,24,18,0.16)", background: "#e7b59d" }}
          >
            <Image
              src="/editorial/castle-hero.svg"
              alt="Stylizovaná ilustrace Vimperka"
              fill
              priority
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(255,244,236,0.02) 0%, rgba(74,40,45,0.03) 42%, rgba(64,38,51,0.22) 100%)" }}
            />

            <div className="relative z-10 flex min-h-[27rem] flex-col justify-end px-6 pb-5 pt-6">
              <p className="text-[0.9rem] font-bold" style={{ color: "rgba(255,255,255,0.82)" }}>
                {capitalizeLabel(todayLabel)}
              </p>
              <h1 className="mt-2 max-w-[11rem] font-headline text-[2.15rem] font-extrabold leading-[0.9] tracking-[-0.04em] text-white sm:max-w-[12rem]">
                Dobrý den,
                <br />
                Vimperáci.
              </h1>

              <div className="mt-4 grid max-w-[15.75rem] grid-cols-2 gap-2.5">
                <div
                  className="rounded-[1rem] px-3 py-2.5"
                  style={{ background: "rgba(84,61,76,0.82)", backdropFilter: "blur(10px)", color: "#ffffff" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[1.05rem] text-white/78">wb_sunny</span>
                    <div>
                      <p className="text-[1.45rem] font-black leading-none">8°C</p>
                      <p className="mt-1 text-[0.6rem] font-medium leading-tight text-white/70">Slunečno · 12°</p>
                      <p className="text-[0.6rem] font-medium leading-tight text-white/70">max</p>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-[1rem] px-3 py-2.5"
                  style={{ background: "rgba(84,61,76,0.82)", backdropFilter: "blur(10px)", color: "#ffffff" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[1.05rem] text-white/78">warning</span>
                    <div>
                      <p className="mt-0.5 text-[0.78rem] font-semibold leading-snug">Uzavírka</p>
                      <p className="text-[0.78rem] font-semibold leading-snug">Pivovarské</p>
                      <p className="text-[0.72rem] font-medium leading-snug text-white/84">od 28. 3.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Rychlý přístup" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[5.5rem] flex-col items-center justify-center rounded-[1.15rem] px-3 py-4 text-center transition-transform active:scale-[0.99]"
                style={{ background: item.tone }}
              >
                <span className="material-symbols-outlined text-[1.35rem]" style={{ color: "var(--secondary)" }}>
                  {item.icon}
                </span>
                <p className="mt-2 text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Kalendář akcí" subtitle="Co se děje ve Vimperku" actionHref="/kalendar" />
          <div className="mb-4 grid grid-cols-3 gap-3">
            <CalendarStatCard label="Nejbližší akce" value={String(upcomingEvents.length)} tone="#f7f1eb" />
            <CalendarStatCard label="Vstup zdarma" value={String(freeEventsCount)} tone="#dceee9" />
            <CalendarStatCard label="Tento týden" value={String(thisWeekEventsCount)} tone="#f3ddd2" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const badge = getDateBadgeParts(event.date);
              const categoryLabel = getCalendarCategoryLabel(event.category);

              return (
                <Link
                  key={`homepage-event-${event.id}`}
                  href={getEventDetailHref(event)}
                  className="rounded-[1.45rem] px-4 py-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 20px rgba(67,17,24,0.06)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[1rem]"
                      style={{ background: event.free ? "#dceee9" : "#f5ddd7", color: "var(--secondary)" }}
                    >
                      <span className="text-[1.5rem] font-black leading-none">{badge.day}</span>
                      <span className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.12em]">
                        {badge.month}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className="inline-flex rounded-full px-2.5 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em]"
                            style={{ background: "#dceee9", color: "var(--secondary)" }}
                          >
                            {categoryLabel}
                          </span>
                        </div>
                        <p className="text-sm font-black tabular-nums" style={{ color: "var(--secondary)" }}>
                          {event.time}
                        </p>
                      </div>

                      <p className="mt-3 text-[0.72rem] font-black uppercase tracking-[0.14em]" style={{ color: "var(--secondary)" }}>
                        {event.place}
                      </p>
                      <h3 className="mt-1 text-[1.42rem] font-extrabold leading-tight" style={{ color: "var(--on-surface)" }}>
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                        {event.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold"
                          style={{
                            background: "#f7f1eb",
                            color: "var(--on-surface)",
                          }}
                        >
                          {event.place}
                        </span>
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold"
                          style={{
                            background: event.free ? "#dceee9" : "#efe6dc",
                            color: "var(--on-surface)",
                          }}
                        >
                          {event.free ? "Vstup zdarma" : event.price ?? "Placená akce"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Zprávy z radnice" actionHref="/zpravodaj" />
          {featuredNews ? (
            <div className="space-y-3">
              <Link
                href={getNewsDetailHref(featuredNews)}
                className="block overflow-hidden rounded-[1.6rem]"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
              >
                <div className="relative h-48">
                  <Image
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(48,28,32,0.3) 48%, rgba(48,28,32,0.88) 100%)" }}
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-[#9f1d2f] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white">
                    {featuredNews.urgent ? "Místní zpravodaj" : featuredNews.category}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-headline text-[1.7rem] font-extrabold leading-tight">
                      {featuredNews.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                    {featuredNews.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: "var(--primary)" }}>
                    Číst více
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                {supportingNews.map((item) => (
                  <Link
                    key={`support-news-${item.id}`}
                    href={getNewsDetailHref(item)}
                    className="rounded-[1.2rem] p-4"
                    style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 20px rgba(67,17,24,0.05)" }}
                  >
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.14em]" style={{ color: "var(--secondary)" }}>
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-sm font-extrabold leading-snug" style={{ color: "var(--on-surface)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                      {formatRelativeDateLabel(item.date)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {activePoll ? (
          <section className="px-4 pt-8">
            <Link
              href={getPollDetailHref(activePoll)}
              className="block rounded-[1.8rem] p-5"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: "var(--secondary)" }}>
                  location_city
                </span>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                  Město
                </p>
              </div>

              <h2 className="mt-3 text-lg font-extrabold leading-tight" style={{ color: "var(--on-surface)" }}>
                {activePoll.question}
              </h2>

              <div className="mt-4 space-y-3">
                {activePoll.options.map((option) => {
                  const percentage = activePoll.totalVotes > 0
                    ? Math.round((option.votes / activePoll.totalVotes) * 100)
                    : 0;

                  return (
                    <div key={`poll-option-${option.id}`}>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                          {option.text}
                        </span>
                        <span className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-container-high)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            background: percentage >= 40 ? "var(--secondary)" : "rgba(159,29,47,0.32)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-5 inline-flex items-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-bold"
                style={{ background: "#dceee9", color: "var(--on-surface)" }}
              >
                <span className="material-symbols-outlined text-base">how_to_vote</span>
                Otevřít sekci Město
              </div>
            </Link>
          </section>
        ) : null}
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
        <h2 className="font-headline text-[1.55rem] font-extrabold leading-none" style={{ color: "var(--on-surface)" }}>
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

function capitalizeLabel(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function CalendarStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[1.3rem] px-4 py-4" style={{ background: tone }}>
      <p className="text-[0.82rem] font-semibold leading-tight" style={{ color: "var(--on-surface-variant)" }}>
        {label}
      </p>
      <p className="mt-4 text-[2rem] font-black leading-none" style={{ color: "var(--primary)" }}>
        {value}
      </p>
    </div>
  );
}
