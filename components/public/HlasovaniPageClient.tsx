"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";
import type { PublicPoll } from "@/lib/public-content";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function HlasovaniPageClient({ polls }: { polls: PublicPoll[] }) {
  const [voted, setVoted] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<Record<number, number>>({});

  function handleVote(pollId: number) {
    const choice = selected[pollId];
    if (choice == null) return;
    setVoted((prev) => ({ ...prev, [pollId]: choice }));
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      <TopBar />
      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto">
        <section className="mb-6">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5 md:grid-cols-[1.08fr_0.92fr] md:items-center">
              <div>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ background: "rgba(159,29,47,0.08)", color: "var(--primary)" }}>
                  Participace
                </span>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Hlasování
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  Jednoduché ankety k městským tématům, které drží přehled výsledků i zbývající čas bez zbytečného šumu.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "how_to_vote", label: "Ankety" },
                  { icon: "groups", label: "Komunita" },
                  { icon: "campaign", label: "Rozhodnutí" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.3rem] p-4 text-center" style={{ background: "var(--surface-container-lowest)", border: "1px solid rgba(159,29,47,0.06)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>{item.icon}</span>
                    <p className="mt-2 text-xs font-semibold" style={{ color: "var(--on-surface)" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "how_to_vote", label: "Aktivní ankety", value: polls.length },
            { icon: "people", label: "Celkem hlasů", value: polls.reduce((sum, poll) => sum + poll.totalVotes, 0).toLocaleString("cs-CZ") },
            { icon: "check_circle", label: "Vyřešeno", value: "12" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-2xl p-4 flex flex-col items-center text-center" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 22px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}>
              <span className="material-symbols-outlined mb-1" style={{ color: "var(--primary)" }}>{icon}</span>
              <p className="font-headline font-black text-xl" style={{ color: "var(--on-surface)" }}>{value}</p>
              <p className="text-xs leading-tight mt-0.5" style={{ color: "var(--on-surface-variant)" }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {polls.map((poll) => {
            const hasVoted = poll.id in voted;
            const totalVotes = hasVoted ? poll.totalVotes + 1 : poll.totalVotes;
            const options = poll.options.map((option) => ({
              ...option,
              votes: hasVoted && option.id === voted[poll.id] ? option.votes + 1 : option.votes,
            }));
            const maxVotes = Math.max(...options.map((option) => option.votes));
            const left = daysLeft(poll.endsAt);

            return (
              <div key={poll.id} className="rounded-[2rem] overflow-hidden" style={{ background: "var(--surface-container-lowest)", boxShadow: "0 14px 28px rgba(67,17,24,0.07)", border: "1px solid rgba(159,29,47,0.05)" }}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--primary-fixed)", color: "var(--primary)" }}>
                      <span className="material-symbols-outlined">how_to_vote</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                      left <= 3 ? "bg-[var(--error-container)] text-[var(--error)]" : "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
                    )}>
                      <span className="material-symbols-outlined text-sm">timer</span>
                      {left === 0 ? "Poslední den!" : `${left} dní zbývá`}
                    </div>
                  </div>

                  <h2 className="font-headline font-bold text-lg leading-snug mb-1" style={{ color: "var(--on-surface)" }}>
                    {poll.question}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    {totalVotes.toLocaleString("cs-CZ")} hlasů · Do&nbsp;{formatDate(poll.endsAt)}
                  </p>
                </div>

                <div className="px-6 pb-6 space-y-3">
                  {options.map((opt) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    const isLeading = opt.votes === maxVotes && hasVoted;
                    const isVotedFor = voted[poll.id] === opt.id;
                    const isSelected = selected[poll.id] === opt.id;

                    return (
                      <div key={opt.id}>
                        {!hasVoted ? (
                          <button
                            onClick={() => setSelected((current) => ({ ...current, [poll.id]: opt.id }))}
                            className="w-full text-left rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all active:scale-[0.98]"
                            style={isSelected
                              ? { background: "var(--primary-fixed)", border: "2px solid var(--primary)", color: "var(--on-primary-fixed)", boxShadow: "0 8px 18px rgba(67,17,24,0.08)" }
                              : { background: "var(--surface-container-low)", border: "2px solid transparent", color: "var(--on-surface)" }}
                          >
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all" style={isSelected ? { borderColor: "var(--primary)", background: "var(--primary)" } : { borderColor: "var(--outline)" }}>
                              {isSelected ? <div className="w-2 h-2 rounded-full" style={{ background: "var(--on-primary)" }} /> : null}
                            </div>
                            <span className="font-medium text-sm">{opt.text}</span>
                          </button>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium flex items-center gap-2" style={{ color: isLeading ? "var(--primary)" : "var(--on-surface)" }}>
                                {isVotedFor ? (
                                  <span className="material-symbols-outlined text-base" style={{ color: "var(--secondary)" }}>check_circle</span>
                                ) : null}
                                {opt.text}
                              </span>
                              <span className="font-headline font-black text-sm" style={{ color: isLeading ? "var(--primary)" : "var(--on-surface-variant)" }}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: isLeading ? "var(--primary)" : "var(--secondary)" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!hasVoted ? (
                    <button
                      disabled={selected[poll.id] == null}
                      onClick={() => handleVote(poll.id)}
                      className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] mt-2 disabled:opacity-40"
                      style={{
                        background: selected[poll.id] != null ? "linear-gradient(135deg, var(--primary), var(--primary-container))" : "var(--surface-container-high)",
                        color: selected[poll.id] != null ? "var(--on-primary)" : "var(--on-surface-variant)",
                        boxShadow: selected[poll.id] != null ? "0 12px 22px rgba(67,17,24,0.14)" : "none",
                      }}
                    >
                      <span className="material-symbols-outlined text-base">how_to_vote</span>
                      Hlasovat
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-2" style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      <p className="text-sm font-semibold">Váš hlas byl zaznamenán. Děkujeme!</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
