import type { AdminDirectoryItem, AdminWorkflowStatus } from "@/lib/admin-types";
import type { PublicDirectoryItem } from "@/lib/public-content";

export const DIRECTORY_CATEGORIES = [
  "město",
  "taxi",
  "restaurace",
  "lékař",
  "lékárna",
  "opravna",
  "sport",
  "ubytování",
  "obchod",
] as const;

export const MANUAL_DIRECTORY_CATEGORIES = DIRECTORY_CATEGORIES.filter(
  (category) => category !== "město",
);

export const CITY_DEPARTMENTS = [
  "central",
  "vnitrni-veci",
  "doprava",
  "zivnostensky",
  "vystavba",
  "zivotni-prostredi",
  "socialni",
  "kultura",
  "bezpecnost",
] as const;

export const cityDepartmentLabels: Record<string, string> = {
  central: "Centrální kontakt",
  "vnitrni-veci": "Doklady a matrika",
  doprava: "Doprava",
  zivnostensky: "Podnikání",
  vystavba: "Výstavba",
  "zivotni-prostredi": "Životní prostředí",
  socialni: "Sociální oblast",
  kultura: "Kultura",
  bezpecnost: "Bezpečnost",
};

type DirectoryLike = Pick<
  AdminDirectoryItem,
  | "id"
  | "name"
  | "category"
  | "cityDepartment"
  | "phone"
  | "address"
  | "hours"
  | "note"
  | "email"
  | "website"
  | "sourceUrl"
  | "appointmentUrl"
  | "appointmentLabel"
  | "sourceKind"
  | "sourceSyncedAt"
  | "isLocked"
>;

export type DirectoryFormInput = {
  name: string;
  category: string;
  cityDepartment: string;
  phone: string;
  address: string;
  hours: string;
  note: string;
  email: string;
  website: string;
  sourceUrl: string;
  appointmentUrl: string;
  appointmentLabel: string;
};

export type DirectoryValidationResult = {
  ok: boolean;
  errors: string[];
  normalized: DirectoryFormInput;
};

export type ContactQualityIssue = {
  code:
    | "missing-phone"
    | "missing-address"
    | "invalid-email"
    | "invalid-website"
    | "invalid-source-url"
    | "invalid-appointment-url"
    | "missing-hours"
    | "missing-email"
    | "missing-website"
    | "stale-sync";
  label: string;
  severity: "critical" | "warning";
};

export type ContactWorkflowStatus = "draft" | "review" | "ready" | "live";

