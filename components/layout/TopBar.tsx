"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopBar() {
  return (
    <header
      className="fixed top-0 w-full z-50 glass-header"
      style={{
        borderBottom: "1px solid rgba(159,29,47,0.08)",
        paddingTop: "var(--safe-top)",
      }}
    >
      <div className="max-w-2xl mx-auto flex justify-between items-center px-4 sm:px-5 h-[78px]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[1rem] flex items-center justify-center overflow-hidden shrink-0"
            style={{ background: "#ffffff", boxShadow: "0 10px 24px rgba(67,17,24,0.08)", border: "1px solid rgba(24,19,18,0.06)" }}
          >
            <Image
              src="/branding/vimperk-shield.png"
              alt="Znak města Vimperk"
              width={26}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="flex items-baseline gap-2.5">
            <Link href="/" className="font-headline font-black text-[2.05rem] leading-none tracking-[-0.04em]" style={{ color: "#181312" }}>
              Vimperk.
            </Link>
            <span
              className="hidden sm:inline text-[0.62rem] font-black uppercase tracking-[0.16em] leading-none"
              style={{ color: "var(--secondary)" }}
            >
              Město online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/moje"
            aria-label="Uložené"
            className="h-11 px-3 flex items-center justify-center gap-1.5 rounded-full transition-colors active:scale-90"
            style={{ color: "var(--secondary)", background: "rgba(237,225,214,0.55)" }}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="hidden sm:inline text-sm font-bold">Uložené</span>
          </Link>
          <Link
            href="/hledat"
            aria-label="Hledat"
            className="h-11 px-3 flex items-center justify-center gap-1.5 rounded-full transition-colors active:scale-90"
            style={{ color: "var(--secondary)", background: "rgba(237,225,214,0.55)" }}
          >
            <span className="material-symbols-outlined">search</span>
            <span className="hidden sm:inline text-sm font-bold">Hledat</span>
          </Link>
          <Link
            href="/#notifikace"
            aria-label="Notifikace"
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors active:scale-90"
            style={{ color: "var(--secondary)", background: "rgba(237,225,214,0.55)" }}
          >
            <span className="material-symbols-outlined">notifications</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
