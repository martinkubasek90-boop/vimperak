"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const categories = [
  { value: "komunikace",        label: "Výtluk",    icon: "edit_road",      color: "var(--primary)",   bg: "var(--primary-fixed)" },
  { value: "veřejné osvětlení", label: "Osvětlení", icon: "lightbulb",      color: "var(--tertiary)",  bg: "var(--tertiary-fixed)" },
  { value: "odpad",             label: "Odpad",     icon: "delete_outline", color: "var(--secondary)", bg: "var(--secondary-container)" },
  { value: "zeleň",             label: "Zeleň",     icon: "park",           color: "#2e7d32",           bg: "#e8f5e9" },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  "v řešení": { bg: "#fff3cd", text: "#856404" },
  "vyřešeno": { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  "přijato":  { bg: "var(--tertiary-fixed)", text: "var(--on-tertiary-fixed)" },
};

const reports = [
  { id: 1, title: "Výtluk v ulici 1. máje",  status: "v řešení", date: "Před 2 dny",   icon: "edit_road" },
  { id: 2, title: "Nesvítící lampa u parku",  status: "vyřešeno", date: "Minulý týden", icon: "lightbulb" },
];

export default function ZhlasitPage() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [selCat, setSelCat] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  }

  async function submit() {
    if (!selCat || !desc) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); setStep("success");
  }

  if (step === "success") return (
    <>
      <TopBar />
      <main className="pt-20 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
             style={{ background: "var(--secondary-container)", boxShadow: "0 14px 30px rgba(78,57,44,0.18)" }}>
          <span className="material-symbols-outlined text-5xl text-on-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl text-on-surface mb-2">Závada nahlášena!</h2>
        <p className="text-on-surface-variant text-sm mb-8 max-w-xs leading-relaxed">
          Děkujeme. Vaše hlášení bylo přijato a bude zpracováno pracovníky radnice.
        </p>
        <button onClick={() => { setStep("form"); setSelCat(""); setDesc(""); setLocation(null); setPreview(null); }}
                className="text-primary font-bold text-sm underline underline-offset-2">
          Nahlásit další závadu
        </button>
      </main>
      <BottomNav />
    </>
  );

  return (
    <>
      <TopBar />
      <main className="pt-20 pb-4 max-w-2xl mx-auto">

        <section className="px-4 pt-5">
          <div className="editorial-shell rounded-[2rem] p-5 md:p-6">
            <div className="relative z-10 grid gap-5 md:grid-cols-[1.12fr_0.88fr] md:items-center">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase mb-3"
                  style={{ background: "rgba(159,29,47,0.08)", color: "var(--primary)" }}
                >
                  Podněty městu
                </span>
                <h1 className="font-headline font-extrabold text-3xl tracking-tight md:text-[2.6rem]"
                    style={{ color: "var(--primary)" }}>
                  Hlášení závad
                </h1>
                <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--on-surface-variant)" }}>
                  Krátký formulář pro výtluky, osvětlení, odpad nebo zeleň. Přidáte místo, popis a volitelně fotku.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div key={cat.value} className="rounded-[1.35rem] p-4" style={{ background: cat.bg }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: cat.color }}>{cat.icon}</span>
                    <p className="mt-3 text-sm font-semibold" style={{ color: "var(--on-surface)" }}>{cat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="px-5 pt-5 pb-6">

          {/* Big CTA */}
          <button
            onClick={submit}
            disabled={!selCat || !desc || loading}
            className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{
              background: (!selCat || !desc || loading)
                ? "var(--surface-container-high)"
                : "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 62%, var(--tertiary) 100%)",
              color: (!selCat || !desc || loading) ? "var(--on-surface-variant)" : "var(--on-primary)",
              boxShadow: (!selCat || !desc || loading) ? "none" : "0 16px 28px rgba(67,17,24,0.16)"
            }}
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Odesílám...</>
            ) : (
              <><span className="material-symbols-outlined">add_circle</span>Nahlásit novou závadu</>
            )}
          </button>
        </div>

        {/* Category grid */}
        <div className="px-5 pb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-3">Kategorie</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setSelCat(cat.value)}
                      className="p-4 rounded-2xl flex flex-col gap-3 items-start transition-all active:scale-95"
                      style={{
                        background: selCat === cat.value ? cat.bg : "var(--surface-container-lowest)",
                        outline: selCat === cat.value ? `2px solid ${cat.color}` : "2px solid transparent",
                        boxShadow: selCat === cat.value ? "0 10px 18px rgba(67,17,24,0.08)" : "0 6px 16px rgba(67,17,24,0.04)",
                      }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform"
                     style={{ background: "var(--surface-container-lowest)" }}>
                  <span className="material-symbols-outlined" style={{ color: cat.color }}>{cat.icon}</span>
                </div>
                <span className="font-semibold text-sm text-on-surface">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="px-4 pb-6">
          <div className="rounded-3xl p-5 space-y-5"
               style={{ background: "var(--surface-container-low)", border: "1px solid rgba(159,29,47,0.06)" }}>

            {/* Map */}
            <div>
              <label className="font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                Umístění závady
              </label>
              <div className="relative h-48 rounded-2xl overflow-hidden"
                   style={{ background: "var(--surface-container-highest)" }}>
                <MapPicker onSelect={(lat, lng) => setLocation({ lat, lng })}
                           selectedLat={location?.lat} selectedLng={location?.lng} />
                {!location && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-on-primary shadow-2xl"
                         style={{ background: "var(--primary)", boxShadow: "0 4px 20px rgba(178,0,28,0.35)" }}>
                      <span className="material-symbols-outlined text-3xl">location_on</span>
                    </div>
                  </div>
                )}
                {location && (
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                         style={{ background: "var(--secondary-container)", color: "var(--on-secondary-container)" }}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Poloha označena · {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 z-20">
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold"
                       style={{ background: "rgba(255,250,246,0.92)", color: "var(--on-surface)" }}>
                    Klikněte pro označení
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                Popis závady
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full scale-y-0 focus-within:scale-y-100 transition-transform origin-top"
                     style={{ background: "var(--primary)" }} />
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                          className="w-full rounded-2xl p-4 text-sm resize-none outline-none transition-all"
                          style={{
                            background: "var(--surface-container-lowest)",
                            border: "none",
                            color: "var(--on-surface)",
                          }}
                          placeholder="Popište závadu podrobněji — velikost, nebezpečnost, jak dlouho tam je..." />
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                Fotodokumentace
              </label>
              {preview ? (
                <div className="relative w-36 h-28 rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setPreview(null)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>✕</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-8 rounded-2xl cursor-pointer transition-colors gap-2"
                       style={{ border: "2px dashed var(--outline-variant)", background: "rgba(255,250,246,0.45)" }}>
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">add_a_photo</span>
                  <span className="font-semibold text-sm text-on-surface-variant">Nahrát fotku</span>
                  <span className="text-xs text-on-surface-variant opacity-60">Max. 3 soubory · JPG, PNG</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* My reports */}
        <div className="px-5 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-lg text-on-surface">Moje hlášení</h3>
            <span className="text-primary font-bold text-sm">Zobrazit vše</span>
          </div>
          <div className="space-y-3">
            {reports.map((r) => {
              const s = statusStyle[r.status] ?? { bg: "var(--surface-container)", text: "var(--on-surface-variant)" };
              return (
                <div key={r.id}
                     className="rounded-2xl p-4 flex items-center gap-4"
                     style={{ background: "var(--surface-container-lowest)", boxShadow: "0 10px 24px rgba(67,17,24,0.06)", border: "1px solid rgba(159,29,47,0.05)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: "var(--surface-container-low)" }}>
                    <span className="material-symbols-outlined text-on-surface-variant">{r.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-on-surface truncate">{r.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{r.date}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shrink-0"
                       style={{ background: s.bg, color: s.text }}>
                    {r.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
      <BottomNav />
    </>
  );
}
