import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import PushNotificationButton from "@/components/PushNotificationButton";
import Link from "next/link";

const installGuides = [
  {
    title: "iPhone",
    icon: "phone_iphone",
    tone: "var(--secondary-container)",
    text: "Safari",
    steps: [
      "Otevřete Vimperák v Safari.",
      "Dole klepněte na Sdílet.",
      "Vyberte Přidat na plochu.",
      "Potvrďte Přidat a aplikace se objeví mezi ostatními ikonami.",
    ],
  },
  {
    title: "Android",
    icon: "android",
    tone: "var(--primary-fixed)",
    text: "Chrome",
    steps: [
      "Otevřete Vimperák v Chromu.",
      "Klepněte na menu vpravo nahoře.",
      "Vyberte Instalovat aplikaci nebo Přidat na plochu.",
      "Potvrďte instalaci a aplikace se připne do telefonu.",
    ],
  },
];

const benefits = [
  { icon: "download_done", title: "Instaluje se jen jednou", text: "Další verze není potřeba znovu instalovat." },
  { icon: "system_update", title: "Aktualizuje se sama", text: "Při otevření aplikace si stáhne novou verzi na pozadí." },
  { icon: "notifications_active", title: "Umí notifikace", text: "Důležité zprávy z města můžou chodit přímo do telefonu." },
];

export default function InstalacePage() {
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
              <span className="material-symbols-outlined text-base">download</span>
              Instalace do telefonu
            </span>
            <h1 className="mt-4 font-headline text-[2.2rem] font-extrabold leading-[1.02]" style={{ color: "var(--on-surface)" }}>
              Vimperák funguje jako aplikace bez App Storu.
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Stačí otevřít web, přidat ho na plochu a dál ho používat jako běžnou mobilní aplikaci. Další verze se stahují samy na pozadí.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-transform active:scale-95"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "var(--on-primary)" }}
              >
                <span className="material-symbols-outlined text-base">home</span>
                Zpět na domovskou stránku
              </Link>
              <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--surface-container)", color: "var(--on-surface)" }}>
                <span className="material-symbols-outlined text-base">autorenew</span>
                Bez nové instalace při každé změně
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-6 grid gap-4 md:grid-cols-2">
          {installGuides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-[1.8rem] p-5"
              style={{
                background: "var(--surface-container-lowest)",
                boxShadow: "0 10px 24px rgba(67,17,24,0.06)",
                border: "1px solid rgba(159,29,47,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: guide.tone }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--on-surface)", fontSize: "24px" }}>
                    {guide.icon}
                  </span>
                </div>
                <div>
                  <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {guide.title}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--secondary)" }}>
                    {guide.text}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {guide.steps.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black" style={{ background: "var(--surface-container)", color: "var(--primary)" }}>
                      {index + 1}
                    </div>
                    <p className="pt-0.5 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="px-4 pt-6">
          <div
            className="rounded-[1.8rem] p-5"
            style={{
              background: "var(--surface-container-lowest)",
              boxShadow: "0 12px 26px rgba(67,17,24,0.06)",
              border: "1px solid rgba(159,29,47,0.05)",
            }}
          >
            <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
              Co se děje po aktualizaci
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] p-4" style={{ background: "var(--surface-container-low)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>{item.icon}</span>
                  <p className="mt-3 text-sm font-bold" style={{ color: "var(--on-surface)" }}>{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              Jakmile vydáte novou verzi webu, telefon si ji při dalším otevření stáhne sám. Uživatelé nic znovu neinstalují. Nejvýš se jim po otevření načte už nová verze obrazovky.
            </p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div
            className="rounded-[1.8rem] p-5"
            style={{
              background: "var(--secondary-container)",
              border: "1px solid rgba(53,110,92,0.10)",
              boxShadow: "0 12px 24px rgba(53,110,92,0.10)",
            }}
          >
            <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
              Zapnout městské notifikace
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-secondary-container)" }}>
              Po instalaci může uživatel rovnou povolit notifikace. To je nejrychlejší cesta, jak dostat důležité informace z města přímo na mobil.
            </p>
            <div className="mt-4">
              <PushNotificationButton />
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
