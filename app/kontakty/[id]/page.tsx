import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { cityDepartmentLabels } from "@/lib/directory";
import { getContactDetailHref } from "@/lib/content-links";
import { getPublicDirectory } from "@/lib/public-content";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const directory = await getPublicDirectory();
  const item = directory.find((candidate) => String(candidate.id) === id);

  if (!item) notFound();

  const related = directory
    .filter((candidate) => candidate.id !== item.id && candidate.category === item.category)
    .slice(0, 3);

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-6" style={{ background: "linear-gradient(135deg, #8f2030 0%, #c83846 52%, #d77b53 100%)", boxShadow: "0 16px 34px rgba(67,17,24,0.18)" }}>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
              {item.category}{item.cityDepartment ? ` · ${cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment}` : ""}
            </p>
            <h1 className="mt-3 font-headline text-3xl font-extrabold text-white">
              {item.name}
            </h1>
            <div className="mt-5 space-y-2 text-sm text-white/90">
              <p>{item.phone}</p>
              <p>{item.address}</p>
              {item.email ? <p>{item.email}</p> : null}
              {item.hours ? <p>{item.hours}</p> : null}
            </div>
            {item.note ? (
              <p className="mt-4 text-sm text-white/85">{item.note}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="rounded-full bg-white px-4 py-3 text-sm font-bold" style={{ color: "var(--primary)" }}>
                Volat
              </a>
              {item.email ? (
                <a href={`mailto:${item.email}`} className="rounded-full px-4 py-3 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  Napsat e-mail
                </a>
              ) : null}
              <a href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`} target="_blank" rel="noreferrer" className="rounded-full px-4 py-3 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.18)" }}>
                Otevřít mapu
              </a>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="px-4 pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                Podobné kontakty
              </h2>
              <Link href={item.category === "město" ? "/kontakty" : `/adresar?k=${encodeURIComponent(item.category)}`} className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                Zpět do seznamu
              </Link>
            </div>
            <div className="space-y-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={getContactDetailHref(entry)}
                  className="block rounded-[1.6rem] p-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {entry.category}
                  </p>
                  <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {entry.name}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {entry.phone} · {entry.address}
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
