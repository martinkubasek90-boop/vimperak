import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { directory, news, polls } from "@/lib/data";

const cityContacts = directory.filter((item) => item.category === "město").slice(0, 4);
const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

const cityActions = [
  {
    href: "/zhlasit",
    icon: "campaign",
    title: "Nahlásit závadu",
    text: "Výtluky, osvětlení, odpad nebo zeleň.",
    tone: "var(--primary-fixed)",
  },
  {
    href: "/hlasovani",
    icon: "how_to_vote",
    title: "Hlasování a ankety",
    text: "Zapojte se do rozhodování o městě.",
    tone: "var(--secondary-container)",
  },
  {
    href: "/napsat-mestu",
    icon: "mail",
    title: "Napsat městu",
    text: "Jednoduchý formulář pro dotazy a podněty.",
    tone: "var(--tertiary-fixed)",
  },
  {
    href: "/zpravodaj",
    icon: "newspaper",
    title: "Zprávy z radnice",
    text: "Důležité informace a městské novinky.",
    tone: "var(--surface-container-low)",
  },
];

export default function MestoPage() {
  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[17rem] md:min-h-[18rem]"
            style={{ boxShadow: "0 18px 40px rgba(50,24,18,0.18)", background: "#3e2421" }}
          >
            <Image
              src="/editorial/news-hero.svg"
              alt="Stylizovaná ilustrace městské budovy"
              fill
              className="object-cover object-[56%_18%] md:object-[54%_16%]"
            />
            <div className="relative z-10 flex min-h-[17rem] flex-col justify-end p-5 md:min-h-[18rem] md:p-6">
              <div className="mt-auto pt-16 md:pt-20">
                <h1 className="font-headline font-extrabold text-3xl tracking-tight text-white md:text-[2.8rem]">
                  Město
                </h1>
                <p className="mt-2 text-sm font-medium leading-relaxed max-w-[22rem]" style={{ color: "#7bf0af" }}>
                  Podněty, ankety, novinky a kontakt
                  <br />
                  s radnicí na jednom místě.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          <div className="grid grid-cols-2 gap-3">
            {cityActions.map((action) => {
              const content = (
                <>
                  <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>
                    {action.icon}
                  </span>
                  {action.title === "Hlasování a ankety" && (
                    <span
                      className="absolute right-4 top-4 inline-flex w-fit rounded-full px-2 py-[0.35rem] text-[8px] font-black uppercase tracking-[0.12em]"
                      style={{ background: "rgba(255,255,255,0.78)", color: "var(--secondary)" }}
                    >
                      {polls.length} aktivní ankety
                    </span>
                  )}
                  <h2 className="mt-4 font-headline text-base font-extrabold leading-snug" style={{ color: "var(--on-surface)" }}>
                    {action.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                    {action.text}
                  </p>
                </>
              );

              return action.href.startsWith("mailto:") ? (
                <a
                  key={action.title}
                  href={action.href}
                  className="rounded-[1.8rem] p-5 block transition-transform active:scale-[0.98]"
                  style={{ background: action.tone, boxShadow: "0 10px 22px rgba(67,17,24,0.06)" }}
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={action.title}
                  href={action.href}
                  className="relative rounded-[1.8rem] p-5 block transition-transform active:scale-[0.98]"
                  style={{ background: action.tone, boxShadow: "0 10px 22px rgba(67,17,24,0.06)" }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-6">
          <div
            className="rounded-[2rem] p-6 block"
            style={{ background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)", boxShadow: "0 16px 34px rgba(67,17,24,0.18)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.8)" }}>
                  Zprávy z radnice
                </p>
                <h2 className="mt-3 font-headline text-2xl font-extrabold leading-tight text-white">
                  Důležité novinky města hned po ruce
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                  Uzavírky, upozornění, změny v provozu úřadu i důležité termíny na jednom místě.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-white/90">newspaper</span>
            </div>
            <div className="mt-5 space-y-3">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href="/zpravodaj"
                  className="block rounded-[1.4rem] px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.14)" }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.76)" }}>
                    {new Date(item.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "long" })}
                  </p>
                  <h3 className="mt-2 text-base font-extrabold leading-snug text-white">{item.title}</h3>
                </Link>
              ))}
            </div>
            <Link
              href="/zpravodaj"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.92)", color: "var(--primary)" }}
            >
              Otevřít zpravodaj
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
              Zapojení obyvatel
            </h2>
            <Link href="/hlasovani" className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
              Všechny ankety
            </Link>
          </div>
          <div className="space-y-3">
            {polls.slice(0, 2).map((poll) => (
              <Link
                key={poll.id}
                href="/hlasovani"
                className="rounded-[1.8rem] p-5 block"
                style={{ background: "var(--primary-fixed)", boxShadow: "0 14px 28px rgba(143,32,48,0.10)", border: "1px solid rgba(159,29,47,0.10)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: "rgba(255,255,255,0.72)", color: "var(--primary)" }}>
                    Anketa
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--on-primary-fixed)" }}>
                    {poll.totalVotes.toLocaleString("cs-CZ")} hlasů
                  </span>
                </div>
                <h3 className="mt-3 font-headline text-base font-extrabold leading-snug" style={{ color: "var(--on-primary-fixed)" }}>
                  {poll.question}
                </h3>
                <p className="mt-3 text-sm font-semibold" style={{ color: "var(--primary)" }}>
                  Otevřít anketu →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-lg font-bold" style={{ color: "var(--on-surface)" }}>
              Kontakty na město
            </h2>
            <Link href="/kontakty?k=město" className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
              Celý seznam
            </Link>
          </div>
          <Link
            href="/kontakty?k=město"
            className="rounded-[1.8rem] p-5 block"
            style={{ background: "var(--secondary-container)", border: "1px solid rgba(53, 110, 92, 0.10)", boxShadow: "0 10px 22px rgba(53,110,92,0.10)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ background: "rgba(255,255,255,0.72)", color: "var(--secondary)" }}>
                  Kontakty města
                </span>
                <h3 className="mt-4 font-headline text-xl font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
                  Otevřít městské kontakty a odbory
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-secondary-container)" }}>
                  Radnice, odbory, online objednání i úřední hodiny přehledně na jednom místě.
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.65)", color: "var(--secondary)" }}
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </Link>
        </section>

        <section className="px-4 pt-8 pb-4">
          <Link
            href="/napsat-mestu"
            className="editorial-shell rounded-[2rem] p-5 block"
            style={{ boxShadow: "0 14px 30px rgba(67,17,24,0.08)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
                Napsat městu
              </h2>
              <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>arrow_forward</span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Krátký formulář pro dotazy, připomínky nebo podněty na radnici a městské odbory.
            </p>
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
