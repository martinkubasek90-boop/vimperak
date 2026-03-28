"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, Ticket, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicEventItem } from "@/lib/public-content";

type Category = PublicEventItem["category"] | "vše";

const categories: { value: Category; label: string }[] = [
  { value: "vše", label: "Vše" },
  { value: "kino", label: "Kino" },
  { value: "kultura", label: "Kultura" },
  { value: "sport", label: "Sport" },
  { value: "trhy", label: "Trhy & Jarmarky" },
  { value: "úřad", label: "Úřad" },
];

const categoryColor: Record<PublicEventItem["category"], string> = {
  kultura: "bg-purple-100 text-purple-700",
  sport: "bg-blue-100 text-blue-700",
  kino: "bg-pink-100 text-pink-700",
  úřad: "bg-gray-100 text-gray-700",
  trhy: "bg-amber-100 text-amber-700",
};

export function AkcePageClient({ events }: { events: PublicEventItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("vše");

  const filtered = events
    .filter((event) => activeCategory === "vše" || event.category === activeCategory)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8" style={{ color: "var(--on-surface)" }}>
        <section className="mb-8">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: "var(--primary)" }}>
                    Kulturní program
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Akce ve Vimperku
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  Kino, kultura, sport, trhy i městská setkání v jednom přehledu. Filtr i seznam zůstávají rychlé a čitelné.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Kino", bg: "var(--primary-fixed)" },
                  { label: "Sport", bg: "var(--tertiary-fixed)" },
                  { label: "Kultura", bg: "var(--secondary-fixed)" },
                  { label: "Trhy", bg: "var(--surface-container)" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.35rem] p-4" style={{ background: item.bg }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--on-surface)" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4" style={{ color: "var(--outline)" }} />
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className="text-sm px-3 py-1.5 rounded-full border transition-colors"
              style={activeCategory === value
                ? {
                    background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                    color: "var(--on-primary)",
                    borderColor: "transparent",
                    boxShadow: "0 10px 20px rgba(67,17,24,0.14)",
                  }
                : {
                    background: "var(--surface-container-lowest)",
                    color: "var(--on-surface-variant)",
                    borderColor: "rgba(159,29,47,0.10)",
                  }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((event) => (
            <article
              key={event.id}
              className="rounded-[1.6rem] p-4 md:p-5 flex flex-col md:flex-row gap-4 transition-shadow"
              style={{ background: "var(--surface-container-lowest)", border: "1px solid rgba(159,29,47,0.06)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
            >
              <div
                className="flex md:flex-col items-center md:items-center justify-start md:justify-center rounded-[1.1rem] px-4 py-2 md:py-3 md:w-16 shrink-0 gap-3 md:gap-0"
                style={{ background: "var(--primary-fixed)", border: "1px solid rgba(159,29,47,0.10)" }}
              >
                <div className="text-2xl font-black leading-none" style={{ color: "var(--primary)" }}>
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-xs uppercase tracking-wide md:text-center" style={{ color: "var(--on-primary-fixed)" }}>
                  {new Date(event.date).toLocaleDateString("cs-CZ", { month: "short" })}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>{event.title}</h3>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full shrink-0 capitalize", categoryColor[event.category])}>
                    {event.category}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: "var(--on-surface-variant)" }}>{event.description}</p>
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                    {event.place}
                  </span>
                  {event.free ? (
                    <span className="font-semibold" style={{ color: "var(--primary)" }}>Vstup zdarma</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                      {event.price}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
