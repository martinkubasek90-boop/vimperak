import { KontaktyPageClient } from "@/components/public/KontaktyPageClient";
import { getPublicDirectory } from "@/lib/public-content";

export default async function KontaktyPage({
  searchParams,
}: {
  searchParams?: Promise<{ k?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const directory = await getPublicDirectory();
  const initialCategory = params.k ?? "vše";

  return <KontaktyPageClient directory={directory} initialCategory={initialCategory} />;
}
