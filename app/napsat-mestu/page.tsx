"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";

const topics = [
  { value: "dotaz", label: "Obecný dotaz", icon: "help" },
  { value: "radnice", label: "Radnice a odbory", icon: "apartment" },
  { value: "doprava", label: "Doprava", icon: "commute" },
  { value: "poradek", label: "Veřejný pořádek", icon: "gavel" },
  { value: "kultura", label: "Kultura a akce", icon: "celebration" },
  { value: "socialni", label: "Sociální oblast", icon: "volunteer_activism" },
];

export default function NapsatMestuPage() {
  const [topic, setTopic] = useState("dotaz");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  }

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">
        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase mb-3"
                  style={{ background: "rgba(53, 110, 92, 0.14)", color: "var(--secondary)" }}
                >
                  Přímý kontakt
                </span>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]" style={{ color: "var(--primary)" }}>
                  Napsat městu
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  Krátký formulář pro dotazy, připomínky nebo podněty na radnici a městské odbory.
                </p>
              </div>

              <div className="rounded-[1.6rem] p-4" style={{ background: "var(--secondary-container)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--on-secondary-container)" }}>
                  Odpověď může přijít na váš e-mail nebo vás město kontaktuje telefonicky podle tématu zprávy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          {sent ? (
            <div className="rounded-[2rem] p-6 text-center" style={{ background: "var(--secondary-container)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)" }}>
              <span className="material-symbols-outlined text-5xl" style={{ color: "var(--secondary)" }}>mark_email_read</span>
              <h2 className="mt-4 font-headline text-2xl font-extrabold" style={{ color: "var(--on-secondary-container)" }}>
                Zpráva byla odeslána
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--on-secondary-container)" }}>
                Město dostalo váš podnět k tématu „{topics.find((item) => item.value === topic)?.label}“.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-5 rounded-2xl px-5 py-3 text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.72)", color: "var(--secondary)" }}
              >
                Poslat další zprávu
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] p-5 space-y-5"
              style={{ background: "var(--surface-container-lowest)", boxShadow: "0 12px 24px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}
            >
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.16em] mb-3" style={{ color: "var(--on-surface-variant)" }}>
                  Téma zprávy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {topics.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTopic(item.value)}
                      className="rounded-[1.2rem] p-4 text-left transition-all active:scale-[0.98]"
                      style={topic === item.value ? {
                        background: "var(--secondary-container)",
                        outline: "2px solid var(--secondary)",
                      } : {
                        background: "var(--surface-container-low)",
                        outline: "2px solid transparent",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: "var(--secondary)" }}>{item.icon}</span>
                      <p className="mt-3 text-sm font-semibold leading-snug" style={{ color: "var(--on-surface)" }}>
                        {item.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: "var(--on-surface-variant)" }}>
                    Jméno
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                    placeholder="Vaše jméno"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: "var(--on-surface-variant)" }}>
                    E-mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                    placeholder="vas@email.cz"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: "var(--on-surface-variant)" }}>
                  Zpráva
                </span>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "var(--surface-container-low)", color: "var(--on-surface)" }}
                  placeholder="Napište stručně, co potřebujete řešit."
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl py-4 text-sm font-bold"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "var(--on-primary)" }}
              >
                Odeslat zprávu městu
              </button>
            </form>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
