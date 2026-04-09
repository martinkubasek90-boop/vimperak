"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lipnoBrand } from "@/lib/lipno-data";

const items = [
  { href: "/lipno", icon: "home", label: "Domů" },
  { href: "/lipno/zazitky", icon: "map", label: "Zážitky" },
  { href: "/lipno/kalendar", icon: "calendar_month", label: "Kalendář" },
  { href: "/lipno/servis", icon: "build_circle", label: "Servis" },
  { href: "/lipno/ai", icon: "smart_toy", label: "AI" },
];

export default function LipnoBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 glass-header rounded-t-3xl"
      style={{
        boxShadow: "0 -8px 28px rgba(12,74,110,0.12)",
        borderTop: "1px solid rgba(12,74,110,0.08)",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center px-3 pb-6 pt-2">
        {items.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all active:scale-90"
              style={active ? {
                background: `linear-gradient(135deg, ${lipnoBrand.primary}, ${lipnoBrand.secondary})`,
                color: "#fff",
              } : { color: lipnoBrand.muted }}
            >
              <span className="material-symbols-outlined mb-0.5" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", fontSize: "22px" }}>
                {icon}
              </span>
              <span className="font-label font-medium" style={{ fontSize: "11px" }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
