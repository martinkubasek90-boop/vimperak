"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { findTrackedReport, saveTrackedReport, type TrackedReportItem } from "@/lib/client-storage";

type ReportDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at?: string;
  address?: string;
};

const statusStyle: Record<string, { bg: string; text: string }> = {
  "v řešení": { bg: "#fff3cd", text: "#856404" },
  "vyřešeno": { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  "přijato": { bg: "var(--tertiary-fixed)", text: "var(--on-tertiary-fixed)" },
  "zamítnuto": { bg: "var(--error-container)", text: "var(--error)" },
};

export function ReportDetailClient({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRemoteResult, setHasRemoteResult] = useState(false);

  useEffect(() => {
    const local = findTrackedReport(reportId);
    if (local) {
      setReport({
        id: local.id,
        title: local.title,
        description: local.description ?? "",
        category: local.category,
        status: local.status,
        created_at: local.createdAt,
        updated_at: local.updatedAt,
        address: local.address,
      });
    }

    void fetch(`/api/reports?ids=${encodeURIComponent(reportId)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ reports?: ReportDetail[] }>;
      })
      .then((payload) => {
        const next = payload?.reports?.[0];
        if (next) {
          setReport(next);
          saveTrackedReport({
            id: next.id,
            title: next.title,
            category: next.category,
            status: next.status,
            createdAt: next.created_at,
            updatedAt: next.updated_at,
            description: next.description,
            address: next.address,
          } satisfies TrackedReportItem);
        }
        setHasRemoteResult(true);
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [reportId]);

  if (isLoading && !report) {
    return (
      <>
        <TopBar />
        <main className="pt-20 pb-28 max-w-2xl mx-auto px-4">
          <div className="rounded-[1.8rem] p-6 mt-5" style={{ background: "var(--surface-container-lowest)" }}>
            Načítám detail hlášení…
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!report && hasRemoteResult) {
    return (
      <>
        <TopBar />
        <main className="pt-20 pb-28 max-w-2xl mx-auto px-4">
          <div className="rounded-[1.8rem] p-6 mt-5" style={{ background: "var(--surface-container-lowest)" }}>
            Detail hlášení se nepodařilo najít nebo už není dostupný.
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!report) {
    return null;
  }

  const status = statusStyle[report.status] ?? { bg: "var(--surface-container-low)", text: "var(--on-surface)" };

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="rounded-[2rem] p-6" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "var(--secondary)" }}>
                  {report.category} · hlášení závady
                </p>
                <h1 className="mt-3 font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
                  {report.title}
                </h1>
              </div>
              <span className="rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em]" style={{ background: status.bg, color: status.text }}>
                {report.status}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7" style={{ color: "var(--on-surface)" }}>
              {report.description}
            </p>

            <div className="mt-5 space-y-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              <p>Vytvořeno: {new Date(report.created_at).toLocaleString("cs-CZ")}</p>
              {report.updated_at ? <p>Poslední změna: {new Date(report.updated_at).toLocaleString("cs-CZ")}</p> : null}
              {report.address ? <p>Místo: {report.address}</p> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/zhlasit" className="rounded-full px-4 py-3 text-sm font-bold" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                Zpět na hlášení
              </Link>
              <Link href="/" className="rounded-full px-4 py-3 text-sm font-bold" style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}>
                Domů
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
