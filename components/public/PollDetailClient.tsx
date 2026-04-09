"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { loadVotedPolls, saveVotedPoll } from "@/lib/client-storage";
import type { PublicPoll } from "@/lib/public-content";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PollDetailClient({
  poll,
  related,
}: {
  poll: PublicPoll;
  related: PublicPoll[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadVotedPolls();
    setVotedFor(stored[String(poll.id)] ?? null);
  }, [poll.id]);

  const totalVotes = votedFor != null ? poll.totalVotes + 1 : poll.totalVotes;
  const options = poll.options.map((option) => ({
    ...option,
    votes: votedFor === String(option.id) ? option.votes + 1 : option.votes,
  }));
  const maxVotes = Math.max(...options.map((option) => option.votes));

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-28 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "var(--secondary)" }}>
              {poll.category} · do {formatDate(poll.endsAt)}
            </p>
            <h1 className="mt-3 font-headline text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
              {poll.question}
            </h1>
            <p className="mt-3 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              {totalVotes.toLocaleString("cs-CZ")} hlasů zaznamenáno
            </p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <div className="rounded-[1.8rem] p-6" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}>
            <div className="space-y-3">
              {options.map((option) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isSelected = selected === String(option.id);
                const isWinner = option.votes === maxVotes;

                return votedFor == null ? (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelected(String(option.id))}
                    className="w-full rounded-[1.4rem] px-4 py-4 text-left"
                    style={isSelected
                      ? { background: "var(--primary-fixed)", border: "2px solid var(--primary)", color: "var(--on-primary-fixed)" }
                      : { background: "var(--surface-container-low)", border: "2px solid transparent", color: "var(--on-surface)" }}
                  >
                    {option.text}
                  </button>
                ) : (
                  <div key={option.id}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold" style={{ color: isWinner ? "var(--primary)" : "var(--on-surface)" }}>
                        {option.text}
                      </span>
                      <span className="text-sm font-black" style={{ color: isWinner ? "var(--primary)" : "var(--on-surface-variant)" }}>
                        {percentage} %
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-container-low)" }}>
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: isWinner ? "var(--primary)" : "var(--secondary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {votedFor == null ? (
              <button
                type="button"
                disabled={selected == null}
                onClick={async () => {
                  if (selected == null) return;
                  setSubmitError(null);
                  setLoading(true);
                  try {
                    const response = await fetch("/api/vote", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ optionId: selected }),
                    });
                    if (!response.ok) {
                      throw new Error("vote failed");
                    }
                    saveVotedPoll(poll.id, selected);
                    setVotedFor(selected);
                  } catch {
                    setSubmitError("Hlas se nepodařilo odeslat. Zkus to prosím znovu.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-5 w-full rounded-[1.4rem] px-4 py-4 text-sm font-bold"
                style={selected != null
                  ? { background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "var(--on-primary)" }
                  : { background: "var(--surface-container-high)", color: "var(--on-surface-variant)" }}
              >
                {loading ? "Odesílám…" : "Odeslat hlas"}
              </button>
            ) : (
              <div className="mt-5 rounded-[1.4rem] px-4 py-4 text-sm font-semibold" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
                Hlas byl zaznamenán. Děkujeme za zpětnou vazbu.
              </div>
            )}

            {submitError ? (
              <p className="mt-4 text-sm font-medium" style={{ color: "var(--error)" }}>
                {submitError}
              </p>
            ) : null}
          </div>
        </section>

        {related.length > 0 ? (
          <section className="px-4 pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-headline text-xl font-extrabold" style={{ color: "var(--on-surface)" }}>
                Další ankety
              </h2>
              <Link href="/hlasovani" className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                Všechny ankety
              </Link>
            </div>
            <div className="space-y-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/hlasovani/${encodeURIComponent(String(entry.id))}`}
                  className="block rounded-[1.6rem] p-4"
                  style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)" }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--secondary)" }}>
                    {entry.category} · do {entry.endsAt}
                  </p>
                  <h3 className="mt-2 font-headline text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
                    {entry.question}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                    {entry.totalVotes.toLocaleString("cs-CZ")} hlasů
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
