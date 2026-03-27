import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-3">
            <MapPin className="w-5 h-5" />
            Vimperk
          </div>
          <p className="text-sm text-brand-300 leading-relaxed">
            Komunitní portál pro obyvatele Vimperka a okolí. Informace, akce, adresář a přímé spojení s radnicí.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Sekce</h3>
          <ul className="space-y-2 text-sm text-brand-300">
            {[
              ["Zpravodaj", "/zpravodaj"],
              ["Akce ve městě", "/akce"],
              ["Jízdní řády", "/jizdy"],
              ["Adresář služeb", "/adresar"],
              ["Hlasování", "/hlasovani"],
              ["Jak nainstalovat", "/instalace"],
              ["Ochrana soukromi", "/ochrana-soukromi"],
              ["Podminky pouziti", "/podminky"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Kontakt</h3>
          <ul className="space-y-2 text-sm text-brand-300">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              Náměstí Svobody 8, 385 01 Vimperk
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              388 402 111
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              podatelna@vimperk.cz
            </li>
          </ul>
          <div className="mt-4 text-xs text-brand-500">
            Tísňová linka: <span className="text-white font-bold text-base">112</span>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-xs text-brand-500">
        © 2026 Město Vimperk — Portál pro občany
      </div>
    </footer>
  );
}
