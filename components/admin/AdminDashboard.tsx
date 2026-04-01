"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  bulkDeleteDirectoryAction,
  createDirectoryAction,
  createPollAction,
  deleteDirectoryAction,
  deleteEventAction,
  deleteNewsAction,
  deletePollAction,
  createEventAction,
  createNewsAction,
  getDirectorySyncPreviewAction,
  updateDirectoryAction,
  updateEventAction,
  updateNewsAction,
  updatePollAction,
  updateReportStatusAction,
} from "@/app/admin/actions";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { AdminRole, AdminSection, getRoleConfig } from "@/lib/admin-access";
import type {
  AdminAuditLogItem,
  AdminDirectoryItem,
  AdminEventItem,
  AdminNewsItem,
  AdminPollItem,
  AdminReportItem,
  AdminReportStatus,
} from "@/lib/admin-types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  ContactRound,
  Download,
  LayoutDashboard,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  Vote,
  Wrench,
} from "lucide-react";
import {
  MANUAL_DIRECTORY_CATEGORIES,
  cityDepartmentLabels,
  findPotentialDuplicateNames,
  getContactQualityIssues,
  getContactWorkflowStatus,
  sortDirectoryItems,
} from "@/lib/directory";

const NAV_ITEMS: Array<{
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "přehled", label: "Přehled", icon: LayoutDashboard },
  { id: "zpravodaj", label: "Zpravodaj", icon: Newspaper },
  { id: "akce", label: "Akce", icon: Calendar },
  { id: "ankety", label: "Ankety", icon: Vote },
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
  initialPolls: AdminPollItem[];
  initialDirectory: AdminDirectoryItem[];
  initialReports: AdminReportItem[];
  initialAuditLog: AdminAuditLogItem[];
};

