import type { Metadata } from "next";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ochrana soukromi | Vimperk",
  description: "Informace o zpracovani osobnich udaju a push notifikacich v aplikaci Vimperak.",
  alternates: {
    canonical: "/ochrana-soukromi",
  },
};

const sections = [
  {
    title: "Jake udaje aplikace muze zpracovavat",
    body: [
      "Aplikace Vimperak muze zpracovavat udaje, ktere sami dobrovolne odeslete ve formularich nebo pri komunikaci s mestem.",
      "Pokud povolite push notifikace, uklada se technicky udaj potrebny pro dorucovani notifikaci do vaseho zarizeni.",
    ],
  },
  {
    title: "K cemu se udaje pouzivaji",
    body: [
      "Udaje se pouzivaji pro vyrizeni podnetu, odpoved na zpravy od obcanu a doruceni dulezitych informaci mesta.",
      "Udaje nejsou urcene k prodeji tretim stranam. Predani muze nastat jen tehdy, pokud to vyzaduje zakon nebo zajisteni technickeho provozu sluzby.",
    ],
  },
  {
    title: "Push notifikace",
    body: [
      "Push notifikace jsou dobrovolne. Muzete je kdykoli vypnout v nastaveni prohlizece nebo telefonu.",
      "Po odhlaseni notifikaci uz vam aplikace nebude posilat dalsi oznameni do daneho zarizeni.",
    ],
  },
  {
    title: "Doba uchovani",
    body: [
      "Udaje se uchovavaji jen po dobu nutnou pro vyrizeni dane agendy, provoz aplikace a splneni pravnich povinnosti mesta.",
    ],
  },
  {
    title: "Kontakt",
    body: [
      "Spravcem aplikace je mesto Vimperk. V pripade dotazu ke zpracovani osobnich udaju pouzijte kontakt na mestsky urad uvedeny v aplikaci nebo na oficialnim webu mesta.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main className="pt-20 pb-36 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div
            className="rounded-[2rem] p-6"
            style={{
              background: "linear-gradient(135deg, var(--surface-container-lowest), var(--surface-container-low))",
              boxShadow: "0 14px 34px rgba(67,17,24,0.08)",
              border: "1px solid rgba(159,29,47,0.06)",
            }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]"
              style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
            >
              <span className="material-symbols-outlined text-base">shield_lock</span>
              Ochrana soukromi
            </span>
            <h1 className="mt-4 font-headline text-[2.1rem] font-extrabold leading-[1.02]" style={{ color: "var(--on-surface)" }}>
              Jak Vimperak pracuje s udaji.
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Tato stranka shrnuje zakladni pravidla zpracovani osobnich udaju a fungovani push notifikaci v aplikaci.
            </p>
          </div>
        </section>

        <section className="px-4 pt-6 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.8rem] p-5"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
                border: "1px solid rgba(159,29,47,0.05)",
              }}
            >
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="px-4 pt-6">
          <div className="rounded-[1.8rem] p-5" style={{ background: "var(--secondary-container)", border: "1px solid rgba(53,110,92,0.10)" }}>
            <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
              Dulezite pred spustenim
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-secondary-container)" }}>
              Pred ostrym spustenim doplnte finalni pravni texty, kontakt na spravce a pripadne udaje o poverenci pro ochranu osobnich udaju mesta.
            </p>
            <div className="mt-4">
              <Link href="/podminky" className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(255,255,255,0.82)", color: "var(--secondary)" }}>
                <span className="material-symbols-outlined text-base">gavel</span>
                Otevrit podminky pouziti
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
