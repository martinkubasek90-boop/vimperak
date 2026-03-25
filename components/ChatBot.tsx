"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_QUESTIONS = [
  "Kdy jede autobus do Prachatic?",
  "Kde najdu lékaře?",
  "Co se děje tento víkend?",
  "Číslo na taxi?",
  "Jak nahlásit závadu?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ahoj! Jsem Vimperák, váš průvodce po Vimperku 🏔️ Na co se chcete zeptat?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Omlouvám se, nastala chyba. Zkuste to prosím znovu." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
          open ? "bg-gray-700 hover:bg-gray-800" : "bg-brand-600 hover:bg-brand-700"
        )}
        aria-label="Otevřít chatbot Vimperák"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
            AI
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-brand-700 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Vimperák</div>
              <div className="text-xs text-brand-300">AI asistent města Vimperk</div>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex gap-2 items-end", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5",
                  msg.role === "user" ? "bg-brand-100" : "bg-brand-700"
                )}>
                  {msg.role === "user"
                    ? <User className="w-3.5 h-3.5 text-brand-700" />
                    : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-end">
                <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions (shown when only 1 message) */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              <p className="text-xs text-gray-400 font-medium">Časté otázky:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-full hover:bg-brand-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Zeptejte se na cokoliv..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-brand-600 disabled:bg-gray-200 text-white p-2 rounded-lg hover:bg-brand-700 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
