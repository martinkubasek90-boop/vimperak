"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import PushNotificationButton from "@/components/PushNotificationButton";
import { downloadEventCalendarFile } from "@/lib/calendar";
import {
  getContactDetailHref,
  getEventDetailHref,
  getNewsDetailHref,
  getPollDetailHref,
} from "@/lib/content-links";
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
  { href: "/zpravodaj", label: "Aktuality", icon: "newspaper" },
  { href: "/hlasovani", label: "Ankety", icon: "how_to_vote" },
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
  const today = new Date().toISOString().slice(0, 10);

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.date >= today)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
        .slice(0, 3),
    [events, today],
  );

  const latestNews = useMemo(
    () => [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
    [news],
  );

  const topContacts = useMemo(() => {
    const cityContacts = directory.filter((item) => item.category === "město");
    return (cityContacts.length > 0 ? cityContacts : directory).slice(0, 4);
  }, [directory]);

  const activePolls = useMemo(
    () => polls.filter((poll) => poll.endsAt >= today).slice(0, 2),
    [polls, today],
  );

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[22rem]"
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
              className="relative z-10 flex min-h-[22rem] flex-col justify-end p-5"
              style={{ background: "linear-gradient(to top, rgba(25,16,15,0.78) 0%, rgba(25,16,15,0.10) 58%)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#d7e8df" }}>
                {new Date().toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h1 className="mt-2 font-headline text-[2.4rem] font-extrabold leading-[0.94] text-white">
                Vimperk přehledně na jednom místě.
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/85">
                Kalendář, aktuality, důležité kontakty a městské informace bez zbytečných kroků navíc.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Top 6 služeb" subtitle="Nejpoužívanější části aplikace na jedno klepnutí" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[1.5rem] p-4 min-h-[7.75rem] flex flex-col justify-between"
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

        <section className="px-4 pt-8">
          <SectionHeader title="Kalendář" subtitle="Nejbližší akce a program ve městě" actionHref="/kalendar" />
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={`upcoming-${event.id}`}
                className="rounded-[1.8rem] p-5"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <Link href={getEventDetailHref(event)} className="block flex-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                      {event.date} · {event.time} · {event.place}
                    </p>
                    <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      {event.description}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => downloadEventCalendarFile(event)}
                    className="rounded-full px-4 py-3 text-xs font-bold"
                    style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
                  >
                    Přidat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Novinky a aktuality" subtitle="Poslední zprávy a oznámení z města" actionHref="/zpravodaj" />
          <div className="grid gap-3 md:grid-cols-3">
            {latestNews.map((item) => (
              <Link
                key={`news-${item.id}`}
                href={getNewsDetailHref(item)}
                className="rounded-[1.6rem] p-4 min-h-[13.5rem] flex flex-col"
                style={{ background: item.urgent ? "var(--error-container)" : "var(--surface-container-lowest)" }}
              >
                <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: item.urgent ? "var(--on-error-container)" : "var(--secondary)" }}>
                  {item.category} · {item.date}
                </p>
                <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm line-clamp-4" style={{ color: "var(--on-surface-variant)" }}>
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Top kontakty" subtitle="Nejdůležitější městské a praktické kontakty" actionHref="/kontakty" />
          <div className="space-y-3">
            {topContacts.map((contact) => (
              <div
                key={`top-contact-${contact.id}`}
                className="rounded-[1.6rem] p-4 flex items-center justify-between gap-3"
                style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
              >
                <Link href={getContactDetailHref(contact)} className="block flex-1">
                  <p className="font-bold" style={{ color: "var(--on-surface)" }}>{contact.name}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)" }}>{contact.phone}</p>
                  <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>{contact.address}</p>
                </Link>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="rounded-full px-4 py-3 text-sm font-bold"
                  style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                >
                  Volat
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <SectionHeader title="Aktivní ankety" subtitle="Co město řeší právě teď" actionHref="/hlasovani" />
          <div className="space-y-3">
            {activePolls.map((poll) => (
              <Link
                key={`poll-${poll.id}`}
                href={getPollDetailHref(poll)}
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

        <section id="notifikace" className="px-4 pt-8 pb-28">
          <SectionHeader title="Notifikace" subtitle="Volitelné upozornění na nové informace z města" />
          <div className="rounded-[1.8rem] p-5" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
            <PushNotificationButton />
          </div>
        </section>
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
