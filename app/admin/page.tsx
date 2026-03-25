"use client";

import { useState } from "react";
import Link from "next/link";
import { news as mockNews, events as mockEvents, reports as mockReports } from "@/lib/admin-mock";
import {
  LayoutDashboard, Newspaper, Calendar, Wrench, Plus,
  CheckCircle, AlertTriangle, Clock, TrendingUp, Users, Vote
} from "lucide-react";

export default function AdminPage() {
  const [tab, setTab] = useState<"přehled" | "zpravodaj" | "akce" | "závady">("přehled");

  const urgentCount = mockNews.filter((n) => n.urgent).length;
  const pendingReports = mockReports.filter((r) => r.status === "přijato").length;
  const upcomingEvents = mockEvents.filter((e) => e.date >= new Date().toISOString().split("T")[0]).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="px-4 py-5 border-b border-brand-800">
          <div className="font-bold text-brand-200 text-xs uppercase tracking-widest mb-0.5">Admin</div>
          <div className="font-bold text-white text-lg">Vimperk</div>
        </div>
        <nav className="flex-1 py-4">
          {[
            { id: "přehled",   label: "Přehled",    icon: LayoutDashboard },
            { id: "zpravodaj", label: "Zpravodaj",  icon: Newspaper },
            { id: "akce",      label: "Akce",       icon: Calendar },
            { id: "závady",    label: "Závady",     icon: Wrench },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as typeof tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                tab === id ? "bg-brand-700 text-white font-medium" : "text-brand-300 hover:bg-brand-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-800">
          <Link href="/" className="text-xs text-brand-400 hover:text-white transition-colors">
            ← Zpět na web
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold text-gray-900">
            {tab === "přehled" && "Přehled"}
            {tab === "zpravodaj" && "Zpravodaj — správa článků"}
            {tab === "akce" && "Akce — správa událostí"}
            {tab === "závady" && "Hlášení závad"}
          </h1>
          {tab !== "přehled" && (
            <button className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" />
              Přidat nový
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {tab === "přehled" && <DashboardTab urgentCount={urgentCount} pendingReports={pendingReports} upcomingEvents={upcomingEvents} />}
          {tab === "zpravodaj" && <NewsTab />}
          {tab === "akce" && <EventsTab />}
          {tab === "závady" && <ReportsTab />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ urgentCount, pendingReports, upcomingEvents }: {
  urgentCount: number; pendingReports: number; upcomingEvents: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Urgentní zprávy",    value: urgentCount,    icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
          { label: "Čekající závady",    value: pendingReports, icon: Wrench,        color: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Nadcházející akce",  value: upcomingEvents, icon: Calendar,      color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Aktivní hlasování",  value: 2,              icon: Vote,          color: "text-brand-600 bg-brand-50 border-brand-200" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`border rounded-xl p-4 ${color}`}>
            <Icon className="w-5 h-5 mb-2" />
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" /> Aktivita tento týden
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Nové závady</span><span className="font-semibold">7</span></div>
            <div className="flex justify-between"><span>Vyřešené závady</span><span className="font-semibold text-green-600">4</span></div>
            <div className="flex justify-between"><span>Hlasů v anketách</span><span className="font-semibold">128</span></div>
            <div className="flex justify-between"><span>Nové zprávy</span><span className="font-semibold">3</span></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" /> Rychlé akce
          </h3>
          <div className="space-y-2">
            {[
              ["Přidat zprávu do zpravodaje", "zpravodaj"],
              ["Přidat akci / událost", "akce"],
              ["Zobrazit nová hlášení závad", "závady"],
            ].map(([label, t]) => (
              <button
                key={label}
                onClick={() => {}}
                className="w-full text-left text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
              >
                {label}
                <Plus className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News Tab ──────────────────────────────────────────────────────────────────
function NewsTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", category: "radnice", urgent: false });
  const [items, setItems] = useState(mockNews);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!form.title || !form.summary) return;
    setItems([{ id: Date.now(), ...form, date: new Date().toISOString().split("T")[0] }, ...items]);
    setForm({ title: "", summary: "", category: "radnice", urgent: false });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      {saved && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 text-sm">
          <CheckCircle className="w-4 h-4" /> Zpráva byla přidána.
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors mb-5"
      >
        <Plus className="w-4 h-4" />
        Přidat zprávu
      </button>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h3 className="font-semibold mb-4">Nová zpráva</h3>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Titulek *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <textarea
              placeholder="Perex / shrnutí *"
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={2}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none"
            />
            <div className="flex gap-3 items-center">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {["radnice", "sport", "kultura", "upozornění", "komunita"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.urgent}
                  onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))}
                  className="accent-brand-600"
                />
                Urgentní
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700">Uložit</button>
              <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Zrušit</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
            {item.urgent && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.category} · {item.date}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${item.urgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
              {item.urgent ? "Urgentní" : "Normální"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Events Tab ────────────────────────────────────────────────────────────────
function EventsTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "18:00", place: "", category: "kultura", free: true, price: "" });
  const [items, setItems] = useState(mockEvents);

  function handleSave() {
    if (!form.title || !form.date || !form.place) return;
    setItems([{ id: Date.now(), ...form }, ...items]);
    setForm({ title: "", date: "", time: "18:00", place: "", category: "kultura", free: true, price: "" });
    setShowForm(false);
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors mb-5"
      >
        <Plus className="w-4 h-4" />
        Přidat akci
      </button>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h3 className="font-semibold mb-4">Nová akce</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Název akce *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
            <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
            <input placeholder="Místo konání *" value={form.place} onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400">
              {["kultura", "sport", "kino", "úřad", "trhy"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm cursor-pointer col-span-2">
              <input type="checkbox" checked={form.free} onChange={(e) => setForm((f) => ({ ...f, free: e.target.checked }))} className="accent-brand-600" />
              Vstup zdarma
            </label>
            {!form.free && (
              <input placeholder="Cena (např. 150 Kč)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700">Uložit</button>
            <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Zrušit</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="bg-brand-50 border border-brand-100 rounded-lg px-2 py-1 text-center shrink-0">
              <div className="text-base font-black text-brand-700">{new Date(item.date).getDate()}</div>
              <div className="text-xs text-brand-400">{new Date(item.date).toLocaleDateString("cs-CZ", { month: "short" })}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.place} · {item.time} · {item.category}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${item.free ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
              {item.free ? "Zdarma" : item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reports Tab ───────────────────────────────────────────────────────────────
const statusColor = {
  "přijato":   "bg-blue-100 text-blue-700",
  "v řešení":  "bg-amber-100 text-amber-700",
  "vyřešeno":  "bg-green-100 text-green-700",
  "zamítnuto": "bg-red-100 text-red-700",
} as const;

function ReportsTab() {
  const [items, setItems] = useState(mockReports);

  function updateStatus(id: number, status: string) {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((r) => (
        <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-semibold text-sm text-gray-900">{r.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[r.status as keyof typeof statusColor]}`}>
              {r.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {r.date}
            <span className="text-gray-300">·</span>
            {r.category}
            <div className="ml-auto flex gap-1.5">
              {["přijato", "v řešení", "vyřešeno"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(r.id, s)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    r.status === s ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 hover:border-brand-300 text-gray-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
