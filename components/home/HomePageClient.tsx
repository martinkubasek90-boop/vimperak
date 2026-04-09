"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { downloadEventCalendarFile } from "@/lib/calendar";
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

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.date >= today)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
        .slice(0, 4),
    [events, today],
  );

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

  const heroHighlight = featuredNews?.title ?? "Přehled důležitých informací a služeb města";

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-2">
          <div
            className="relative overflow-hidden rounded-[2rem]"
            style={{ minHeight: "29rem", boxShadow: "0 18px 40px rgba(50,24,18,0.16)", background: "#e7b59d" }}
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
              style={{ background: "linear-gradient(180deg, rgba(255,244,236,0.08) 0%, rgba(74,40,45,0.08) 46%, rgba(64,38,51,0.38) 100%)" }}
            />

            <div className="relative z-10 flex min-h-[29rem] flex-col justify-end p-6">
              <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.88)" }}>
                {capitalizeLabel(todayLabel)}
              </p>
              <h1 className="mt-3 max-w-[18rem] font-headline text-[3.35rem] font-extrabold leading-[0.9] text-white sm:max-w-[22rem]">
                Dobrý den,
                <br />
                Vimperáci.
              </h1>
              <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/84 sm:max-w-[22rem]">
                Kalendář akcí, zprávy z radnice a důležité městské služby na jednom místě.
              </p>

              <div className="mt-5 flex max-w-md flex-wrap gap-3">
                <div
                  className="min-w-[9.5rem] rounded-[1.4rem] px-4 py-3"
                  style={{ background: "rgba(77,57,71,0.72)", backdropFilter: "blur(10px)", color: "#ffffff" }}
                >
                  <p className="text-2xl font-black leading-none">Město online</p>
                  <p className="mt-1 text-xs text-white/74">kalendář, kontakty a důležité služby</p>
                </div>
                <div
                  className="flex-1 rounded-[1.4rem] px-4 py-3"
                  style={{ background: "rgba(77,57,71,0.72)", backdropFilter: "blur(10px)", color: "#ffffff" }}
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/72">Upozornění</p>
                  <p className="mt-1 text-sm font-semibold leading-snug">{heroHighlight}</p>
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
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const badge = getDateBadgeParts(event.date);

              return (
                <div
                  key={`homepage-event-${event.id}`}
                  className="rounded-[1.45rem] px-4 py-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 20px rgba(67,17,24,0.06)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[1rem]"
                      style={{ background: event.free ? "#dceee9" : "#f5ddd7", color: "var(--secondary)" }}
                    >
                      <span className="text-[1.5rem] font-black leading-none">{badge.day}</span>
                      <span className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.12em]">
                        {badge.month}
                      </span>
                    </div>

                    <Link href={getEventDetailHref(event)} className="min-w-0 flex-1">
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.15em]" style={{ color: "var(--secondary)" }}>
                        {event.place} · {event.time}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold leading-tight" style={{ color: "var(--on-surface)" }}>
                        {event.title}
                      </h3>
                      <div className="mt-2">
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
                    </Link>

                    <button
                      type="button"
                      onClick={() => downloadEventCalendarFile(event)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "var(--surface-container-low)", color: "var(--secondary)" }}
                    >
                      <span className="material-symbols-outlined text-base">event_available</span>
                    </button>
                  </div>
                </div>
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
