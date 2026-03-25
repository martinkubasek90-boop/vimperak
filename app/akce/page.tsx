"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { events, type Event } from "@/lib/data";
import { Calendar, Clock, MapPin, Ticket, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = Event["category"] | "vše";

const categories: { value: Category; label: string }[] = [
  { value: "vše",     label: "Vše" },
  { value: "kino",    label: "Kino" },
  { value: "kultura", label: "Kultura" },
  { value: "sport",   label: "Sport" },
  { value: "trhy",    label: "Trhy & Jarmarky" },
  { value: "úřad",    label: "Úřad" },
];

const categoryColor: Record<Event["category"], string> = {
  kultura: "bg-purple-100 text-purple-700",
  sport:   "bg-blue-100 text-blue-700",
  kino:    "bg-pink-100 text-pink-700",
  úřad:    "bg-gray-100 text-gray-700",
  trhy:    "bg-amber-100 text-amber-700",
};

export default function AkcePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("vše");

  const filtered = events
    .filter((e) => activeCategory === "vše" || e.category === activeCategory)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Akce ve Vimperku</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Kulturní akce, kino, sport, trhy a veřejná zasedání.</p>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-gray-400" />
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-full border transition-colors",
                activeCategory === value
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="flex flex-col gap-3">
          {filtered.map((event) => (
            <article key={event.id} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 hover:shadow-sm transition-shadow">
              {/* Date block */}
              <div className="flex md:flex-col items-center md:items-center justify-start md:justify-center bg-brand-50 border border-brand-100 rounded-lg px-4 py-2 md:py-3 md:w-16 shrink-0 gap-3 md:gap-0">
                <div className="text-2xl font-black text-brand-700 leading-none">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-xs text-brand-500 uppercase tracking-wide md:text-center">
                  {new Date(event.date).toLocaleDateString("cs-CZ", { month: "short" })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full shrink-0 capitalize", categoryColor[event.category])}>
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {event.place}
                  </span>
                  {event.free ? (
                    <span className="text-brand-600 font-semibold">Vstup zdarma</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-brand-400" />
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
