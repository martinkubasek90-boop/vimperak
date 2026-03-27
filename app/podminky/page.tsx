import type { Metadata } from "next";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Podminky pouziti | Vimperk",
  description: "Zakladni podminky pouziti aplikace Vimperak pro obcany mesta.",
  alternates: {
    canonical: "/podminky",
  },
};

const terms = [
  {
    title: "Ucel aplikace",
    body: "Vimperak slouzi jako informacni a komunikacni kanal mezi mestem a obyvateli. Obsahuje zpravy, kontakty, prehled akci, hlasovani a dalsi mestske sluzby.",
  },
  {
    title: "Informacni charakter",
    body: "Aplikace se snazi poskytovat aktualni a presne informace, ale nektere udaje se mohou menit. Zavazne informace je vhodne overit i na oficialnich kanalech mesta.",
  },
  {
    title: "Uzivatelske vstupy",
    body: "Pokud uzivatel odesila formular, hlasovani nebo podnet, odpovida za pravdivost a primerenost uvedenych informaci. Neni dovoleno posilat urazlivy, protipravni nebo zavadejici obsah.",
  },
  {
    title: "Dostupnost sluzby",
    body: "Mesto muze aplikaci prubezne upravovat, docasne omezit nebo menit jeji funkcionalitu z provoznich, bezpecnostnich nebo obsahovych duvodu.",
  },
  {
    title: "Kontakt a podpora",
    body: "V pripade problemu s aplikaci nebo nejasnosti kolem obsahu pouzijte kontakt mesta uvedeny v aplikaci nebo na oficialnim webu mesta.",
  },
];

export default function TermsPage() {
  return (
    <>
      <TopBar />
      <main className="pt-20 pb-36 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div
            className="rounded-[2rem] p-6"
            style={{
              background: "linear-gradient(135deg, var(--primary-fixed), var(--surface-container-lowest))",
              boxShadow: "0 14px 34px rgba(67,17,24,0.08)",
              border: "1px solid rgba(159,29,47,0.06)",
            }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]"
              style={{ background: "rgba(255,255,255,0.82)", color: "var(--primary)" }}
            >
              <span className="material-symbols-outlined text-base">gavel</span>
              Podminky pouziti
            </span>
            <h1 className="mt-4 font-headline text-[2.1rem] font-extrabold leading-[1.02]" style={{ color: "var(--on-surface)" }}>
              Zakladni pravidla pro pouzivani aplikace.
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Tohle je zakladni produkcni minimum. Pred oficialnim spustenim doplnte finalni pravni formulace a schvalte je s mestem.
            </p>
          </div>
        </section>

        <section className="px-4 pt-6 space-y-4">
          {terms.map((term) => (
            <article
              key={term.title}
              className="rounded-[1.8rem] p-5"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
                border: "1px solid rgba(159,29,47,0.05)",
              }}
            >
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                {term.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                {term.body}
              </p>
            </article>
          ))}
        </section>

        <section className="px-4 pt-6">
          <div className="rounded-[1.8rem] p-5" style={{ background: "var(--surface-container-low)", border: "1px solid rgba(159,29,47,0.06)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Souvisejici dokument:
            </p>
            <div className="mt-3">
              <Link href="/ochrana-soukromi" className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
                <span className="material-symbols-outlined text-base">shield_lock</span>
                Ochrana soukromi
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