function trim(value: string) {
  return value.trim();
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizePhone(phone: string) {
  return normalizeWhitespace(phone)
    .replace(/[^\d+ ]/g, "")
    .replace(/\s{2,}/g, " ");
}

function normalizeOptionalUrl(value: string) {
  const trimmed = trim(value);
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9;
}

export function normalizeDirectoryInput(input: DirectoryFormInput): DirectoryFormInput {
  return {
    name: normalizeWhitespace(input.name),
    category: trim(input.category),
    cityDepartment: trim(input.cityDepartment || "vše"),
    phone: normalizePhone(input.phone),
    address: normalizeWhitespace(input.address),
    hours: normalizeWhitespace(input.hours),
    note: trim(input.note),
    email: trim(input.email).toLowerCase(),
    website: normalizeOptionalUrl(input.website),
    sourceUrl: normalizeOptionalUrl(input.sourceUrl),
    appointmentUrl: normalizeOptionalUrl(input.appointmentUrl),
    appointmentLabel: trim(input.appointmentLabel),
  };
}

export function validateDirectoryInput(input: DirectoryFormInput): DirectoryValidationResult {
  const normalized = normalizeDirectoryInput(input);
  const errors: string[] = [];

  if (!normalized.name) errors.push("Název kontaktu je povinný.");
  if (!normalized.address) errors.push("Adresa je povinná.");
  if (!normalized.phone) errors.push("Telefon je povinný.");
  if (normalized.phone && !isValidPhone(normalized.phone)) {
    errors.push("Telefon nevypadá jako platné číslo.");
  }
  if (!DIRECTORY_CATEGORIES.includes(normalized.category as (typeof DIRECTORY_CATEGORIES)[number])) {
    errors.push("Kategorie kontaktu není podporovaná.");
  }
  if (normalized.category === "město") {
    errors.push("Oficiální městské kontakty se nezakládají ručně.");
  }
  if (normalized.email && !isValidEmail(normalized.email)) {
    errors.push("E-mail nemá platný formát.");
  }
  if (!isValidHttpUrl(normalized.website)) {
    errors.push("Web musí být platná URL adresa.");
  }
  if (!isValidHttpUrl(normalized.sourceUrl)) {
    errors.push("Zdroj URL musí být platná URL adresa.");
  }
  if (!isValidHttpUrl(normalized.appointmentUrl)) {
    errors.push("URL pro objednání musí být platná URL adresa.");
  }
  if (normalized.appointmentUrl && !normalized.appointmentLabel) {
    errors.push("K online objednání doplň i text CTA.");
  }

  return {
    ok: errors.length === 0,
    errors,
    normalized,
  };
}

export function buildDirectorySearchIndex(item: Pick<
  PublicDirectoryItem,
  | "name"
  | "category"
  | "cityDepartment"
  | "phone"
  | "address"
  | "note"
  | "email"
  | "website"
>) {
  const synonyms: Record<string, string[]> = {
    město: ["radnice", "úřad", "městský úřad", "odbory", "matrika", "podatelna"],
    lékař: ["doktor", "ordinace", "praktik", "zubař", "pediatr"],
    lékárna: ["apatyka", "léky"],
    taxi: ["odvoz", "taxík"],
    restaurace: ["gastro", "jídlo", "oběd", "večeře", "kavárna"],
    sport: ["stadion", "bazén", "fitness"],
    obchod: ["prodejna", "nákup"],
    opravna: ["servis", "opravy"],
    ubytování: ["hotel", "penzion"],
  };

  return [
    item.name,
    item.phone,
    item.address,
    item.note ?? "",
    item.email ?? "",
    item.website ?? "",
    item.category,
    item.cityDepartment ? cityDepartmentLabels[item.cityDepartment] ?? item.cityDepartment : "",
    ...(synonyms[item.category] ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

export function getContactQualityIssues(item: DirectoryLike): ContactQualityIssue[] {
  const issues: ContactQualityIssue[] = [];
  if (!item.phone) {
    issues.push({ code: "missing-phone", label: "chybí telefon", severity: "critical" });
  } else if (!isValidPhone(item.phone)) {
    issues.push({ code: "missing-phone", label: "telefon vypadá neúplně", severity: "warning" });
  }
  if (!item.address) {
    issues.push({ code: "missing-address", label: "chybí adresa", severity: "critical" });
  }
  if (item.email && !isValidEmail(item.email)) {
    issues.push({ code: "invalid-email", label: "neplatný e-mail", severity: "critical" });
  }
  if (item.website && !isValidHttpUrl(item.website)) {
    issues.push({ code: "invalid-website", label: "neplatný web", severity: "critical" });
  }
  if (item.sourceUrl && !isValidHttpUrl(item.sourceUrl)) {
    issues.push({ code: "invalid-source-url", label: "neplatný zdroj URL", severity: "critical" });
  }
  if (item.appointmentUrl && !isValidHttpUrl(item.appointmentUrl)) {
    issues.push({ code: "invalid-appointment-url", label: "neplatné objednání URL", severity: "critical" });
  }
  if (!item.hours) {
    issues.push({ code: "missing-hours", label: "chybí otevírací doba", severity: "warning" });
  }
  if (item.category === "město" && !item.email) {
    issues.push({ code: "missing-email", label: "chybí e-mail", severity: "warning" });
  }
  if (item.category !== "město" && !item.website) {
    issues.push({ code: "missing-website", label: "chybí web", severity: "warning" });
  }
  if (item.sourceKind === "vimperk_web" && item.sourceSyncedAt) {
    const syncedAt = new Date(item.sourceSyncedAt).getTime();
    const staleThreshold = Date.now() - 1000 * 60 * 60 * 24 * 14;
    if (!Number.isNaN(syncedAt) && syncedAt < staleThreshold) {
      issues.push({ code: "stale-sync", label: "sync je starší než 14 dní", severity: "warning" });
    }
  }
  return issues;
}

export function getContactWorkflowStatus(item: DirectoryLike): ContactWorkflowStatus {
  const persistedStatus = (item as DirectoryLike & { workflowStatus?: AdminWorkflowStatus }).workflowStatus;
  if (persistedStatus) return persistedStatus;
  if (item.sourceKind === "vimperk_web" || item.isLocked) return "live";
  const issues = getContactQualityIssues(item);
  if (!item.name || !item.phone || !item.address) return "draft";
  if (issues.some((issue) => issue.severity === "critical")) return "review";
  if (issues.length > 0) return "review";
  return "ready";
}

function normalizeForDuplicateCheck(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function findPotentialDuplicateNames(items: DirectoryLike[]) {
  const groups = new Map<string, Array<string | number>>();

  for (const item of items) {
    const key = `${normalizeForDuplicateCheck(item.name)}|${normalizePhone(item.phone).replace(/\D/g, "")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(item.id);
  }

  return new Set(
    [...groups.values()]
      .filter((ids) => ids.length > 1)
      .flat(),
  );
}

export function isPotentialDuplicate(
  candidate: DirectoryFormInput,
  items: DirectoryLike[],
  ignoreId?: string,
) {
  const normalized = normalizeDirectoryInput(candidate);
  const candidateName = normalizeForDuplicateCheck(normalized.name);
  const candidatePhone = normalized.phone.replace(/\D/g, "");
  return items.some((item) => {
    if (ignoreId && String(item.id) === ignoreId) return false;
    const itemName = normalizeForDuplicateCheck(item.name);
    const itemPhone = normalizePhone(item.phone).replace(/\D/g, "");
    return (
      (candidatePhone && itemPhone === candidatePhone) ||
      (candidateName && itemName === candidateName)
    );
  });
}

export function scoreFeaturedContact(item: PublicDirectoryItem, search: string) {
  const q = search.trim().toLowerCase();
  let score = 0;
  if (item.category === "město") score += 30;
  if (item.cityDepartment === "central") score += 15;
  if (item.cityDepartment === "bezpecnost") score += 12;
  if (item.appointmentUrl) score += 10;
  if (item.email) score += 6;
  if (item.hours) score += 4;
  if (q && buildDirectorySearchIndex(item).includes(q)) score += 8;
  return score;
}

export function sortDirectoryItems<T extends DirectoryLike>(items: T[]) {
  return [...items].sort((left, right) => {
    if (left.category === right.category) {
      return left.name.localeCompare(right.name, "cs");
    }
    return left.category.localeCompare(right.category, "cs");
  });
}
