import Link from "next/link";
import LipnoTopBar from "@/components/lipno/LipnoTopBar";
import LipnoBottomNav from "@/components/lipno/LipnoBottomNav";
import {
  lipnoBrand,
  lipnoConditions,
  lipnoEvents,
  lipnoExperiences,
  lipnoInfoCenter,
  lipnoQuickActions,
  lipnoServiceLinks,
} from "@/lib/lipno-data";

export default function LipnoHomePage() {
  const featuredExperiences = lipnoExperiences.slice(0, 3);
  const featuredServices = lipnoServiceLinks.slice(0, 4);
  const [featuredEvent] = lipnoEvents;

  return (
    <>
      <LipnoTopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto" style={{ background: lipnoBrand.sand }}>
        <section className="px-4 pt-5">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[25rem] p-5 md:p-6"
            style={{
              background: "linear-gradient(160deg, #0f3b57 0%, #0f766e 45%, #38bdf8 100%)",
              boxShadow: "0 18px 40px rgba(12,74,110,0.18)",
            }}
          >
            <div className="absolute right-[-2rem] top-[-2rem] h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute left-[-3rem] bottom-[-4rem] h-52 w-52 rounded-full bg-emerald-200/15 blur-3xl" />
            <div className="relative z-10 flex min-h-[22rem] flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-white/80">Čtvrtek, 26. března 2026</p>
                <h1 className="mt-3 font-headline text-[2.9rem] font-extrabold leading-[0.92] tracking-tight text-white md:text-[3.4rem]">
                  Dnes na
                  <br />
                  Lipně
                </h1>
                <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/78">
                  Vstupenky, lanovky, rodinné zážitky a servis v jednom kompaktním mobilním rozhraní.
                </p>
              </div>

              <div
                className="rounded-[1.7rem] px-4 py-3 backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                <div className="grid grid-cols-2 gap-3 text-white sm:grid-cols-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/66">Počasí</p>
                    <p className="mt-1 font-headline text-xl font-black">{lipnoConditions.weather}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/66">Sníh</p>
                    <p className="mt-1 font-headline text-xl font-black">{lipnoConditions.snow}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/66">Lanovky</p>
                    <p className="mt-1 font-headline text-xl font-black">{lipnoConditions.lifts}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/66">Provoz</p>
                    <p className="mt-1 text-sm font-semibold">{lipnoConditions.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="font-headline text-lg font-bold" style={{ color: lipnoBrand.ink }}>Rychlý přístup</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {lipnoQuickActions.map((item) => {
              const external = item.href.startsWith("http");
              const content = (
                <>
                  <span className="material-symbols-outlined text-2xl" style={{ color: lipnoBrand.primary }}>{item.icon}</span>
                  <span className="text-xs font-semibold text-center leading-tight" style={{ color: lipnoBrand.ink }}>{item.title}</span>
                </>
              );
              return external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2.5 rounded-3xl border p-4 transition-all active:scale-95"
                  style={{ background: "#fff", borderColor: "rgba(12,74,110,0.08)" }}
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center gap-2.5 rounded-3xl border p-4 transition-all active:scale-95"
                  style={{ background: "#fff", borderColor: "rgba(12,74,110,0.08)" }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-lg font-bold" style={{ color: lipnoBrand.ink }}>Top zážitky</h2>
              <p className="text-xs mt-0.5" style={{ color: lipnoBrand.muted }}>Rodiny, sport i pobyt u jezera</p>
            </div>
            <Link href="/lipno/zazitky" className="text-sm font-bold" style={{ color: lipnoBrand.primary }}>Vše →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {featuredExperiences.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[1.8rem] p-5"
                style={{
                  background: index === 0 ? lipnoBrand.secondarySoft : "#fff",
                  boxShadow: "0 12px 24px rgba(12,74,110,0.06)",
                  border: "1px solid rgba(12,74,110,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: "rgba(255,255,255,0.72)", color: lipnoBrand.secondary }}>
                      {item.season}
                    </span>
                    <h3 className="mt-3 font-headline text-xl font-extrabold leading-tight" style={{ color: lipnoBrand.ink }}>{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>{item.summary}</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: lipnoBrand.accent }}>arrow_outward</span>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: lipnoBrand.primarySoft, color: lipnoBrand.primary }}>{item.duration}</span>
                  <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: lipnoBrand.accentSoft, color: lipnoBrand.accent }}>{item.highlight}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-lg font-bold" style={{ color: lipnoBrand.ink }}>Servis dnes</h2>
            <Link href="/lipno/servis" className="text-sm font-bold" style={{ color: lipnoBrand.primary }}>Otevřít →</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {featuredServices.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.6rem] p-4 block"
                style={{ background: "#fff", border: "1px solid rgba(12,74,110,0.06)", boxShadow: "0 10px 22px rgba(12,74,110,0.06)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="material-symbols-outlined text-[1.6rem]" style={{ color: lipnoBrand.primary }}>{item.icon}</span>
                  {item.badge && (
                    <span className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em]" style={{ background: lipnoBrand.accentSoft, color: lipnoBrand.accent }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-headline text-base font-extrabold leading-snug" style={{ color: lipnoBrand.ink }}>{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>{item.text}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div
            className="rounded-[2rem] p-6"
            style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0f766e 100%)", boxShadow: "0 16px 34px rgba(12,74,110,0.18)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/74">Kalendář akcí</p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold leading-tight text-white">{featuredEvent.title}</h2>
            <p className="mt-2 text-sm text-white/82">{featuredEvent.summary}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>{featuredEvent.dateLabel}</span>
              <Link href="/lipno/kalendar" className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(255,255,255,0.92)", color: lipnoBrand.primary }}>
                Otevřít program
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pt-8 pb-4">
          <a
            href="https://www.lipno.info/infocentrum.html"
            target="_blank"
            rel="noreferrer"
            className="block rounded-[2rem] p-5"
            style={{ background: "#fff", boxShadow: "0 14px 30px rgba(12,74,110,0.08)", border: "1px solid rgba(12,74,110,0.08)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: lipnoBrand.secondary }}>Infocentrum</p>
                <h2 className="mt-3 font-headline text-3xl font-extrabold" style={{ color: lipnoBrand.primary }}>Kontakt a servis</h2>
              </div>
              <span className="material-symbols-outlined text-2xl" style={{ color: lipnoBrand.primary }}>arrow_forward</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
              {lipnoInfoCenter.phone} · {lipnoInfoCenter.email} · {lipnoInfoCenter.address}
            </p>
          </a>
        </section>
      </main>
      <LipnoBottomNav />
    </>
  );
}
