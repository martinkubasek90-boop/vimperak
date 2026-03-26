import Link from "next/link";
import LipnoTopBar from "@/components/lipno/LipnoTopBar";
import LipnoBottomNav from "@/components/lipno/LipnoBottomNav";
import { lipnoBrand, lipnoInfoCenter, lipnoRentals, lipnoServiceLinks } from "@/lib/lipno-data";

export default function LipnoServicePage() {
  return (
    <>
      <LipnoTopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto" style={{ background: lipnoBrand.sand }}>
        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-5 md:p-6" style={{ background: "linear-gradient(135deg, #ecfeff 0%, #eff6ff 100%)" }}>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-[2.6rem]" style={{ color: lipnoBrand.primary }}>
              Servis na Lipně
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
              Vstupenky, webkamery, otevírací doby, infocentrum, parkování i provozní jistoty na jednom místě.
            </p>
          </div>
        </section>

        <section className="px-4 pt-5">
          <div className="grid grid-cols-2 gap-3">
            {lipnoServiceLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.8rem] p-5 block"
                style={{ background: "#fff", boxShadow: "0 10px 22px rgba(12,74,110,0.06)", border: "1px solid rgba(12,74,110,0.06)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="material-symbols-outlined text-2xl" style={{ color: lipnoBrand.primary }}>{item.icon}</span>
                  {item.badge && (
                    <span className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em]" style={{ background: lipnoBrand.accentSoft, color: lipnoBrand.accent }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 font-headline text-base font-extrabold leading-snug" style={{ color: lipnoBrand.ink }}>
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>
                  {item.text}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-lg font-bold" style={{ color: lipnoBrand.ink }}>Půjčovny a zázemí</h2>
            <Link href="/lipno/zazitky" className="text-sm font-bold" style={{ color: lipnoBrand.primary }}>Zážitky</Link>
          </div>
          <div className="space-y-3">
            {lipnoRentals.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.8rem] p-5 block"
                style={{ background: "#fff", boxShadow: "0 12px 24px rgba(12,74,110,0.06)", border: "1px solid rgba(12,74,110,0.06)" }}
              >
                <h3 className="font-headline text-lg font-extrabold" style={{ color: lipnoBrand.ink }}>{item.title}</h3>
                <p className="mt-1 text-sm font-semibold" style={{ color: lipnoBrand.secondary }}>{item.area}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: lipnoBrand.muted }}>{item.summary}</p>
                <p className="mt-3 text-sm font-semibold" style={{ color: lipnoBrand.primary }}>{item.contact}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8 pb-4">
          <a
            href="https://www.lipno.info/infocentrum.html"
            target="_blank"
            rel="noreferrer"
            className="block rounded-[2rem] p-6"
            style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0f766e 100%)", boxShadow: "0 16px 34px rgba(12,74,110,0.18)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/74">Infocentrum</p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold leading-tight text-white">{lipnoInfoCenter.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/82">{lipnoInfoCenter.address}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/82">{lipnoInfoCenter.phone} · {lipnoInfoCenter.email}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/82">{lipnoInfoCenter.parking}</p>
          </a>
        </section>
      </main>
      <LipnoBottomNav />
    </>
  );
}
