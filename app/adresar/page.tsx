import { AdresarPageClient } from "@/components/public/AdresarPageClient";
import { getPublicDirectory } from "@/lib/public-content";

export default async function AdresarPage({
  searchParams,
}: {
  searchParams?: Promise<{ k?: string; kategorie?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const directory = await getPublicDirectory();
  const initialCategory = params.kategorie ?? params.k ?? "vše";

  return <AdresarPageClient directory={directory} initialCategory={initialCategory} />;
}
