"use client";

import { useState, useRef, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Kdy jede autobus do Prachatic?",
  "Kde najdu lékaře?",
  "Co se děje tento víkend?",
  "Číslo na taxi?",
  "Jak nahlásit závadu?",
];

export default function AiPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Ahoj! Jsem Vimperák, váš AI průvodce po Vimperku 🏔️\n\nMůžu vám pomoci s jízdními řády, adresářem služeb, akcemi ve městě nebo informacemi z radnice. Na co se chcete zeptat?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const updated = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(updated); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMsgs([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMsgs([...updated, { role: "assistant", content: "Omlouvám se, nastala chyba. Zkuste to znovu." }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      <TopBar />
      <div className="pt-[72px] flex flex-col max-w-2xl mx-auto" style={{ height: "100dvh" }}>

        {/* AI hero */}
        <div className="shrink-0 px-4 pt-4 pb-2">
          <div className="rounded-[2rem] p-5 flex items-center gap-4"
               style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)", boxShadow: "0 8px 32px rgba(178,0,28,0.2)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                 style={{ background: "rgba(255,255,255,0.15)" }}>
              <span className="material-symbols-outlined text-white text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div className="flex-1">
              <h1 className="font-headline font-extrabold text-xl text-white">Vimperák AI</h1>
              <p className="text-sm" style={{ color: "rgba(255,218,215,0.85)" }}>Váš průvodce po Vimperku</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                 style={{ background: "rgba(255,255,255,0.2)" }}>
              <span className="w-2 h-2 rounded-full bg-green-300" />
              <span className="text-xs font-semibold text-white">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {msgs.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                   style={msg.role === "user"
                     ? { background: "var(--surface-container-high)", color: "var(--on-surface)" }
                     : { background: "var(--primary)", color: "var(--on-primary)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>
                  {msg.role === "user" ? "person" : "smart_toy"}
                </span>
              </div>
              {/* Bubble */}
              <div className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                   style={msg.role === "user" ? {
                     background: "var(--primary)",
                     color: "var(--on-primary)",
                     borderBottomRightRadius: "6px",
                     boxShadow: "0 2px 8px rgba(178,0,28,0.15)"
                   } : {
                     background: "var(--surface-container-lowest)",
                     color: "var(--on-surface)",
                     borderBottomLeftRadius: "6px",
                     boxShadow: "0 1px 8px rgba(24,28,32,0.08)"
                   }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>smart_toy</span>
              </div>
              <div className="px-4 py-3 rounded-2xl" style={{ background: "var(--surface-container-lowest)", borderBottomLeftRadius: "6px" }}>
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(n => (
                    <span key={n} className="w-2 h-2 rounded-full animate-bounce"
                          style={{ background: "var(--outline)", animationDelay: `${n * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick questions */}
          {msgs.length === 1 && (
            <div className="py-3">
              <p className="text-xs text-on-surface-variant font-semibold text-center mb-3 uppercase tracking-wide">Časté otázky</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK.map(q => (
                  <button key={q} onClick={() => send(q)}
                          className="text-xs px-3.5 py-2 rounded-full transition-colors active:scale-95 font-medium"
                          style={{ background: "var(--surface-container-low)", color: "var(--on-surface)", border: "1.5px solid var(--outline-variant)" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 pt-2 pb-28">
          <div className="flex gap-2.5 p-2 rounded-2xl"
               style={{ background: "var(--surface-container-lowest)", boxShadow: "0 2px 16px rgba(24,28,32,0.08)", border: "1.5px solid var(--outline-variant)" }}>
            <input ref={inputRef} type="text" value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === "Enter" && send(input)}
                   placeholder="Zeptejte se na cokoliv..."
                   className="flex-1 text-sm px-2 py-2 outline-none bg-transparent"
                   style={{ color: "var(--on-surface)" }} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                    style={input.trim() && !loading ? {
                      background: "var(--primary)",
                      color: "var(--on-primary)",
                      boxShadow: "0 4px 12px rgba(178,0,28,0.25)"
                    } : {
                      background: "var(--surface-container-high)",
                      color: "var(--on-surface-variant)"
                    }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
            </button>
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-2 opacity-70">
            Vimperák AI může dělat chyby — důležité info ověřte na radnici.
          </p>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
