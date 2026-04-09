import { MojePageClient } from "@/components/public/MojePageClient";
import { getPublicDirectory } from "@/lib/public-content";

export default async function UlozenePage() {
  const directory = await getPublicDirectory();
  return <MojePageClient directory={directory} />;
}
