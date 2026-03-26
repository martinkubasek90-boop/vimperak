import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import Image from "next/image";
import { events, news } from "@/lib/data";

const quickActions = [
  { icon: "local_taxi",       label: "Taxi",        href: "/adresar?k=taxi",       bg: "var(--secondary-fixed)", color: "var(--on-secondary-fixed)" },
  { icon: "directions_bus",   label: "Autobusy",    href: "/jizdy",                bg: "var(--tertiary-fixed)", color: "var(--on-tertiary-fixed)" },
  { icon: "medical_services", label: "Lékaři",      href: "/adresar?k=lékař",      bg: "var(--primary-fixed)", color: "var(--on-primary-fixed)" },
  { icon: "local_pharmacy",   label: "Lékárny",     href: "/adresar?k=lékárna",    bg: "var(--surface-container)", color: "var(--on-surface)" },
  { icon: "restaurant",       label: "Restaurace",  href: "/adresar?k=restaurace", bg: "var(--secondary-container)", color: "var(--on-secondary-container)" },
  { icon: "campaign",         label: "Závady",      href: "/zhlasit",              bg: "var(--error-container)", color: "var(--on-error-container)" },
];

const eventCatColor: Record<string, { bg: string; text: string }> = {
  kino:    { bg: "var(--primary-fixed)",       text: "var(--on-primary-fixed)" },
  kultura: { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  sport:   { bg: "var(--tertiary-fixed)",      text: "var(--on-tertiary-fixed)" },
  trhy:    { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  úřad:    { bg: "var(--surface-container)",   text: "var(--on-surface-variant)" },
};

const pollOptions = [
  { label: "Moderní prolézačky", pct: 38 },
  { label: "Tradiční houpačky",  pct: 19 },
  { label: "Sportoviště",        pct: 43 },
];

export default function HomePage() {
  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const [featuredNews] = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">

        <section className="px-4 pt-5">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[25rem] md:min-h-[27rem]"
            style={{ boxShadow: "0 18px 40px rgba(50,24,18,0.18)", background: "#45211d" }}
          >
            <Image
              src="/editorial/castle-hero.svg"
              alt="Stylizovaná ilustrace zámku ve Vimperku"
              fill
              priority
              className="object-cover object-[64%_center] md:object-[center_38%]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(34,18,16,0.08) 0%, rgba(34,18,16,0.22) 100%)",
              }}
            />
            <div
              className="absolute left-0 top-0 bottom-0 w-[72%] md:w-[52%]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(37,20,18,0.60) 0%, rgba(37,20,18,0.36) 62%, rgba(37,20,18,0.00) 100%)",
              }}
            />
            <div
              className="absolute left-0 top-0 h-28 w-full"
              style={{ background: "linear-gradient(180deg, rgba(47,91,79,0.14) 0%, transparent 100%)" }}
            />

            <div className="relative z-10 flex min-h-[25rem] flex-col justify-end p-5 md:min-h-[27rem] md:p-6">
              <div className="max-w-[16rem] md:max-w-[20rem] mb-5">
                <p className="text-sm font-semibold mb-3" style={{ color: "#d7e8df" }}>
                  Čtvrtek, 26. března 2026
                </p>
                <h1 className="font-headline font-extrabold text-[2.7rem] leading-[0.94] tracking-tight mb-3 text-white md:text-[3.4rem]">
                  Dobré ráno,
                  <br />
                  <span style={{ color: "#d7e8df" }}>Vimperku!</span>
                </h1>
              </div>

              <div
                className="max-w-[20rem] rounded-[1.75rem] p-4 backdrop-blur-md md:max-w-[23rem]"
                style={{ background: "rgba(58,38,35,0.38)", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 text-white">
                    <span className="material-symbols-outlined text-[1.65rem]" style={{ color: "#d7e8df" }}>wb_sunny</span>
                    <div>
                      <p className="font-headline font-bold text-xl leading-none">8°C</p>
                      <p className="text-xs text-white/70">Slunečno · 12° max</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/18" />
                  <div className="flex items-center gap-2.5 text-white/90">
                    <span className="material-symbols-outlined text-xl" style={{ color: "#d7e8df" }}>warning</span>
                    <p className="text-sm font-medium leading-tight">
                      Uzavírka Pivovarské
                      <br />
                      od 28. 3.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick access ──────────────────────────────── */}
        <section className="px-4 pt-6">
          <h2 className="font-headline font-bold text-lg mb-4" style={{ color: "var(--on-surface)" }}>
            Rychlý přístup
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ icon, label, href, bg, color }) => (
              <Link key={label} href={href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-3xl transition-all active:scale-95 hover:brightness-95 border"
                style={{ backgroundColor: bg, borderColor: "rgba(159,29,47,0.06)" }}>
                <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                <span className="text-xs font-semibold text-center leading-tight" style={{ color }}>{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Kulturní program (místo odjezdů) ──────────── */}
        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline font-bold text-lg" style={{ color: "var(--on-surface)" }}>
                Kulturní program
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
                Co se děje v Vimperku
              </p>
            </div>
            <Link href="/zpravodaj" className="text-sm font-bold" style={{ color: "var(--primary)" }}>
              Vše →
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((event) => {
              const cs = eventCatColor[event.category] ?? { bg: "var(--surface-container)", text: "var(--on-surface-variant)" };
              return (
                <div key={event.id}
                     className="rounded-3xl p-4 flex gap-4 items-center"
                     style={{ background: "var(--surface-container-lowest)", boxShadow: "0 1px 8px rgba(24,28,32,0.06)" }}>
                  <div className="w-14 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                       style={{ background: cs.bg }}>
                    <span className="font-headline font-black text-xl leading-none" style={{ color: cs.text }}>
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs uppercase font-semibold" style={{ color: cs.text, opacity: 0.7 }}>
                      {new Date(event.date).toLocaleDateString("cs-CZ", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5"
                          style={{ color: "var(--secondary)" }}>
                      {event.place} · {event.time}
                    </span>
                    <h4 className="font-headline font-bold text-base leading-tight truncate"
                        style={{ color: "var(--on-surface)" }}>
                      {event.title}
                    </h4>
                    <span className="mt-1.5 inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={event.free
                            ? { background: "var(--secondary-container)", color: "var(--on-secondary-container)" }
                            : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
                      {event.free ? "Vstup zdarma" : event.price}
                    </span>
                  </div>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_add_on</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Featured news s obrázkem ───────────────────── */}
        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-lg" style={{ color: "var(--on-surface)" }}>
              Zprávy z radnice
            </h2>
            <Link href="/zpravodaj" className="text-sm font-bold" style={{ color: "var(--primary)" }}>
              Vše →
            </Link>
          </div>

          {/* Main card s reálným obrázkem */}
          <div className="relative rounded-[2rem] overflow-hidden"
               style={{ boxShadow: "0 4px 24px rgba(24,28,32,0.10)" }}>
            {/* Image container — position relative aby se overlay scoped */}
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={featuredNews.image}
                alt={featuredNews.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0"
                   style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                  Místní zpravodaj
                </span>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="font-headline font-bold text-xl text-white leading-tight">
                  {featuredNews.title}
                </h3>
              </div>
            </div>
            <div className="px-5 py-4" style={{ background: "var(--surface-container-lowest)" }}>
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--on-surface-variant)" }}>
                {featuredNews.summary}
              </p>
              <button className="mt-3 font-bold text-sm flex items-center gap-1 group"
                      style={{ color: "var(--primary)" }}>
                Číst více
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* 2 secondary cards */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="rounded-[1.5rem] p-4" style={{ background: "var(--surface-container-low)" }}>
              <span className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--secondary)" }}>Ekologie</span>
              <p className="font-headline font-bold text-sm leading-snug mt-2" style={{ color: "var(--on-surface)" }}>
                Nové kontejnery na bioodpad v ul. 1. máje
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)" }}>Včera</p>
            </div>
            <div className="rounded-[1.5rem] p-4" style={{ background: "var(--surface-container-low)" }}>
              <span className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--tertiary)" }}>Doprava</span>
              <p className="font-headline font-bold text-sm leading-snug mt-2" style={{ color: "var(--on-surface)" }}>
                Uzavírka mostu přes Volyňku
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)" }}>Před 3 dny</p>
            </div>
          </div>
        </section>

        {/* ── Active poll ───────────────────────────────── */}
        <section className="px-4 pt-8">
          <div className="rounded-[2rem] p-5"
               style={{ background: "var(--surface-container-lowest)", boxShadow: "0 2px 16px rgba(24,28,32,0.06)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>how_to_vote</span>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                Hlasování
              </span>
            </div>
            <p className="font-headline font-bold text-base leading-snug mb-4" style={{ color: "var(--on-surface)" }}>
              Jakou podobu hřiště v parku Blanice preferujete?
            </p>
            <div className="space-y-3 mb-4">
              {pollOptions.map((opt) => (
                <div key={opt.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--on-surface-variant)" }}>{opt.label}</span>
                    <span className="font-bold" style={{ color: "var(--on-surface)" }}>{opt.pct}%</span>
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
                <span className="material-symbols-outlined"
                      style={{ color: "var(--on-secondary-container)", fontVariationSettings: "'FILL' 1" }}>
                  mark_email_unread
                </span>
              </div>
              <h3 className="font-headline font-extrabold text-2xl text-white mb-1">
                Newsletter Vimperk
              </h3>
              <p className="text-sm mb-5" style={{ color: "rgba(189,239,190,0.85)", maxWidth: "220px" }}>
                Nejdůležitější zprávy z města jednou týdně přímo do vašeho mailu.
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}
                  placeholder="Váš e-mail"
                  type="email"
                />
                <button className="px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform whitespace-nowrap"
                        style={{ background: "#fff", color: "var(--secondary)" }}>
                  Přihlásit
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
