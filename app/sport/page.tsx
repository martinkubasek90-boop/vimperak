import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { sportClubs, sportVenues } from "@/lib/data";

export default function SportPage() {
  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5">
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-[0.18em]"
                  style={{ color: "var(--secondary)" }}
                >
                  Sport ve městě
                </p>
                <h1
                  className="mt-3 font-headline text-3xl font-extrabold tracking-tight md:text-[2.6rem]"
                  style={{ color: "var(--primary)" }}
                >
                  Sport ve Vimperku
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Přehled sportovišť a místních klubů na jednom místě. Obsah vychází z oficiální stránky města
                  Vimperk věnované sportu a sportovištím.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.4rem] p-4" style={{ background: "var(--secondary-container)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    Kluby
                  </p>
                  <p className="mt-2 font-headline text-2xl font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
                    {sportClubs.length}
                  </p>
                </div>
                <div className="rounded-[1.4rem] p-4" style={{ background: "var(--tertiary-fixed)" }}>
                  <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: "var(--tertiary)" }}>
                    Sportoviště
                  </p>
                  <p className="mt-2 font-headline text-2xl font-extrabold" style={{ color: "var(--on-tertiary-fixed)" }}>
                    {sportVenues.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          <div
            className="rounded-[1.8rem] p-5"
            style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
                  Kde zjistit aktuální sportovní provoz
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                  Město na své oficiální sportovní stránce uvádí, že aktuální informace o sportu a sportovištích
                  poskytují Městské služby Vimperk a Zimní stadion.
                </p>
              </div>
              <span className="material-symbols-outlined text-[2rem]" style={{ color: "var(--secondary)" }}>
                fitness_center
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {sportVenues.map((venue) => (
                <article
                  key={venue.id}
                  className="rounded-[1.4rem] p-4"
                  style={{ background: "var(--surface-container-low)", border: "1px solid rgba(159,29,47,0.08)" }}
                >
                  <h3 className="font-headline text-base font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {venue.name}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {venue.address}
                  </p>
                  {venue.contact && (
                    <p className="mt-2 text-sm" style={{ color: "var(--on-surface)" }}>
                      Kontakt: {venue.contact}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {venue.phone && <span>Tel: {venue.phone}</span>}
                    {venue.email && <span>E-mail: {venue.email}</span>}
                  </div>
                  {venue.website && (
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      Otevřít web
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
              Sportovní kluby
            </h2>
            <span className="text-xs font-semibold" style={{ color: "var(--on-surface-variant)" }}>
              Přehled kontaktů
            </span>
          </div>

          <div className="space-y-3">
            {sportClubs.map((club) => (
              <article
                key={club.id}
                className="rounded-[1.8rem] p-5"
                style={{
                  background: "var(--surface-container-lowest)",
                  border: "1px solid rgba(159,29,47,0.06)",
                  boxShadow: "0 10px 22px rgba(67,17,24,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-headline text-lg font-extrabold leading-snug" style={{ color: "var(--on-surface)" }}>
                      {club.name}
                    </h3>
                    {club.address && (
                      <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                        {club.address}
                      </p>
                    )}
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
                    style={{ background: "var(--secondary-fixed)", color: "var(--secondary)" }}
                  >
                    Klub
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                  {club.contact && <p>Kontakt: {club.contact}</p>}
                  {club.phone && <p>Telefon: {club.phone}</p>}
                  {club.email && <p>E-mail: {club.email}</p>}
                </div>

                {club.website && (
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    Web klubu
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6">
          <div
            className="rounded-[1.8rem] p-5"
            style={{ background: "var(--primary-fixed)", border: "1px solid rgba(159,29,47,0.10)" }}
          >
            <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-primary-fixed)" }}>
              Zdroj dat
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-primary-fixed)" }}>
              Seznam klubů a sportovišť je převzatý z oficiální stránky města Vimperk
              {" "}
              <a
                href="https://www.vimperk.cz/sport/d-20105"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline"
              >
                Sport: Vimperk
              </a>
              . Původní web `sport-vimperk.cz`, na který město odkazuje, dnes podle dohledaného stavu už neobsahuje
              relevantní sportovní stránku, proto vycházím z městského seznamu.
            </p>
            <Link
              href="/akce"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.78)", color: "var(--primary)" }}
            >
              Otevřít kalendář akcí
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
