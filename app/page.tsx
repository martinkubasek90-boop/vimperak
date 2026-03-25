import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";

const quickActions = [
  { icon: "local_taxi",       label: "Taxi",        href: "/adresar?k=taxi",       bg: "#baecbb", color: "#002109" },
  { icon: "directions_bus",   label: "Autobusy",    href: "/jizdy",                bg: "#d2e4ff", color: "#001c37" },
  { icon: "medical_services", label: "Lékaři",      href: "/adresar?k=lékař",      bg: "#ffdad7", color: "#410004" },
  { icon: "local_pharmacy",   label: "Lékárny",     href: "/adresar?k=lékárna",    bg: "#e5e8ee", color: "#181c20" },
  { icon: "restaurant",       label: "Restaurace",  href: "/adresar?k=restaurace", bg: "#bdefbe", color: "#002109" },
  { icon: "campaign",         label: "Závady",      href: "/zhlasit",              bg: "#ffdad6", color: "#93000a" },
];

const busPreview = [
  { number: "190", to: "České Budějovice", next: "07:45", via: "přes Prachatice" },
  { number: "191", to: "Prachatice",       next: "08:00", via: "" },
  { number: "195", to: "Kašperské Hory",  next: "09:45", via: "Šumava Express" },
];

const pollOptions = [
  { label: "Moderní prolézačky", pct: 38 },
  { label: "Tradiční houpačky",  pct: 19 },
  { label: "Sportoviště",        pct: 43 },
];