export function AdminDashboard({
  email,
  role,
  initialNews,
  initialEvents,
  initialPolls,
  initialDirectory,
  initialReports,
  initialAuditLog,
}: AdminDashboardProps) {
  const permissions = getRoleConfig(role);
  const allowedTabs = permissions.sections;
  const [tab, setTab] = useState<AdminSection>(allowedTabs[0] ?? "přehled");
  const [newsItems, setNewsItems] = useState(initialNews);
  const [eventItems, setEventItems] = useState(initialEvents);
  const [pollItems, setPollItems] = useState(initialPolls);
  const [directoryItems, setDirectoryItems] = useState(initialDirectory);
  const [reportItems, setReportItems] = useState(initialReports);
  const [auditLogItems] = useState(initialAuditLog);

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
  const activePolls = useMemo(() => pollItems.length, [pollItems]);
  const contactsNeedingReview = useMemo(
    () =>
      directoryItems.filter((item) => getContactWorkflowStatus(item) === "review").length,
    [directoryItems],
  );
  const duplicateContactCount = useMemo(
    () => findPotentialDuplicateNames(directoryItems).size,
    [directoryItems],
  );
  const staleSyncedContacts = useMemo(
    () =>
      directoryItems.filter((item) =>
        getContactQualityIssues(item).some((issue) => issue.code === "stale-sync"),
      ).length,
    [directoryItems],
  );
  const recentActivity = useMemo(
    () =>
      [
        ...newsItems.slice(0, 3).map((item) => ({
          id: `news-${item.id}`,
          label: item.title,
          meta: `Zpravodaj · ${item.date}`,
          section: "zpravodaj" as AdminSection,
        })),
        ...eventItems.slice(0, 3).map((item) => ({
          id: `event-${item.id}`,
          label: item.title,
          meta: `Akce · ${item.date} ${item.time}`,
          section: "akce" as AdminSection,
        })),
        ...reportItems.slice(0, 3).map((item) => ({
          id: `report-${item.id}`,
          label: item.title,
          meta: `Závady · ${item.status}`,
          section: "závady" as AdminSection,
        })),
      ].slice(0, 6),
    [eventItems, newsItems, reportItems],
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
              {tab === "ankety" && "Ankety — správa hlasování"}
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
              activePolls={activePolls}
              cityContacts={cityContacts}
              contactsNeedingReview={contactsNeedingReview}
              duplicateContactCount={duplicateContactCount}
              staleSyncedContacts={staleSyncedContacts}
              recentActivity={recentActivity}
              auditLogItems={auditLogItems}
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

          {tab === "ankety" ? (
            <PollsTab
              canEdit={permissions.canManagePolls}
              items={pollItems}
              onItemsChange={setPollItems}
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
  activePolls,
  cityContacts,
  contactsNeedingReview,
  duplicateContactCount,
  staleSyncedContacts,
  recentActivity,
  auditLogItems,
  onSelectTab,
}: {
  urgentCount: number;
  pendingReports: number;
  upcomingEvents: number;
  activePolls: number;
  cityContacts: number;
  contactsNeedingReview: number;
  duplicateContactCount: number;
  staleSyncedContacts: number;
  recentActivity: Array<{
    id: string;
    label: string;
    meta: string;
    section: AdminSection;
  }>;
  auditLogItems: AdminAuditLogItem[];
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
            label: "Aktivní ankety",
            value: activePolls,
            icon: Vote,
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

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-semibold text-amber-900">Workflow obsahu</h3>
          <p className="mt-2 text-sm text-amber-800">
            {contactsNeedingReview} kontaktů čeká na kontrolu kvality a {pendingReports} hlášení je nově přijatých.
          </p>
          <button
            type="button"
            onClick={() => onSelectTab("kontakty")}
            className="mt-4 rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            Otevřít kontrolu kontaktů
          </button>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="text-sm font-semibold text-red-900">Rizika v datech</h3>
          <p className="mt-2 text-sm text-red-800">
            {duplicateContactCount} možných duplicit, {staleSyncedContacts} starých synců a {urgentCount} urgentních zpráv.
          </p>
          <button
            type="button"
            onClick={() => onSelectTab("kontakty")}
            className="mt-4 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-900 hover:bg-red-100"
          >
            Zobrazit problémové položky
          </button>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="text-sm font-semibold text-blue-900">Adresář města</h3>
          <p className="mt-2 text-sm text-blue-800">
            {cityContacts} městských kontaktů je v adresáři, z toho část je synchronizovaná z oficiálního webu.
          </p>
          <button
            type="button"
            onClick={() => onSelectTab("kontakty")}
            className="mt-4 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100"
          >
            Spravovat kontakty
          </button>
        </div>
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
              <span>Aktivní ankety</span>
              <span className="font-semibold">{activePolls}</span>
            </div>
            <div className="flex justify-between">
              <span>Městské kontakty</span>
              <span className="font-semibold">{cityContacts}</span>
            </div>
            <div className="flex justify-between">
              <span>Kontakty ke kontrole</span>
              <span className="font-semibold text-amber-700">{contactsNeedingReview}</span>
            </div>
            <div className="flex justify-between">
              <span>Možné duplicity</span>
              <span className="font-semibold text-red-700">{duplicateContactCount}</span>
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
              ["Založit anketu", "ankety"],
              ["Přidat ruční kontakt", "kontakty"],
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

        <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-brand-500" /> Poslední aktivita
          </h3>
          <div className="grid gap-2">
            {recentActivity.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.section)}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  <span className="block text-xs text-gray-500">{item.meta}</span>
                </span>
                <Plus className="h-3.5 w-3.5 shrink-0 text-brand-600" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-brand-500" /> Audit log
          </h3>
          <div className="space-y-2">
            {auditLogItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-100 px-3 py-2"
              >
                <div className="text-sm font-medium text-gray-900">{item.summary}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {item.entityType} · {item.action} · {new Date(item.createdAt).toLocaleString("cs-CZ")}
                  {item.actorEmail ? ` · ${item.actorEmail}` : ""}
                </div>
              </div>
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
  const [editingId, setEditingId] = useState<string | number | null>(null);
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

  function handleDelete(id: string | number) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await deleteNewsAction(String(id));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.filter((item) => String(item.id) !== result.id));
    });
  }

  function handleUpdate(item: AdminNewsItem) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await updateNewsAction({
        id: String(item.id),
        title: item.title,
        summary: item.summary,
        category: item.category,
        urgent: item.urgent,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange(items.map((current) => (current.id === item.id ? result.item : current)));
      setEditingId(null);
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
              {editingId === item.id ? (
                <NewsEditForm
                  item={item}
                  canPublishUrgent={canPublishUrgent}
                  isPending={isPending}
                  onCancel={() => setEditingId(null)}
                  onSave={handleUpdate}
                />
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.category} · {item.date}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
                </>
              )}
            </div>
            <div className="shrink-0 space-y-2 text-right">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                  item.urgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.urgent ? "Urgentní" : "Normální"}
              </span>
              {item.workflowStatus ? (
                <span className="block text-xs text-gray-500">workflow: {item.workflowStatus}</span>
              ) : null}
              {canEdit && editingId !== item.id ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-brand-300"
                  >
                    Upravit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Smazat
                  </button>
                </div>
              ) : null}
            </div>
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
  const [editingId, setEditingId] = useState<string | number | null>(null);
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

  function handleDelete(id: string | number) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await deleteEventAction(String(id));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.filter((item) => String(item.id) !== result.id));
    });
  }

  function handleUpdate(item: AdminEventItem) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await updateEventAction({
        id: String(item.id),
        title: item.title,
        date: item.date,
        time: item.time,
        place: item.place,
        category: item.category,
        free: item.free,
        price: item.price,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange(items.map((current) => (current.id === item.id ? result.item : current)));
      setEditingId(null);
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
              {editingId === item.id ? (
                <EventEditForm
                  item={item}
                  isPending={isPending}
                  onCancel={() => setEditingId(null)}
                  onSave={handleUpdate}
                />
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.place} · {item.time} · {item.category}
                  </p>
                </>
              )}
            </div>
            <div className="shrink-0 space-y-2 text-right">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                  item.free ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.free ? "Zdarma" : item.price}
              </span>
              {item.workflowStatus ? (
                <span className="block text-xs text-gray-500">workflow: {item.workflowStatus}</span>
              ) : null}
              {canEdit && editingId !== item.id ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-brand-300"
                  >
                    Upravit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Smazat
                  </button>
                </div>
              ) : null}
            </div>
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
  const duplicateIds = useMemo(() => findPotentialDuplicateNames(items), [items]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"vše" | "manual" | "sync">("vše");
  const [workflowFilter, setWorkflowFilter] = useState<"vše" | "draft" | "review" | "ready" | "live">("vše");
  const [qualityFilter, setQualityFilter] = useState<"vše" | "duplicates" | "missing-email" | "missing-hours" | "stale-sync">("vše");
  const [categoryFilter, setCategoryFilter] = useState<"vše" | string>("vše");
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [syncPreview, setSyncPreview] = useState<{
    total: number;
    locked: number;
    stale: number;
    missingEmail: number;
    missingHours: number;
    lastSyncedAt: string | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    category: "obchod",
    cityDepartment: "vše",
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
  const syncedItems = useMemo(
    () => items.filter((item) => item.sourceKind === "vimperk_web" || item.isLocked),
    [items],
  );
  const manualItems = useMemo(
    () => items.filter((item) => item.sourceKind !== "vimperk_web" && !item.isLocked),
    [items],
  );
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const workflow = getContactWorkflowStatus(item);
      const qualityIssues = getContactQualityIssues(item);
      const sourceMatches =
        sourceFilter === "vše" ||
        (sourceFilter === "sync" && (item.sourceKind === "vimperk_web" || item.isLocked)) ||
        (sourceFilter === "manual" && item.sourceKind !== "vimperk_web" && !item.isLocked);
      const workflowMatches = workflowFilter === "vše" || workflow === workflowFilter;
      const categoryMatches = categoryFilter === "vše" || item.category === categoryFilter;
      const qualityMatches =
        qualityFilter === "vše" ||
        (qualityFilter === "duplicates" && duplicateIds.has(item.id)) ||
        qualityIssues.some((issue) => issue.code === qualityFilter);
      const searchMatches =
        !query ||
        [
          item.name,
          item.phone,
          item.address,
          item.email ?? "",
          item.note ?? "",
          item.website ?? "",
          item.category,
          item.cityDepartment ? cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment : "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return sourceMatches && workflowMatches && categoryMatches && qualityMatches && searchMatches;
    });
  }, [categoryFilter, duplicateIds, items, qualityFilter, search, sourceFilter, workflowFilter]);
  const filteredSyncedItems = filteredItems.filter((item) => item.sourceKind === "vimperk_web" || item.isLocked);
  const filteredManualItems = filteredItems.filter((item) => item.sourceKind !== "vimperk_web" && !item.isLocked);
  const contactsNeedingReview = useMemo(
    () => items.filter((item) => getContactWorkflowStatus(item) === "review").length,
    [items],
  );
  const staleContacts = useMemo(
    () =>
      items.filter((item) =>
        getContactQualityIssues(item).some((issue) => issue.code === "stale-sync"),
      ).length,
    [items],
  );
  const missingEmailContacts = useMemo(
    () =>
      items.filter((item) =>
        getContactQualityIssues(item).some((issue) => issue.code === "missing-email"),
      ).length,
    [items],
  );

  useEffect(() => {
    startTransition(async () => {
      const result = await getDirectorySyncPreviewAction();
      if (result.ok) {
        setSyncPreview(result.summary);
      }
    });
  }, []);

  function getSourceLabel(item: AdminDirectoryItem) {
    if (item.sourceKind === "vimperk_web") return "sync z vimperk.cz";
    if (item.sourceKind === "import") return "import";
    return "ručně";
  }

  function exportCsv() {
    const headers = [
      "Název",
      "Kategorie",
      "Odbor",
      "Telefon",
      "E-mail",
      "Adresa",
      "Zdroj",
      "Workflow",
      "Kvalita",
    ];
    const rows = filteredItems.map((item) => {
      const quality = getContactQualityIssues(item)
        .map((issue) => issue.label)
        .join("; ");
      return [
        item.name,
        item.category,
        item.cityDepartment ? cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment : "",
        item.phone,
        item.email ?? "",
        item.address,
        getSourceLabel(item),
        getContactWorkflowStatus(item),
        quality,
      ];
    });
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vimperk-kontakty-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copySyncCommand() {
    await navigator.clipboard.writeText("node scripts/sync-vimperk-directory.mjs --dry-run");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

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
        sortDirectoryItems([...items, result.item]),
      );
      setForm({
        name: "",
        category: "obchod",
        cityDepartment: "vše",
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

  function handleDelete(id: string | number) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await deleteDirectoryAction(String(id));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.filter((item) => String(item.id) !== result.id));
      setSelectedIds((current) => current.filter((candidate) => candidate !== result.id));
    });
  }

  function handleUpdate(item: AdminDirectoryItem) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await updateDirectoryAction({
        id: String(item.id),
        name: item.name,
        category: item.category,
        cityDepartment: item.cityDepartment ?? "vše",
        phone: item.phone,
        address: item.address,
        hours: item.hours ?? "",
        note: item.note ?? "",
        email: item.email ?? "",
        website: item.website ?? "",
        sourceUrl: item.sourceUrl ?? "",
        appointmentUrl: item.appointmentUrl ?? "",
        appointmentLabel: item.appointmentLabel ?? "",
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onItemsChange(
        sortDirectoryItems(
          items.map((current) => (current.id === item.id ? result.item : current)),
        ),
      );
      setEditingId(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  function toggleSelection(id: string | number) {
    setSelectedIds((current) =>
      current.includes(String(id))
        ? current.filter((candidate) => candidate !== String(id))
        : [...current, String(id)],
    );
  }

  function handleBulkDelete() {
    if (!canEdit || selectedIds.length === 0) return;
    setError("");
    startTransition(async () => {
      const result = await bulkDeleteDirectoryAction(selectedIds);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.filter((item) => !result.ids.includes(String(item.id))));
      setSelectedIds([]);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  function workflowBadge(item: AdminDirectoryItem) {
    const status = getContactWorkflowStatus(item);
    const config = {
      draft: "bg-gray-100 text-gray-700",
      review: "bg-amber-100 text-amber-800",
      ready: "bg-blue-100 text-blue-700",
      live: "bg-green-100 text-green-700",
    } as const;
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config[status]}`}>
        {status}
      </span>
    );
  }

  return (
    <div>
      {!canEdit ? (
        <ReadOnlyBanner text="Tahle role vidí kontakty a adresář, ale nesmí je upravovat." />
      ) : null}
      {saved ? <SuccessBanner text="Kontakt byl uložený do Supabase." /> : null}
      {error ? <ErrorBanner text={error} /> : null}
      <p className="mb-5 text-sm text-gray-500">
        Oficiální městské kontakty a odbory se mají synchronizovat ze zdroje. Admin tu má spravovat hlavně ruční a doplňkové záznamy mimo oficiální web.
      </p>
      <div className="mb-5 grid gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Synchronizované kontakty</p>
          <p className="mt-1 text-amber-800">
            {syncedItems.length} záznamů je převzatých z vimperk.cz a jsou uzamčené proti ruční úpravě.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <p className="font-semibold">Ruční a doplňkové záznamy</p>
          <p className="mt-1 text-gray-600">
            {manualItems.length} záznamů můžeš zakládat a upravovat ručně přímo v adminu.
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Rizika v adresáři</p>
          <p className="mt-1 text-red-800">
            {duplicateIds.size} duplicit, {contactsNeedingReview} kontaktů ke kontrole.
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">Sync health</p>
          <p className="mt-1 text-blue-800">
            {syncPreview?.lastSyncedAt
              ? `Poslední sync ${new Date(syncPreview.lastSyncedAt).toLocaleString("cs-CZ")}`
              : "Sync preview zatím bez dat"}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Kontrola kvality a sync</h3>
            <p className="mt-1 text-sm text-gray-500">
              {staleContacts} starých synců, {missingEmailContacts} městských kontaktů bez e-mailu a {syncPreview?.missingHours ?? 0} položek bez otevírací doby.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                startTransition(async () => {
                  const result = await getDirectorySyncPreviewAction();
                  if (result.ok) setSyncPreview(result.summary);
                });
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Obnovit sync preview
            </button>
            <button
              type="button"
              onClick={copySyncCommand}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Copy className="h-4 w-4" />
              Zkopírovat sync příkaz
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export filtrováného CSV
            </button>
          </div>
        </div>
        {syncPreview ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {[
              ["Sync kontaktů", syncPreview.total],
              ["Uzamčeno", syncPreview.locked],
              ["Starý sync", syncPreview.stale],
              ["Bez e-mailu", syncPreview.missingEmail],
              ["Bez hodin", syncPreview.missingHours],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-5">
          <label className="lg:col-span-2">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Hledat
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Název, telefon, e-mail, adresa, odbor"
                className="w-full text-sm outline-none"
              />
            </div>
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Zdroj
            </span>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value as typeof sourceFilter)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="vše">Vše</option>
              <option value="manual">Jen ruční</option>
              <option value="sync">Jen sync</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Workflow
            </span>
            <select
              value={workflowFilter}
              onChange={(event) => setWorkflowFilter(event.target.value as typeof workflowFilter)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="vše">Vše</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="ready">Ready</option>
              <option value="live">Live</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Kvalita
            </span>
            <select
              value={qualityFilter}
              onChange={(event) => setQualityFilter(event.target.value as typeof qualityFilter)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="vše">Vše</option>
              <option value="duplicates">Možné duplicity</option>
              <option value="missing-email">Bez e-mailu</option>
              <option value="missing-hours">Bez hodin</option>
              <option value="stale-sync">Starý sync</option>
            </select>
          </label>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Kategorie
            </span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="vše">Všechny kategorie</option>
              {[...MANUAL_DIRECTORY_CATEGORIES, "město"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          {canEdit ? (
            <div className="lg:col-span-2 flex flex-wrap items-end gap-2">
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0 || isPending}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Smazat vybrané ({selectedIds.length})
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(filteredManualItems.map((item) => String(item.id)))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Vybrat ruční záznamy
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Vyčistit výběr
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {canEdit ? (
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="mb-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Přidat ruční kontakt
        </button>
      ) : null}

      {showForm ? (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-2 font-semibold">Nový ruční kontakt</h3>
          <p className="mb-4 text-sm text-gray-500">
            Slouží pro doplňkové kontakty mimo oficiální městské odbory. Odbory a úřední kontakty přicházejí ze synchronizace.
          </p>
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
              {MANUAL_DIRECTORY_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={form.cityDepartment}
              disabled
              onChange={(event) =>
                setForm((current) => ({ ...current, cityDepartment: event.target.value }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-400"
            >
              {[
                ["vše", "Není městský odbor"],
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

      {filteredSyncedItems.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Oficiální synchronizované kontakty</h3>
          <div className="flex flex-col gap-2">
            {filteredSyncedItems.map((item) => {
              const issues = getContactQualityIssues(item);
              return (
              <div key={`synced-${item.id}`} className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.category}
                      {item.cityDepartment ? ` · ${item.cityDepartment}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{item.phone}</p>
                    <p className="text-sm text-gray-600">{item.address}</p>
                    {item.hours ? <p className="mt-1 text-xs text-gray-600">{item.hours}</p> : null}
                    {item.email ? <p className="mt-1 text-xs text-gray-600">{item.email}</p> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-white px-2 py-0.5">{getSourceLabel(item)}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">uzamčeno pro sync</span>
                      {workflowBadge(item)}
                      {duplicateIds.has(item.id) ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">duplicitní</span>
                      ) : null}
                    </div>
                    {issues.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {issues.map((issue) => (
                          <span
                            key={`${item.id}-${issue.code}`}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              issue.severity === "critical"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {issue.label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="shrink-0 space-y-2 text-right">
                    <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {filteredManualItems.map((item) => {
          const issues = getContactQualityIssues(item);
          const selected = selectedIds.includes(String(item.id));
          return (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              {canEdit ? (
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSelection(item.id)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                {editingId === item.id ? (
                  <DirectoryEditForm
                    item={item}
                    isPending={isPending}
                    onCancel={() => setEditingId(null)}
                    onSave={handleUpdate}
                  />
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.category}
                      {item.cityDepartment ? ` · ${item.cityDepartment}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{item.phone}</p>
                    <p className="text-sm text-gray-500">{item.address}</p>
                    {item.hours ? <p className="mt-1 text-xs text-gray-500">{item.hours}</p> : null}
                    {item.email ? <p className="mt-1 text-xs text-gray-500">{item.email}</p> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">{getSourceLabel(item)}</span>
                      {workflowBadge(item)}
                      {duplicateIds.has(item.id) ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">duplicitní</span>
                      ) : null}
                      {item.isLocked ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">uzamčeno pro sync</span> : null}
                    </div>
                    {issues.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {issues.map((issue) => (
                          <span
                            key={`${item.id}-${issue.code}`}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              issue.severity === "critical"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {issue.label}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <div className="shrink-0 space-y-2 text-right">
                <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      {item.category}
                    </span>
                    {canEdit && editingId !== item.id ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(item.id)}
                          className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-brand-300"
                        >
                          Upravit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Smazat
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )})}
        {filteredManualItems.length === 0 && filteredSyncedItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
            Filtrům neodpovídá žádný kontakt. Zkus rozšířit hledání nebo upravit workflow/kvalitu.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PollsTab({
  canEdit,
  items,
  onItemsChange,
}: {
  canEdit: boolean;
  items: AdminPollItem[];
  onItemsChange: (items: AdminPollItem[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    question: "",
    category: "obecné",
    endsAt: "",
    options: ["", ""],
  });

  function handleCreate() {
    if (!canEdit || !form.question || !form.endsAt) return;
    setError("");
    startTransition(async () => {
      const result = await createPollAction(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange([...items, result.item]);
      setForm({ question: "", category: "obecné", endsAt: "", options: ["", ""] });
      setShowForm(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleUpdate(item: AdminPollItem) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await updatePollAction({
        id: String(item.id),
        question: item.question,
        category: item.category,
        endsAt: item.endsAt,
        options: item.options.map((option) => ({ id: String(option.id), text: option.text })),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.map((current) => (current.id === item.id ? result.item : current)));
      setEditingId(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleDelete(id: string | number) {
    if (!canEdit) return;
    setError("");
    startTransition(async () => {
      const result = await deletePollAction(String(id));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onItemsChange(items.filter((item) => String(item.id) !== result.id));
    });
  }

  return (
    <div>
      {!canEdit ? <ReadOnlyBanner text="Tahle role může ankety pouze číst." /> : null}
      {saved ? <SuccessBanner text="Anketa byla uložená do Supabase." /> : null}
      {error ? <ErrorBanner text={error} /> : null}

      {canEdit ? (
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="mb-5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Přidat anketu
        </button>
      ) : null}

      {showForm ? (
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Nová anketa</h3>
          <div className="space-y-3">
            <input
              placeholder="Otázka *"
              value={form.question}
              onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {["infrastruktura", "kultura", "doprava", "obecné"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.endsAt}
                onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <input
                  key={index}
                  placeholder={`Možnost ${index + 1}`}
                  value={option}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      options: current.options.map((value, optionIndex) =>
                        optionIndex === index ? event.target.value : value,
                      ),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, options: [...current.options, ""] }))
                }
                className="rounded border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50"
              >
                Přidat možnost
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={isPending}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-60"
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

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
            {editingId === item.id ? (
              <PollEditForm
                item={item}
                isPending={isPending}
                onCancel={() => setEditingId(null)}
                onSave={handleUpdate}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.question}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {item.category} · do {item.endsAt} · {item.totalVotes} hlasů
                  </p>
                  {item.workflowStatus ? (
                    <p className="mt-1 text-xs text-gray-500">workflow: {item.workflowStatus}</p>
                  ) : null}
                  <ul className="mt-3 space-y-1">
                    {item.options.map((option) => (
                      <li key={option.id} className="text-sm text-gray-600">
                        {option.text} <span className="text-xs text-gray-400">({option.votes})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-brand-300"
                    >
                      Upravit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      Smazat
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsEditForm({
  item,
  canPublishUrgent,
  isPending,
  onCancel,
  onSave,
}: {
  item: AdminNewsItem;
  canPublishUrgent: boolean;
  isPending: boolean;
  onCancel: () => void;
  onSave: (item: AdminNewsItem) => void;
}) {
  const [draft, setDraft] = useState(item);
  return (
    <div className="space-y-2">
      <input
        value={draft.title}
        onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
        className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <textarea
        value={draft.summary}
        onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))}
        rows={2}
        className="w-full resize-none rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={draft.category}
          onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
          className="rounded border border-gray-200 px-2 py-1 text-sm"
        >
          {["radnice", "sport", "kultura", "upozornění", "komunita"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={draft.urgent}
            disabled={!canPublishUrgent}
            onChange={(event) => setDraft((current) => ({ ...current, urgent: event.target.checked }))}
          />
          Urgentní
        </label>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave(draft)}
          className="rounded bg-brand-600 px-2 py-1 text-xs text-white disabled:opacity-60"
        >
          Uložit
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-200 px-2 py-1 text-xs">
          Zrušit
        </button>
      </div>
    </div>
  );
}

function EventEditForm({
  item,
  isPending,
  onCancel,
  onSave,
}: {
  item: AdminEventItem;
  isPending: boolean;
  onCancel: () => void;
  onSave: (item: AdminEventItem) => void;
}) {
  const [draft, setDraft] = useState(item);
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <input
        value={draft.title}
        onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
        className="sm:col-span-2 rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        type="date"
        value={draft.date}
        onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        type="time"
        value={draft.time}
        onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.place}
        onChange={(event) => setDraft((current) => ({ ...current, place: event.target.value }))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <select
        value={draft.category}
        onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      >
        {["kultura", "sport", "kino", "úřad", "trhy"].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <label className="sm:col-span-2 flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={draft.free}
          onChange={(event) => setDraft((current) => ({ ...current, free: event.target.checked }))}
        />
        Vstup zdarma
      </label>
      {!draft.free ? (
        <input
          value={draft.price}
          onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
          className="sm:col-span-2 rounded border border-gray-200 px-2 py-1 text-sm"
        />
      ) : null}
      <div className="sm:col-span-2 flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave(draft)}
          className="rounded bg-brand-600 px-2 py-1 text-xs text-white disabled:opacity-60"
        >
          Uložit
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-200 px-2 py-1 text-xs">
          Zrušit
        </button>
      </div>
    </div>
  );
}

function DirectoryEditForm({
  item,
  isPending,
  onCancel,
  onSave,
}: {
  item: AdminDirectoryItem;
  isPending: boolean;
  onCancel: () => void;
  onSave: (item: AdminDirectoryItem) => void;
}) {
  const [draft, setDraft] = useState(item);
  const isLocked = Boolean(item.isLocked);
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {isLocked ? (
        <p className="sm:col-span-2 text-xs text-amber-700">
          Tento kontakt je synchronizovaný z oficiálního zdroje a ručně se neupravuje.
        </p>
      ) : null}
      <input
        value={draft.name}
        onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
        disabled={isLocked}
        className="sm:col-span-2 rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <select
        value={draft.category}
        onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      >
        {MANUAL_DIRECTORY_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={draft.cityDepartment ?? "vše"}
        onChange={(event) => setDraft((current) => ({ ...current, cityDepartment: event.target.value }))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
        disabled={isLocked || draft.category !== "město"}
      >
        <option value="vše">Bez odboru</option>
        <option value="central">Centrální kontakt</option>
        <option value="vnitrni-veci">Doklady a matrika</option>
        <option value="doprava">Doprava</option>
        <option value="zivnostensky">Podnikání</option>
        <option value="vystavba">Výstavba</option>
        <option value="zivotni-prostredi">Životní prostředí</option>
        <option value="socialni">Sociální oblast</option>
        <option value="bezpecnost">Bezpečnost</option>
      </select>
      <input
        value={draft.phone}
        onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.address}
        onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.hours ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, hours: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.email ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.website ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, website: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.sourceUrl ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, sourceUrl: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.appointmentUrl ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, appointmentUrl: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <input
        value={draft.appointmentLabel ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, appointmentLabel: event.target.value }))}
        disabled={isLocked}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <textarea
        value={draft.note ?? ""}
        onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
        disabled={isLocked}
        rows={2}
        className="sm:col-span-2 resize-none rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <div className="sm:col-span-2 flex gap-2">
        <button
          type="button"
          disabled={isPending || isLocked}
          onClick={() => onSave(draft)}
          className="rounded bg-brand-600 px-2 py-1 text-xs text-white disabled:opacity-60"
        >
          Uložit
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-200 px-2 py-1 text-xs">
          Zrušit
        </button>
      </div>
    </div>
  );
}

function PollEditForm({
  item,
  isPending,
  onCancel,
  onSave,
}: {
  item: AdminPollItem;
  isPending: boolean;
  onCancel: () => void;
  onSave: (item: AdminPollItem) => void;
}) {
  const [draft, setDraft] = useState(item);

  return (
    <div className="space-y-3">
      <input
        value={draft.question}
        onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))}
        className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <select
          value={draft.category}
          onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
          className="rounded border border-gray-200 px-2 py-1 text-sm"
        >
          {["infrastruktura", "kultura", "doprava", "obecné"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={draft.endsAt}
          onChange={(event) => setDraft((current) => ({ ...current, endsAt: event.target.value }))}
          className="rounded border border-gray-200 px-2 py-1 text-sm"
        />
      </div>
      <div className="space-y-2">
        {draft.options.map((option, index) => (
          <input
            key={`${option.id}-${index}`}
            value={option.text}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                options: current.options.map((candidate, optionIndex) =>
                  optionIndex === index
                    ? { ...candidate, text: event.target.value }
                    : candidate,
                ),
              }))
            }
            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            setDraft((current) => ({
              ...current,
              options: [
                ...current.options,
                { id: `new-${current.options.length + 1}`, text: "", votes: 0 },
              ],
            }))
          }
          className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
        >
          Přidat možnost
        </button>
        {draft.options.length > 2 ? (
          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                options: current.options.slice(0, -1),
              }))
            }
            className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
          >
            Odebrat poslední
          </button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave(draft)}
          className="rounded bg-brand-600 px-2 py-1 text-xs text-white disabled:opacity-60"
        >
          Uložit
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-gray-200 px-2 py-1 text-xs">
          Zrušit
        </button>
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
