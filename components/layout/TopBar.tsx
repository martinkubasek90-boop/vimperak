"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 glass-header" style={{ borderBottom: "1px solid rgba(228,190,186,0.3)" }}>
      <div className="max-w-2xl mx-auto flex justify-between items-center px-5 h-[72px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
               style={{ background: "var(--surface-container-high)" }}>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>person</span>
          </div>
          <Link href="/" className="font-headline font-black text-2xl tracking-tight"
                style={{ color: "var(--primary-container)" }}>
            Vimperk
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-surface-container-low active:scale-90"
                  style={{ color: "var(--on-surface-variant)" }}>
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
