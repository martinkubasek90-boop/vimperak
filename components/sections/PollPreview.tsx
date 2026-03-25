import Link from "next/link";
import { polls } from "@/lib/data";
import { Vote, ArrowRight } from "lucide-react";

export default function PollPreview() {
  const poll = polls[0];
  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-bold text-gray-900">Aktuální hlasování</h2>
          </div>
          <Link href="/hlasovani" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Všechna hlasování <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-brand-200 p-6 max-w-2xl">
          <p className="font-semibold text-gray-900 mb-1">{poll.question}</p>
          <p className="text-xs text-gray-400 mb-5">{poll.totalVotes} hlasů · hlasování do {formatDate(poll.endsAt)}</p>

          <div className="flex flex-col gap-3 mb-5">
            {poll.options.map((opt) => {
              const pct = Math.round((opt.votes / poll.totalVotes) * 100);
              const isLeading = opt.votes === maxVotes;
              return (
                <div key={opt.id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className={isLeading ? "font-semibold text-brand-700" : "text-gray-700"}>{opt.text}</span>
                    <span className="text-gray-500 text-xs">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLeading ? "bg-brand-500" : "bg-gray-300"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/hlasovani"
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Vote className="w-4 h-4" />
            Hlasovat
          </Link>
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}
