"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  createDirectoryAction,
  createEventAction,
  createNewsAction,
  updateReportStatusAction,
} from "@/app/admin/actions";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { AdminRole, AdminSection, getRoleConfig } from "@/lib/admin-access";
import type {
  AdminDirectoryItem,
  AdminEventItem,
  AdminNewsItem,
  AdminReportItem,
  AdminReportStatus,
} from "@/lib/admin-types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  ContactRound,
  LayoutDashboard,
  Newspaper,
  Plus,
  TrendingUp,
  Users,
  Vote,
  Wrench,
} from "lucide-react";

const NAV_ITEMS: Array<{
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "přehled", label: "Přehled", icon: LayoutDashboard },
  { id: "zpravodaj", label: "Zpravodaj", icon: Newspaper },
  { id: "akce", label: "Akce", icon: Calendar },
  { id: "kontakty", label: "Kontakty", icon: ContactRound },
  { id: "závady", label: "Závady", icon: Wrench },
];

const statusColor = {
  přijato: "bg-blue-100 text-blue-700",
  "v řešení": "bg-amber-100 text-amber-700",
  vyřešeno: "bg-green-100 text-green-700",
  zamítnuto: "bg-red-100 text-red-700",
} as const;

type AdminDashboardProps = {
  email: string;
  role: AdminRole;
  initialNews: AdminNewsItem[];
  initialEvents: AdminEventItem[];
  initialDirectory: AdminDirectoryItem[];
  initialReports: AdminReportItem[];
};

