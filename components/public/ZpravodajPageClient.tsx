"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import Image from "next/image";
import { getEventDetailHref, getNewsDetailHref } from "@/lib/content-links";
import { formatRelativeDateLabel, getDateBadgeParts } from "@/lib/date-display";
import type { PublicEventItem, PublicNewsItem } from "@/lib/public-content";

const catColor: Record<string, string> = {
  upozornění: "var(--error)",
  sport: "var(--tertiary)",
  radnice: "var(--primary)",
  kultura: "var(--secondary)",
  komunita: "var(--on-surface-variant)",
};

const eventCatColor: Record<string, { bg: string; text: string }> = {
  kino: { bg: "var(--primary-fixed)", text: "var(--on-primary-fixed)" },
  kultura: { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  sport: { bg: "var(--tertiary-fixed)", text: "var(--on-tertiary-fixed)" },
  trhy: { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  úřad: { bg: "var(--surface-container)", text: "var(--on-surface-variant)" },
};

export function ZpravodajPageClient({
  news,
  events,
}: {
  news: PublicNewsItem[];
  events: PublicEventItem[];
}) {
  const [tab, setTab] = useState<"zpravy" | "akce">("zpravy");
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="relative overflow-hidden rounded-[2rem] min-h-[15.5rem] md:min-h-[17rem]" style={{ boxShadow: "0 18px 40px rgba(50,24,18,0.18)", background: "#3e2421" }}>
            <Image src="/editorial/news-hero.svg" alt="Stylizovaná ilustrace městské budovy" fill className="object-cover object-[56%_18%] md:object-[54%_16%]" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(34,18,16,0.04) 0%, rgba(34,18,16,0.10) 100%)" }} />
            <div className="absolute left-0 top-0 bottom-0 w-[60%] md:w-[36%]" style={{ background: "linear-gradient(90deg, rgba(44,24,22,0.44) 0%, rgba(44,24,22,0.14) 64%, rgba(44,24,22,0.00) 100%)" }} />
            <div className="relative z-10 flex min-h-[15.5rem] flex-col justify-end p-5 pt-12 md:min-h-[17rem] md:p-6 md:pt-16">
              <span className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase" style={{ background: "rgba(215,232,223,0.16)", color: "#d7e8df", border: "1px solid rgba(215,232,223,0.18)" }}>
                Městský zpravodaj
              </span>
              <h1 className="max-w-[16rem] font-headline font-extrabold text-[2.2rem] leading-tight tracking-tight text-white md:max-w-[22rem] md:text-[2.7rem]">
                Zprávy a události
                <br />
                z města
              </h1>
            </div>
          </div>
        </section>

        <div className="px-5 pt-7 pb-5">
          <div className="p-1.5 rounded-2xl flex gap-1" style={{ background: "rgba(237,225,214,0.92)", border: "1px solid rgba(159,29,47,0.08)" }}>
            {[{ id: "zpravy", label: "Zprávy z radnice" }, { id: "akce", label: "Kulturní program" }].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as "zpravy" | "akce")}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                style={tab === item.id
                  ? { background: "linear-gradient(135deg, var(--secondary), #3b6a5c)", color: "var(--on-secondary)", boxShadow: "0 8px 18px rgba(67,17,24,0.08)" }
                  : { color: "var(--on-surface-variant)" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "zpravy" && featured ? (
          <div className="px-4 space-y-4 pb-4">
            <div className="rounded-[2rem] overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(24,28,32,0.08)" }}>
              <div className="relative h-56 overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
                {featured.urgent ? (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                    Důležité upozornění
                  </div>
                ) : null}
                  <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white/70 text-xs font-medium mb-1">{formatRelativeDateLabel(featured.date)}</p>
                  <h2 className="font-headline font-bold text-xl text-white leading-tight">{featured.title}</h2>
                </div>
              </div>
              <div className="p-5" style={{ background: "var(--surface-container-lowest)" }}>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-3">{featured.summary}</p>
                <Link href={getNewsDetailHref(featured)} className="flex items-center gap-1.5 text-primary font-bold text-sm group">
                  Otevřít detail
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map((item) => (
                <Link key={item.id} href={getNewsDetailHref(item)} className="rounded-[1.5rem] overflow-hidden flex flex-col justify-between transition-colors" style={{ background: "var(--surface-container-low)" }}>
                  <div className="relative h-40">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(24,28,32,0.52) 0%, transparent 65%)" }} />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-3">
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#fff", background: catColor[item.category] ?? "var(--on-surface-variant)", padding: "6px 10px", borderRadius: "999px" }}>
                        {item.category}
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.86)" }}>{formatRelativeDateLabel(item.date)}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-headline font-bold text-base leading-snug text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant line-clamp-3">{item.summary}</p>
                  </div>
                  <div className="flex items-center gap-1 px-5 pb-5 text-sm font-semibold text-primary">
                    Otevřít detail
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>info</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "zpravy" && !featured ? (
          <div className="px-4 pb-4">
            <div className="rounded-[2rem] px-6 py-12 text-center" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
              <span className="material-symbols-outlined mb-3 block text-5xl" style={{ color: "var(--outline)" }}>newspaper</span>
              <p className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>Zprávy se teď nepodařilo načíst</p>
              <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>Zkus to prosím za chvíli znovu.</p>
            </div>
          </div>
        ) : null}

        {tab === "akce" ? (
          <div className="px-4 pb-4">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="font-headline font-bold text-[1.45rem] text-on-surface">Nadcházející události</h2>
                <p className="mt-0.5 text-[15px] text-on-surface-variant">Co se děje v našem městě</p>
              </div>
              <Link href="/akce" className="text-primary font-bold text-sm">Otevřít</Link>
            </div>

            <div className="space-y-3">
              {upcoming.map((event) => {
                const style = eventCatColor[event.category] ?? { bg: "var(--surface-container)", text: "var(--on-surface-variant)" };
                const badgeDate = getDateBadgeParts(event.date);
                return (
                  <Link key={event.id} href={getEventDetailHref(event)} className="rounded-3xl p-4 flex gap-4 items-center" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 1px 8px rgba(24,28,32,0.06)" }}>
                    <div className="w-14 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0" style={{ background: style.bg }}>
                      <span className="font-headline font-black text-xl leading-none" style={{ color: style.text }}>
                        {badgeDate.day}
                      </span>
                      <span className="text-xs uppercase font-semibold" style={{ color: style.text, opacity: 0.7 }}>
                        {badgeDate.month}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style={{ color: style.text === "var(--on-primary-fixed)" ? "var(--primary)" : "var(--secondary)" }}>
                        {event.place} · {event.time}
                      </span>
                      <h4 className="font-headline font-bold text-[1.05rem] text-on-surface leading-tight truncate">{event.title}</h4>
                      <div className="mt-1.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={event.free
                          ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                          : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
                          {event.free ? "Vstup zdarma" : event.price}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-full px-3 py-2 text-sm font-semibold shrink-0 transition-colors" style={{ background: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}>
                      Otevřít
                    </div>
                  </Link>
                );
              })}
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-[2rem] px-6 py-12 text-center" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
                <span className="material-symbols-outlined mb-3 block text-5xl" style={{ color: "var(--outline)" }}>event_busy</span>
                <p className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>Žádné nadcházející akce</p>
                <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>Jakmile přibudou nové termíny, zobrazí se tady.</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="px-4 pt-4 pb-2">
          <div className="relative rounded-[2.5rem] p-7 overflow-hidden" style={{ background: "linear-gradient(135deg, #3c6842 0%, #2d5235 100%)" }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--secondary-container)" }}>
                <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              </div>
              <h3 className="font-headline font-extrabold text-2xl text-white mb-1">Newsletter Vimperk</h3>
              <p className="text-sm mb-5" style={{ color: "rgba(189,239,190,0.85)", maxWidth: "220px" }}>
                Nejdůležitější zprávy z města jednou týdně přímo do vašeho mailu.
              </p>
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none" style={{ background: "rgba(255,255,255,0.15)", border: "none" }} placeholder="Váš e-mail" type="email" />
                <button className="px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#fff", color: "var(--secondary)" }}>
                  Přihlásit
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
