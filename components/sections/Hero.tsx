import { Search, MapPin, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            Vimperk, Jihočeský kraj
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Vše o Vimperku<br />
            <span className="text-brand-300">na jednom místě</span>
          </h1>
          <p className="text-brand-200 text-lg mb-8 leading-relaxed">
            Akce, jízdní řády, adresář služeb, zpravodaj a přímé hlasování o dění ve vašem městě.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-brand-300 shrink-0" />
              <input
                type="text"
                placeholder="Hledejte restaurace, lékaře, akce..."
                className="flex-1 bg-transparent text-white placeholder-brand-300 outline-none text-sm"
              />
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-3 rounded-lg transition-colors shrink-0">
              Hledat
            </button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            {[
              ["Taxi", "/adresar?kategorie=taxi"],
              ["Lékaři", "/adresar?kategorie=lékař"],
              ["Kino", "/akce?kategorie=kino"],
              ["Autobusy", "/jizdy"],
              ["Hlasování", "/hlasovani"],
              ["Hlásit závadu", "/zhlasit"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {label}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alert bar */}
      <div className="bg-amber-500 text-amber-950">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 text-sm font-medium">
          <Bell className="w-4 h-4 shrink-0" />
          <span className="font-bold">Upozornění:</span>
          <span>Uzavírka ulice Pivovarská od 28. 3. — objízdná trasa přes Steinbrenerovu.</span>
          <Link href="/zpravodaj" className="ml-auto shrink-0 underline hover:no-underline">
            Detail →
          </Link>
        </div>
      </div>
    </section>
  );
}
