import Link from "next/link";
import { busLines } from "@/lib/data";
import { Bus, Clock, ArrowRight } from "lucide-react";

export default function BusPreview() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-gray-900">Jízdní řády</h2>
        </div>
        <Link href="/jizdy" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
          Všechny linky <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {busLines.map((line) => {
          const nextDep = line.departures.find((d) => d > currentTime);
          return (
            <div key={line.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                      {line.number}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      → {line.to}
                    </span>
                  </div>
                  {line.note && (
                    <p className="text-xs text-gray-400 mt-0.5">{line.note}</p>
                  )}
                </div>
                {nextDep ? (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-brand-600 font-bold text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {nextDep}
                    </div>
                    <div className="text-xs text-gray-400">nejbližší odjezd</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">dnes skončeno</div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {line.departures.map((dep) => (
                  <span
                    key={dep}
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      dep === nextDep
                        ? "bg-brand-600 text-white font-semibold"
                        : dep < currentTime
                        ? "bg-gray-100 text-gray-400 line-through"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
