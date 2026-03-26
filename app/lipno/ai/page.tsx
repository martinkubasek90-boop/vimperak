"use client";

import { useEffect, useRef, useState } from "react";
import LipnoTopBar from "@/components/lipno/LipnoTopBar";
import LipnoBottomNav from "@/components/lipno/LipnoBottomNav";
import { lipnoAiPrompts, lipnoBrand } from "@/lib/lipno-data";

type Msg = { role: "user" | "assistant"; content: string };

function renderMessage(content: string, isUser: boolean) {
  if (isUser) return content;

  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  const urlPattern = /https?:\/\/\S+/gi;
  const parts: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const matches = line.match(urlPattern);
    if (matches?.length) {
      matches.forEach((rawUrl, urlIndex) => {
        const url = rawUrl.replace(/[.,)]+$/g, "");
        parts.push(
          <a
            key={`cta-${index}-${urlIndex}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
            style={{ background: lipnoBrand.secondarySoft, color: lipnoBrand.secondary }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
            Otevřít odkaz
          </a>,
        );
      });
      return;
    }

    parts.push(<p key={`p-${index}`}>{line}</p>);
  });

  return <div className="space-y-2">{parts}</div>;
}

export default function LipnoAiPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Ahoj, jsem Lipno AI.\nPomohu s otevíracími dobami, vstupenkami, webkamerami, půjčovnami i tipy na zážitky.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/lipno-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Teď se ke znalostní vrstvě Lipna nepřipojím. Zkuste to znovu." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LipnoTopBar />
      <div className="pt-[72px] flex flex-col max-w-2xl mx-auto" style={{ height: "100dvh", background: lipnoBrand.sand }}>
        <div className="shrink-0 px-4 pt-4 pb-2">
          <div className="rounded-[2rem] p-5" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)" }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${lipnoBrand.primary}, ${lipnoBrand.secondary})` }}>
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <h1 className="font-headline font-extrabold text-xl" style={{ color: lipnoBrand.primary }}>Lipno AI</h1>
                <p className="text-sm mt-1" style={{ color: lipnoBrand.muted }}>
                  Praktický asist pro vstupenky, provoz areálu a rychlé plánování dne.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                style={msg.role === "user" ? { background: lipnoBrand.primarySoft, color: lipnoBrand.primary } : { background: lipnoBrand.primary, color: "#fff" }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>
                  {msg.role === "user" ? "person" : "smart_toy"}
                </span>
              </div>
              <div
                className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.role === "user" ? {
                  background: `linear-gradient(135deg, ${lipnoBrand.primary}, ${lipnoBrand.secondary})`,
                  color: "#fff",
                  borderBottomRightRadius: "6px",
                } : {
                  background: "#fff",
                  color: lipnoBrand.ink,
                  borderBottomLeftRadius: "6px",
                  border: "1px solid rgba(12,74,110,0.06)",
                }}
              >
                {renderMessage(msg.content, msg.role === "user")}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="py-3">
              <p className="text-xs font-semibold text-center mb-3 uppercase tracking-wide" style={{ color: lipnoBrand.muted }}>Časté dotazy</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {lipnoAiPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="text-xs px-3.5 py-2 rounded-full transition-colors active:scale-95 font-medium"
                    style={{ background: "#fff", color: lipnoBrand.ink, border: "1px solid rgba(12,74,110,0.08)" }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 px-4 pt-2 pb-28">
          <div className="flex gap-2.5 p-2 rounded-2xl" style={{ background: "#fff", border: "1px solid rgba(12,74,110,0.08)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Zeptejte se na Lipno..."
              className="flex-1 text-sm px-2 py-2 outline-none bg-transparent"
              style={{ color: lipnoBrand.ink }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
              style={input.trim() && !loading ? { background: `linear-gradient(135deg, ${lipnoBrand.primary}, ${lipnoBrand.secondary})`, color: "#fff" } : { background: lipnoBrand.primarySoft, color: lipnoBrand.primary }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
            </button>
          </div>
        </div>
      </div>
      <LipnoBottomNav />
    </>
  );
}