export function AdminDashboard({
  email,
  role,
  initialNews,
  initialEvents,
  initialDirectory,
  initialReports,
}: AdminDashboardProps) {
  const permissions = getRoleConfig(role);
  const allowedTabs = permissions.sections;
  const [tab, setTab] = useState<AdminSection>(allowedTabs[0] ?? "přehled");
  const [newsItems, setNewsItems] = useState(initialNews);
  const [eventItems, setEventItems] = useState(initialEvents);
  const [directoryItems, setDirectoryItems] = useState(initialDirectory);
  const [reportItems, setReportItems] = useState(initialReports);

  useEffect(() => {
    if (!allowedTabs.includes(tab)) {
      setTab(allowedTabs[0] ?? "přehled");
    }
  }, [allowedTabs, tab]);

  const urgentCount = useMemo(
    () => newsItems.filter((item) => item.urgent).length,
    [newsItems],
  );
  const pendingReports = useMemo(
    () => reportItems.filter((item) => item.status === "přijato").length,
    [reportItems],
  );
  const upcomingEvents = useMemo(
    () =>
      eventItems.filter(
        (item) => item.date >= new Date().toISOString().split("T")[0],
      ).length,
    [eventItems],
  );
  const cityContacts = useMemo(
    () => directoryItems.filter((item) => item.category === "město").length,
    [directoryItems],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden w-56 shrink-0 flex-col bg-brand-900 text-white md:flex">
        <div className="border-b border-brand-800 px-4 py-5">
          <div className="mb-0.5 text-xs font-bold uppercase tracking-widest text-brand-200">
            Admin
          </div>
          <div className="text-lg font-bold text-white">Vimperáci</div>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.filter(({ id }) => allowedTabs.includes(id)).map(
            ({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  tab === id
                    ? "bg-brand-700 font-medium text-white"
                    : "text-brand-300 hover:bg-brand-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ),
          )}
        </nav>

        <div className="space-y-3 border-t border-brand-800 p-4">
          <div className="rounded-xl border border-brand-700 bg-brand-800/80 p-3">
            <div className="text-xs uppercase tracking-widest text-brand-300">
              Přístup
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {permissions.label}
            </div>
            <div className="mt-1 text-xs text-brand-200">{email}</div>
          </div>
          <Link
            href="/"
            className="block text-xs text-brand-400 transition-colors hover:text-white"
          >
            ← Zpět na web
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="font-bold text-gray-900">
              {tab === "přehled" && "Přehled"}
              {tab === "zpravodaj" && "Zpravodaj — správa článků"}
              {tab === "akce" && "Akce — správa událostí"}
              {tab === "kontakty" && "Kontakty — adresář a městské odbory"}
              {tab === "závady" && "Hlášení závad"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{permissions.description}</p>
          </div>
          <AdminSignOutButton />
        </header>

        <main className="flex-1 overflow-auto p-6">
          {tab === "přehled" ? (
            <DashboardTab
              urgentCount={urgentCount}
              pendingReports={pendingReports}
              upcomingEvents={upcomingEvents}
              cityContacts={cityContacts}
              onSelectTab={(nextTab) => {
                if (allowedTabs.includes(nextTab)) setTab(nextTab);
              }}
            />
          ) : null}

          {tab === "zpravodaj" ? (
            <NewsTab
              canEdit={permissions.canCreateNews}
              canPublishUrgent={permissions.canPublishUrgent}
              items={newsItems}
              onItemsChange={setNewsItems}
            />
          ) : null}

          {tab === "akce" ? (
            <EventsTab
              canEdit={permissions.canCreateEvents}
              items={eventItems}
              onItemsChange={setEventItems}
            />
          ) : null}

          {tab === "kontakty" ? (
            <DirectoryTab
              canEdit={permissions.canManageDirectory}
              items={directoryItems}
              onItemsChange={setDirectoryItems}
            />
          ) : null}

          {tab === "závady" ? (
            <ReportsTab
              canResolve={permissions.canResolveReports}
              items={reportItems}
              onItemsChange={setReportItems}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function DashboardTab({
  urgentCount,
  pendingReports,
  upcomingEvents,
  cityContacts,
  onSelectTab,
}: {
  urgentCount: number;
  pendingReports: number;
  upcomingEvents: number;
  cityContacts: number;
  onSelectTab: (tab: AdminSection) => void;
}) {
  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Urgentní zprávy",
            value: urgentCount,
            icon: AlertTriangle,
            color: "text-red-600 bg-red-50 border-red-200",
          },
          {
            label: "Čekající závady",
            value: pendingReports,
            icon: Wrench,
            color: "text-amber-600 bg-amber-50 border-amber-200",
          },
          {
            label: "Nadcházející akce",
            value: upcomingEvents,
            icon: Calendar,
            color: "text-blue-600 bg-blue-50 border-blue-200",
          },
          {
            label: "Městské kontakty",
            value: cityContacts,
            icon: ContactRound,
            color: "text-brand-600 bg-brand-50 border-brand-200",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-xl border p-4 ${color}`}>
            <Icon className="mb-2 h-5 w-5" />
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-brand-500" /> Aktivita tento týden
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Nové závady</span>
              <span className="font-semibold">{pendingReports}</span>
            </div>
            <div className="flex justify-between">
              <span>Urgentní zprávy</span>
              <span className="font-semibold text-red-600">{urgentCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Nadcházející akce</span>
              <span className="font-semibold">{upcomingEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>Městské kontakty</span>
              <span className="font-semibold">{cityContacts}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-brand-500" /> Rychlé akce
          </h3>
          <div className="space-y-2">
            {[
              ["Přidat zprávu do zpravodaje", "zpravodaj"],
              ["Přidat akci / událost", "akce"],
              ["Přidat kontakt nebo odbor", "kontakty"],
              ["Zobrazit nová hlášení závad", "závady"],
            ].map(([label, nextTab]) => (
              <button
                key={label}
                type="button"
                onClick={() => onSelectTab(nextTab as AdminSection)}
                className="flex w-full items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-left text-sm text-brand-700 transition-colors hover:bg-brand-100"
              >
                {label}
                <Plus className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsTab({
  canEdit,
  canPublishUrgent,
  items,
  onItemsChange,
}: {
  canEdit: boolean;
  canPublishUrgent: boolean;
  items: AdminNewsItem[];
  onItemsChange: (items: AdminNewsItem[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "radnice",
    urgent: false,
  });

  function handleSave() {
    if (!canEdit || !form.title || !form.summary) return;

    setError("");
    startTransition(async () => {
      const result = await createNewsAction(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange([result.item, ...items]);
      setForm({ title: "", summary: "", category: "radnice", urgent: false });
      setShowForm(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div>
      {!canEdit ? (
        <ReadOnlyBanner text="Tahle role může zpravodaj pouze číst. Publikaci nechej na redaktorovi nebo schvalovateli." />
      ) : null}

      {saved ? (
        <SuccessBanner text="Zpráva byla uložená do Supabase." />
      ) : null}
      {error ? <ErrorBanner text={error} /> : null}

      {canEdit ? (
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="mb-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Přidat zprávu
        </button>
      ) : null}

      {showForm ? (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Nová zpráva</h3>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Titulek *"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <textarea
              placeholder="Perex / shrnutí *"
              value={form.summary}
              onChange={(event) =>
                setForm((current) => ({ ...current, summary: event.target.value }))
              }
              rows={2}
              className="resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <div className="flex items-center gap-3">
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {["radnice", "sport", "kultura", "upozornění", "komunita"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ),
                )}
              </select>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.urgent}
                  disabled={!canPublishUrgent}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, urgent: event.target.checked }))
                  }
                  className="accent-brand-600"
                />
                Urgentní
              </label>
            </div>
            {!canPublishUrgent ? (
              <p className="text-xs text-amber-700">
                Urgentní zprávy může zapnout až schvalovatel nebo superadmin.
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Ukládám..." : "Uložit"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            {item.urgent ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400">
                {item.category} · {item.date}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                item.urgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.urgent ? "Urgentní" : "Normální"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsTab({
  canEdit,
  items,
  onItemsChange,
}: {
  canEdit: boolean;
  items: AdminEventItem[];
  onItemsChange: (items: AdminEventItem[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "18:00",
    place: "",
    category: "kultura",
    free: true,
    price: "",
  });

  function handleSave() {
    if (!canEdit || !form.title || !form.date || !form.place) return;

    setError("");
    startTransition(async () => {
      const result = await createEventAction(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange([result.item, ...items]);
      setForm({
        title: "",
        date: "",
        time: "18:00",
        place: "",
        category: "kultura",
        free: true,
        price: "",
      });
      setShowForm(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div>
      {!canEdit ? (
        <ReadOnlyBanner text="Tahle role může akce pouze číst. Zakládání a editace patří redaktorům." />
      ) : null}

      {saved ? <SuccessBanner text="Akce byla uložená do Supabase." /> : null}
      {error ? <ErrorBanner text={error} /> : null}

      {canEdit ? (
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="mb-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Přidat akci
        </button>
      ) : null}

      {showForm ? (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Nová akce</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Název akce *"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              type="time"
              value={form.time}
              onChange={(event) =>
                setForm((current) => ({ ...current, time: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Místo konání *"
              value={form.place}
              onChange={(event) =>
                setForm((current) => ({ ...current, place: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              {["kultura", "sport", "kino", "úřad", "trhy"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label className="col-span-2 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.free}
                onChange={(event) =>
                  setForm((current) => ({ ...current, free: event.target.checked }))
                }
                className="accent-brand-600"
              />
              Vstup zdarma
            </label>
            {!form.free ? (
              <input
                placeholder="Cena (např. 150 Kč)"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: event.target.value }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            ) : null}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Ukládám..." : "Uložit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Zrušit
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <div className="shrink-0 rounded-lg border border-brand-100 bg-brand-50 px-2 py-1 text-center">
              <div className="text-base font-black text-brand-700">
                {new Date(item.date).getDate()}
              </div>
              <div className="text-xs text-brand-400">
                {new Date(item.date).toLocaleDateString("cs-CZ", { month: "short" })}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400">
                {item.place} · {item.time} · {item.category}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                item.free ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.free ? "Zdarma" : item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DirectoryTab({
  canEdit,
  items,
  onItemsChange,
}: {
  canEdit: boolean;
  items: AdminDirectoryItem[];
  onItemsChange: (items: AdminDirectoryItem[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    category: "město",
    cityDepartment: "central",
    phone: "",
    address: "",
    hours: "",
    note: "",
    email: "",
    website: "",
    sourceUrl: "",
    appointmentUrl: "",
    appointmentLabel: "",
  });

  function handleSave() {
    if (!canEdit || !form.name || !form.phone || !form.address) return;

    setError("");
    startTransition(async () => {
      const result = await createDirectoryAction(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange(
        [...items, result.item].sort((left, right) => {
          if (left.category === right.category) {
            return left.name.localeCompare(right.name, "cs");
          }
          return left.category.localeCompare(right.category, "cs");
        }),
      );
      setForm({
        name: "",
        category: "město",
        cityDepartment: "central",
        phone: "",
        address: "",
        hours: "",
        note: "",
        email: "",
        website: "",
        sourceUrl: "",
        appointmentUrl: "",
        appointmentLabel: "",
      });
      setShowForm(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div>
      {!canEdit ? (
        <ReadOnlyBanner text="Tahle role vidí kontakty a adresář, ale nesmí je upravovat." />
      ) : null}
      {saved ? <SuccessBanner text="Kontakt byl uložený do Supabase." /> : null}
      {error ? <ErrorBanner text={error} /> : null}

      {canEdit ? (
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="mb-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Přidat kontakt
        </button>
      ) : null}

      {showForm ? (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Nový kontakt / záznam</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Název *"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              {["město", "taxi", "restaurace", "lékař", "lékárna", "opravna", "sport", "ubytování", "obchod"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={form.cityDepartment}
              disabled={form.category !== "město"}
              onChange={(event) =>
                setForm((current) => ({ ...current, cityDepartment: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-400"
            >
              {[
                ["central", "Centrální kontakt"],
                ["vnitrni-veci", "Doklady a matrika"],
                ["doprava", "Doprava"],
                ["zivnostensky", "Podnikání"],
                ["vystavba", "Výstavba"],
                ["zivotni-prostredi", "Životní prostředí"],
                ["socialni", "Sociální oblast"],
                ["bezpecnost", "Bezpečnost"],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              placeholder="Telefon *"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Adresa *"
              value={form.address}
              onChange={(event) =>
                setForm((current) => ({ ...current, address: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="E-mail"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Provozní / úřední doba"
              value={form.hours}
              onChange={(event) =>
                setForm((current) => ({ ...current, hours: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Web"
              value={form.website}
              onChange={(event) =>
                setForm((current) => ({ ...current, website: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Zdroj URL"
              value={form.sourceUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, sourceUrl: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Objednání URL"
              value={form.appointmentUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, appointmentUrl: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <input
              placeholder="Text CTA objednání"
              value={form.appointmentLabel}
              onChange={(event) =>
                setForm((current) => ({ ...current, appointmentLabel: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <textarea
              placeholder="Poznámka"
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              rows={3}
              className="col-span-2 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Ukládám..." : "Uložit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Zrušit
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.category}
                  {item.cityDepartment ? ` · ${item.cityDepartment}` : ""}
                </p>
                <p className="mt-2 text-sm text-gray-600">{item.phone}</p>
                <p className="text-sm text-gray-500">{item.address}</p>
                {item.hours ? <p className="mt-1 text-xs text-gray-500">{item.hours}</p> : null}
                {item.email ? <p className="mt-1 text-xs text-gray-500">{item.email}</p> : null}
              </div>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab({
  canResolve,
  items,
  onItemsChange,
}: {
  canResolve: boolean;
  items: AdminReportItem[];
  onItemsChange: (items: AdminReportItem[]) => void;
}) {
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  function updateStatus(id: string | number, status: AdminReportStatus) {
    if (!canResolve) return;

    setError("");
    setPendingId(String(id));

    void updateReportStatusAction({ id: String(id), status }).then((result) => {
      setPendingId(null);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange(
        items.map((item) => (item.id === id ? result.item : item)),
      );
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {!canResolve ? (
        <ReadOnlyBanner text="Tahle role vidí stav hlášení, ale nesmí měnit workflow závad." />
      ) : null}
      {error ? <ErrorBanner text={error} /> : null}

      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                statusColor[item.status]
              }`}
            >
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {item.date}
            <span className="text-gray-300">·</span>
            {item.category}
            <div className="ml-auto flex gap-1.5">
              {(["přijato", "v řešení", "vyřešeno"] as AdminReportStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={!canResolve || pendingId === String(item.id)}
                    onClick={() => updateStatus(item.id, status)}
                    className={`rounded border px-2 py-1 text-xs transition-colors ${
                      item.status === status
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-brand-300"
                    } ${
                      !canResolve || pendingId === String(item.id)
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReadOnlyBanner({ text }: { text: string }) {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {text}
    </div>
  );
}

function SuccessBanner({ text }: { text: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
      <CheckCircle className="h-4 w-4" />
      {text}
    </div>
  );
}

function ErrorBanner({ text }: { text: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
      {text}
    </div>
  );
}
