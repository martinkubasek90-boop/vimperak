import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { getNewsDetailHref } from "@/lib/content-links";
import { getPublicNews } from "@/lib/public-content";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getPublicNews();
  const item = news.find((candidate) => String(candidate.id) === id);

  if (!item) notFound();

  const related = news
    .filter((candidate) => candidate.id !== item.id && candidate.category === item.category)
    .slice(0, 3);

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="relative overflow-hidden rounded-[2rem] min-h-[18rem]" style={{ boxShadow: "0 18px 40px rgba(50,24,18,0.18)", background: "#3e2421" }}>
            <Image src={item.image} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(18,15,15,0.76) 0%, rgba(18,15,15,0.15) 58%)" }} />
            <div className="relative z-10 flex min-h-[18rem] flex-col justify-end p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                {item.category} · {item.date}
              </p>
              <h1 className="mt-3 font-headline text-3xl font-extrabold leading-tight text-white">
                {item.title}
              </h1>
              {item.urgent ? (
                <span className="mt-4 inline-flex w-fit rounded-full bg-white/16 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Důležité upozornění
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div className="rounded-[1.8rem] p-6" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
            <p className="text-base leading-8" style={{ color: "var(--on-surface)" }}>
              {item.body ?? item.summary}
            </p>
            <p className="mt-5 text-sm leading-7" style={{ color: "var(--on-surface-variant)" }}>
              {item.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/zpravodaj"
                className="rounded-full px-4 py-3 text-sm font-bold"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                Zpět do zpravodaje
              </Link>
              <Link
                href="/mesto"
                className="rounded-full px-4 py-3 text-sm font-bold"
                style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
              >
                Další městské informace
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="px-4 pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                Související zprávy
              </h2>
              <Link href="/zpravodaj" className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                Všechny zprávy
              </Link>
            </div>
            <div className="space-y-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={getNewsDetailHref(entry)}
                  className="block rounded-[1.6rem] p-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {entry.category} · {entry.date}
                  </p>
                  <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {entry.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
