"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/",          icon: "home",         label: "Domů" },
  { href: "/zpravodaj", icon: "newspaper",     label: "Zprávy" },
  { href: "/adresar",   icon: "local_library", label: "Služby" },
  { href: "/zhlasit",   icon: "campaign",      label: "Podněty" },
  { href: "/ai",        icon: "smart_toy",     label: "AI" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 glass-header rounded-t-3xl"
      style={{ boxShadow: "0 -8px 28px rgba(67,17,24,0.10)", borderTop: "1px solid rgba(159,29,47,0.08)" }}
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center px-3 pb-6 pt-2">
        {items.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all active:scale-90"
              style={active ? {
                background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                color: "var(--on-primary)"
              } : {
                color: "var(--on-surface-variant)"
              }}
            >
              <span
                className="material-symbols-outlined mb-0.5"
                style={{
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  fontSize: "22px"
                }}
              >
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
