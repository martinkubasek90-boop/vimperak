import Link from "next/link";
import {
  Car, Utensils, Stethoscope, Pill, Bus,
  Vote, Wrench, Flame, Phone, ShoppingCart
} from "lucide-react";

const tiles = [
  { label: "Taxi",         icon: Car,          href: "/adresar?k=taxi",         color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { label: "Restaurace",   icon: Utensils,      href: "/adresar?k=restaurace",   color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Lékaři",       icon: Stethoscope,   href: "/adresar?k=lékař",        color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Lékárny",      icon: Pill,          href: "/adresar?k=lékárna",      color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Autobusy",     icon: Bus,           href: "/jizdy",                  color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Hlasování",    icon: Vote,          href: "/hlasovani",              color: "bg-brand-50 text-brand-700 border-brand-200" },
  { label: "Hlásit závadu",icon: Wrench,        href: "/zhlasit",                color: "bg-gray-50 text-gray-700 border-gray-200" },
  { label: "Supermarkety", icon: ShoppingCart,  href: "/letaky",                 color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Pohotovost",   icon: Phone,         href: "/kontakty#pohotovost",    color: "bg-pink-50 text-pink-700 border-pink-200" },
  { label: "Hasiči / IZS", icon: Flame,         href: "/kontakty#izs",           color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function QuickAccess() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Rychlý přístup</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {tiles.map(({ label, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center hover:shadow-sm transition-all hover:-translate-y-0.5 ${color}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
