"use client";

import Link from "next/link";
import { lipnoBrand } from "@/lib/lipno-data";

export default function LipnoTopBar() {
  return (
    <header
      className="fixed top-0 w-full z-50 glass-header"
      style={{ borderBottom: "1px solid rgba(12,74,110,0.08)" }}
    >
      <div className="max-w-2xl mx-auto flex justify-between items-center px-5 h-[72px]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[1rem] flex items-center justify-center shrink-0"
            style={{ background: lipnoBrand.primarySoft, boxShadow: "0 10px 24px rgba(12,74,110,0.08)" }}
          >
            <span className="material-symbols-outlined" style={{ color: lipnoBrand.primary }}>landscape</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <Link href="/lipno" className="font-headline font-black text-[1.95rem] leading-none tracking-[-0.04em]" style={{ color: lipnoBrand.ink }}>
              Lipno.
            </Link>
            <span className="text-[0.56rem] font-black uppercase tracking-[0.18em] leading-none" style={{ color: lipnoBrand.secondary }}>
              Sport & resort
            </span>
          </div>
        </div>
        <a
          href="https://www.lipno.info/infocentrum.html"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-90"
          style={{ color: lipnoBrand.primary, background: "rgba(224,242,254,0.85)" }}
        >
          <span className="material-symbols-outlined">info</span>
        </a>
      </div>
    </header>
  );
}
