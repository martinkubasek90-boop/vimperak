import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminAccess } from "@/lib/admin-access";
import { getAdminDirectory, getAdminEvents, getAdminNews, getAdminReports } from "@/lib/admin-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const access = getAdminAccess(user.email);

  if (!access.allowed || !access.role || !access.permissions) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
          <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            Přístup nepovolen
          </div>
          <h1 className="mt-4 text-2xl font-black text-gray-900">
            Tento účet zatím nemá roli pro admin.
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Přihlášený jsi jako <strong>{user.email}</strong>, ale e-mail není v žádném
            z admin allowlistů. Přidej ho do příslušné env proměnné ve Vercelu nebo v
            lokálním `.env`.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/login"
              className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
            >
              Zpět na přihlášení
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Zpět na web
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [initialNews, initialEvents, initialDirectory, initialReports] = await Promise.all([
    getAdminNews(),
    getAdminEvents(),
    getAdminDirectory(),
    getAdminReports(),
  ]);

  return (
    <AdminDashboard
      email={user.email ?? "Neznámý uživatel"}
      role={access.role}
      initialNews={initialNews}
      initialEvents={initialEvents}
      initialDirectory={initialDirectory}
      initialReports={initialReports}
    />
  );
}
