import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = getAdminAccess(user?.email);
  if (user && access.allowed) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(199,230,255,0.7),_transparent_45%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-6 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Přihlášení</h2>
          <p className="mt-2 text-sm text-gray-500">
            Použij účet vytvořený v Supabase Auth. Pokud účet existuje, ale nemá roli,
            admin tě dál nepustí.
          </p>

          <div className="mt-6">
            <AdminLoginForm />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs leading-5 text-gray-600">
            Role se teď řídí env proměnnými `ADMIN_*_EMAILS`. Přesný model je popsaný v
            `ADMIN_ACCESS.md`.
          </div>

          <div className="mt-6">
            <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-900">
              ← Zpět na veřejný web
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Vimperáci
          </div>
          <h1 className="mt-5 max-w-lg text-3xl font-black tracking-tight text-gray-900">
            Přihlášení pro redakci, dispečink a schvalování obsahu.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
            Přístup řídí kombinace Supabase účtu a role podle allowlistu e-mailů.
            Staging heslo v `Basic Auth` zůstává jako vnější vrstva, ale skutečný admin
            už běží přes Supabase session.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Redaktor", "správa zpráv a akcí"],
              ["Dispečer", "závady a workflow hlášení"],
              ["Schvalovatel", "urgentní obsah a finální publikace"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-semibold text-gray-900">{title}</div>
                <div className="mt-1 text-xs leading-5 text-gray-500">{body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
