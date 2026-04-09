import { buildDirectorySearchIndex } from "@/lib/directory";
import {
  getContactDetailHref,
  getEventDetailHref,
  getNewsDetailHref,
  getPollDetailHref,
} from "@/lib/content-links";
import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";

export type SearchResultItem = {
  id: string;
  type: "news" | "event" | "directory" | "poll";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  score?: number;
};

const SEARCH_TYPE_ORDER: SearchResultItem["type"][] = ["news", "event", "directory", "poll"];

export function getSearchTypeLabel(type: SearchResultItem["type"]) {
  switch (type) {
    case "news":
      return "Zprávy";
    case "event":
      return "Akce";
    case "directory":
      return "Kontakty";
    case "poll":
      return "Ankety";
  }
}

function scoreSearchResult(item: SearchResultItem, query: string) {
  if (!query) return 1;
  const normalizedQuery = query.trim().toLowerCase();
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle.toLowerCase();
  const keywords = item.keywords.toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 95;
  if (title.includes(normalizedQuery)) score += 70;
  if (subtitle.includes(normalizedQuery)) score += 35;
  if (keywords.includes(normalizedQuery)) score += 25;

  for (const term of terms) {
    if (title.includes(term)) score += 18;
    if (subtitle.includes(term)) score += 8;
    if (keywords.includes(term)) score += 6;
  }

  return score;
}

export function searchIndex(
  index: SearchResultItem[],
  input: {
    query: string;
    type?: "all" | SearchResultItem["type"];
    limit?: number;
  },
) {
  const normalizedQuery = input.query.trim().toLowerCase();

  return index
    .filter((item) => (input.type && input.type !== "all" ? item.type === input.type : true))
    .map((item) => ({
      ...item,
      score: scoreSearchResult(item, normalizedQuery),
    }))
    .filter((item) => !normalizedQuery || item.score > 0)
    .sort((left, right) => {
      if ((right.score ?? 0) !== (left.score ?? 0)) return (right.score ?? 0) - (left.score ?? 0);
      return left.title.localeCompare(right.title, "cs");
    })
    .slice(0, input.limit ?? 40);
}

export function groupSearchResults(results: SearchResultItem[]) {
  return SEARCH_TYPE_ORDER.map((type) => ({
    type,
    label: getSearchTypeLabel(type),
    items: results.filter((item) => item.type === type),
  })).filter((group) => group.items.length > 0);
}

export function buildSearchIndex(input: {
  news: PublicNewsItem[];
  events: PublicEventItem[];
  directory: PublicDirectoryItem[];
  polls: PublicPoll[];
}) {
  return [
    ...input.news.map<SearchResultItem>((item) => ({
      id: `news-${item.id}`,
      type: "news",
      title: item.title,
      subtitle: `${item.category} · ${item.date}`,
      href: getNewsDetailHref(item),
      keywords: [item.title, item.summary, item.category, item.date].join(" ").toLowerCase(),
    })),
    ...input.events.map<SearchResultItem>((item) => ({
      id: `event-${item.id}`,
      type: "event",
      title: item.title,
      subtitle: `${item.place} · ${item.date} ${item.time}`,
      href: getEventDetailHref(item),
      keywords: [item.title, item.description, item.place, item.category, item.date, item.time]
        .join(" ")
        .toLowerCase(),
    })),
    ...input.directory.map<SearchResultItem>((item) => ({
      id: `directory-${item.id}`,
      type: "directory",
      title: item.name,
      subtitle: `${item.category} · ${item.address}`,
      href: getContactDetailHref(item),
      keywords: buildDirectorySearchIndex(item),
    })),
    ...input.polls.map<SearchResultItem>((item) => ({
      id: `poll-${item.id}`,
      type: "poll",
      title: item.question,
      subtitle: `${item.category} · do ${item.endsAt}`,
      href: getPollDetailHref(item),
      keywords: [item.question, item.category, item.endsAt, ...item.options.map((option) => option.text)]
        .join(" ")
        .toLowerCase(),
    })),
  ];
}