export default function HomePage() {
  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">

        {/* ── Hero gradient ──────────────────────────────── */}
        <section
          className="relative px-5 pt-8 pb-10 overflow-hidden"
          style={{ background: "linear-gradient(145deg, #b2001c 0%, #da1e2d 55%, #e8402e 100%)" }}
        >
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 -mt-16 -mr-16"
               style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 -mb-10 -ml-10"
               style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1 font-label">Středa, 25. března 2026</p>
            <h1 className="font-headline font-extrabold text-4xl text-white leading-none tracking-tight mb-1">
              Dobré ráno,
            </h1>
            <h2 className="font-headline font-extrabold text-4xl leading-tight tracking-tight mb-6"
                style={{ color: "rgba(255,218,215,0.9)" }}>
              Vimperku! ☀️
            </h2>

            {/* Weather strip */}
            <div className="flex items-center gap-4 bg-white/15 backdrop-blur rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-2xl">wb_sunny</span>
                <div>
                  <p className="font-headline font-bold text-lg leading-none">8°C</p>
                  <p className="text-white/70 text-xs">Slunečno · 12° max</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20 mx-1" />
              <div className="flex items-center gap-2 text-white/80">
                <span className="material-symbols-outlined text-sm">warning</span>
                <p className="text-xs font-medium leading-tight">Uzavírka Pivovarské<br/>od 28. 3.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick access ──────────────────────────────── */}
        <section className="px-4 -mt-1 pt-6">
          <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Rychlý přístup</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ icon, label, href, bg, color }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-3xl transition-all active:scale-95 hover:brightness-95"
                style={{ backgroundColor: bg }}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                <span className="text-xs font-semibold text-center leading-tight" style={{ color }}>{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Bus departures ────────────────────────────── */}
        <section className="px-4 pt-8">
          <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm"
               style={{ boxShadow: "0 2px 16px rgba(24,28,32,0.06)" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary-fixed text-lg">directions_bus</span>
                </div>
                <h2 className="font-headline font-bold text-base text-on-surface">Odjezdy z Vimperka</h2>
              </div>
              <Link href="/jizdy" className="text-primary text-sm font-bold">Vše →</Link>
            </div>
            <div className="px-4 pb-4 space-y-2">
              {busPreview.map((b) => (
                <div key={b.number}
                     className="flex items-center gap-3 bg-surface-container-low rounded-2xl px-4 py-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-headline font-black text-sm text-on-tertiary shrink-0"
                       style={{ background: "var(--tertiary)" }}>
                    {b.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-on-surface">→ {b.to}</p>
                    {b.via && <p className="text-xs text-on-surface-variant">{b.via}</p>}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm text-tertiary">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    {b.next}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured news ─────────────────────────────── */}
        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-lg text-on-surface">Zprávy z radnice</h2>
            <Link href="/zpravodaj" className="text-primary text-sm font-bold">Vše →</Link>
          </div>

          {/* Main card with gradient overlay */}
          <div className="relative rounded-[2rem] overflow-hidden"
               style={{ boxShadow: "0 4px 24px rgba(24,28,32,0.10)" }}>
            <div className="h-52 w-full"
                 style={{ background: "linear-gradient(135deg, #3c6842 0%, #095999 100%)" }}>
              <div className="absolute inset-0 flex items-end p-6"
                   style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-2 inline-block"
                        style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                    Místní zpravodaj
                  </span>
                  <h3 className="font-headline font-bold text-xl text-white leading-tight mt-2">
                    Nová hřiště v parku Blanice — hlasujte!
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest px-5 py-4">
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                Radnice spustila hlasování o podobě nových dětských hřišť v parku Blanice.
                Hlasování trvá do 10. dubna.
              </p>
              <button className="mt-3 text-primary font-bold text-sm flex items-center gap-1 group">
                Číst více
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* 2 secondary cards */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-surface-container-low rounded-[1.5rem] p-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">Ekologie</span>
              <p className="font-headline font-bold text-sm leading-snug mt-2 text-on-surface">
                Nové kontejnery na bioodpad v ul. 1. máje
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Včera</p>
            </div>
            <div className="bg-surface-container-low rounded-[1.5rem] p-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-tertiary">Doprava</span>
              <p className="font-headline font-bold text-sm leading-snug mt-2 text-on-surface">
                Uzavírka mostu přes Volyňku
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Před 3 dny</p>
            </div>
          </div>
        </section>

        {/* ── Active poll ───────────────────────────────── */}
        <section className="px-4 pt-8">
          <div className="bg-surface-container-lowest rounded-[2rem] p-5"
               style={{ boxShadow: "0 2px 16px rgba(24,28,32,0.06)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary">how_to_vote</span>
              <span className="text-[10px] font-black tracking-widest uppercase text-secondary">Hlasování</span>
            </div>
            <p className="font-headline font-bold text-base text-on-surface mb-4 leading-snug">
              Jakou podobu hřiště v parku Blanice preferujete?
            </p>
            <div className="space-y-3 mb-4">
              {pollOptions.map((opt) => (
                <div key={opt.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant">{opt.label}</span>
                    <span className="font-bold text-on-surface">{opt.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-container-high)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width: `${opt.pct}%`, background: opt.pct === 43 ? "var(--secondary)" : "var(--outline-variant)" }} />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/hlasovani"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                  style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
              <span className="material-symbols-outlined text-sm">how_to_vote</span>
              Hlasovat nyní
            </Link>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────── */}
        <section className="px-4 pt-6 pb-4">
          <div className="relative rounded-[2.5rem] p-7 overflow-hidden"
               style={{ background: "linear-gradient(135deg, #3c6842 0%, #2d5235 100%)" }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
                 style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full opacity-10"
                 style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                   style={{ background: "var(--secondary-container)" }}>
                <span className="material-symbols-outlined text-on-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              </div>
              <h3 className="font-headline font-extrabold text-2xl text-white mb-1">Vimperk do kapsy</h3>
              <p className="text-sm mb-5 max-w-[200px]" style={{ color: "rgba(189,239,190,0.8)" }}>
                Nejdůležitější upozornění každé ráno.
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", "--tw-ring-color": "var(--secondary-fixed)" } as React.CSSProperties}
                  placeholder="Váš e-mail"
                  type="email"
                />
                <button className="px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform whitespace-nowrap"
                        style={{ background: "#fff", color: "var(--secondary)" }}>
                  Odebírat
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <BottomNav />
    </>
  );
}
