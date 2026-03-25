"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Domů" },
  { href: "/zpravodaj", label: "Zpravodaj" },
  { href: "/akce", label: "Akce" },
  { href: "/jizdy", label: "Jízdní řády" },
  { href: "/adresar", label: "Adresář" },
  { href: "/hlasovani", label: "Hlasování" },
  { href: "/zhlasit", label: "Hlásit závadu" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
          <MapPin className="w-5 h-5 text-brand-600" />
          <span>Vimperk</span>
          <span className="text-xs font-normal text-gray-400 hidden sm:inline">Tvoje město online</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1.5 text-sm bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors">
            <Bell className="w-4 h-4" />
            Notifikace
          </button>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 px-3 text-sm text-gray-700 hover:bg-brand-50 rounded-md"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
