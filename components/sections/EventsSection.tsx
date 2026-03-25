import Link from "next/link";
import { events } from "@/lib/data";
import { Calendar, Clock, MapPin, Ticket, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColor = {
  kultura: "bg-purple-100 text-purple-700",
  sport:   "bg-blue-100 text-blue-700",
  kino:    "bg-pink-100 text-pink-700",
  úřad:    "bg-gray-100 text-gray-700",
  trhy:    "bg-amber-100 text-amber-700",
} as const;

export default function EventsSection() {
  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nadcházející akce</h2>
          <Link href="/akce" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Všechny akce <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((event) => (
            <article key={event.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", categoryColor[event.category])}>
                  {event.category}
                </span>
                {event.free ? (
                  <span className="text-xs text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">Zdarma</span>
                ) : (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    {event.price}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
              </div>

              <div className="flex flex-col gap-1 text-xs text-gray-500 mt-auto">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {event.place}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "long" });
}
