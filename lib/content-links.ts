import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";

export function getNewsDetailHref(item: Pick<PublicNewsItem, "id"> | string | number) {
  const id = typeof item === "object" ? item.id : item;
  return `/zpravodaj/${encodeURIComponent(String(id))}`;
}

export function getEventDetailHref(item: Pick<PublicEventItem, "id"> | string | number) {
  const id = typeof item === "object" ? item.id : item;
  return `/kalendar/${encodeURIComponent(String(id))}`;
}

export function getPollDetailHref(item: Pick<PublicPoll, "id"> | string | number) {
  const id = typeof item === "object" ? item.id : item;
  return `/hlasovani/${encodeURIComponent(String(id))}`;
}

export function getContactDetailHref(item: Pick<PublicDirectoryItem, "id"> | string | number) {
  const id = typeof item === "object" ? item.id : item;
  return `/kontakty/${encodeURIComponent(String(id))}`;
}

export function getReportDetailHref(id: string) {
  return `/zhlasit/${encodeURIComponent(id)}`;
}
