import Link from "next/link";
import { news } from "@/lib/data";
import { AlertTriangle, Trophy, Building2, Leaf, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryConfig = {
  upozornění: { label: "Upozornění", icon: AlertTriangle, color: "bg-red-100 text-red-700 border-red-200" },
  sport:      { label: "Sport",       icon: Trophy,       color: "bg-blue-100 text-blue-700 border-blue-200" },
  radnice:    { label: "Radnice",     icon: Building2,    color: "bg-brand-100 text-brand-700 border-brand-200" },
  kultura:    { label: "Kultura",     icon: Leaf,         color: "bg-purple-100 text-purple-700 border-purple-200" },
  komunita:   { label: "Komunita",    icon: Users,        color: "bg-orange-100 text-orange-700 border-orange-200" },
} as const;

export default function NewsSection() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const urgent = sorted.filter((n) => n.urgent);
  const regular = sorted.filter((n) => !n.urgent);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Zpravodaj</h2>
        <Link href="/zpravodaj" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
          Všechny zprávy <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Urgent items first */}
        {urgent.map((item) => {
          const cfg = categoryConfig[item.category];
          const Icon = cfg.icon;
          return (
            <article
              key={item.id}
              className="border-2 border-red-200 bg-red-50 rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", cfg.color)}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{formatDate(item.date)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{item.summary}</p>
            </article>
          );
        })}

        {/* Regular news */}
        {regular.slice(0, 4).map((item) => {
          const cfg = categoryConfig[item.category];
          const Icon = cfg.icon;
          return (
            <article key={item.id} className="border border-gray-200 bg-white rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", cfg.color)}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{formatDate(item.date)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{item.summary}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long" });
}
