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

function renderMessageContent(content: string, isUser: boolean) {
  if (isUser) return content;

  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  const elements: React.ReactNode[] = [];
  const urlPattern = /^((odkaz|zdroj):\s*)?(https?:\/\/\S+)$/i;

  lines.forEach((line, index) => {
    const match = line.match(urlPattern);
    if (match) {
      const url = match[3];
      const label = /^zdroj:/i.test(line) ? "Otevřít zdroj" : "Otevřít odkaz";
      elements.push(
        <a
          key={`cta-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-transform active:scale-[0.98]"
          style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
          {label}
        </a>,
      );
      return;
    }

    elements.push(<p key={`p-${index}`}>{line}</p>);
  });

  return <div className="space-y-2">{elements}</div>;
}

export default function AiPage() {
  const [mode, setMode] = useState<"ai" | "fallback" | null>(null);
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
      setMode(data.mode === "ai" ? "ai" : "fallback");
      setMsgs([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMode("fallback");
      setMsgs([...updated, { role: "assistant", content: "Omlouvám se, nastala chyba. Zkuste to znovu." }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      <TopBar />
      <div className="pt-[72px] flex flex-col max-w-2xl mx-auto" style={{ height: "100dvh" }}>

        {/* AI hero */}
        <div className="shrink-0 px-4 pt-4 pb-2">
          <div className="editorial-shell rounded-[2rem] p-5">
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-container))" }}>
                <span className="material-symbols-outlined text-white text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-headline font-extrabold text-xl" style={{ color: "var(--primary)" }}>Vimperák AI</h1>
                <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
                  Průvodce městem v redakčním stylu, ale pořád stručně a použitelné.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
                   style={{ background: "rgba(159,29,47,0.08)", color: "var(--primary)" }}>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: mode === "fallback" ? "#d97706" : "#5c8a54" }}
                />
                <span className="text-xs font-semibold">
                  {mode === "fallback" ? "Omezený režim" : "AI online"}
                </span>
              </div>
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
                     background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                     color: "var(--on-primary)",
                     borderBottomRightRadius: "6px",
                     boxShadow: "0 10px 20px rgba(67,17,24,0.12)"
                   } : {
                     background: "var(--surface-container-lowest)",
                     color: "var(--on-surface)",
                     borderBottomLeftRadius: "6px",
                     boxShadow: "0 10px 22px rgba(67,17,24,0.06)",
                     border: "1px solid rgba(159,29,47,0.05)"
                   }}>
                {renderMessageContent(msg.content, msg.role === "user")}
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
              <div className="px-4 py-3 rounded-2xl" style={{ background: "var(--surface-container-lowest)", borderBottomLeftRadius: "6px", border: "1px solid rgba(159,29,47,0.05)" }}>
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
               style={{ background: "var(--surface-container-lowest)", boxShadow: "0 14px 28px rgba(67,17,24,0.08)", border: "1px solid rgba(159,29,47,0.08)" }}>
            <input ref={inputRef} type="text" value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === "Enter" && send(input)}
                   placeholder="Zeptejte se na cokoliv..."
                   className="flex-1 text-sm px-2 py-2 outline-none bg-transparent"
                   style={{ color: "var(--on-surface)" }} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                    style={input.trim() && !loading ? {
                      background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
                      color: "var(--on-primary)",
                      boxShadow: "0 10px 18px rgba(67,17,24,0.14)"
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
