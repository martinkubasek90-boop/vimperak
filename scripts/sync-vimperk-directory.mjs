import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const KB_PATH = resolve("data/vimperk-kb.json");
const ENV_PATH = resolve(".env.local");
const APPOINTMENT_URL = "https://vimperk.cz/ap";

const SOURCE_PAGES = [
  {
    url: "https://vimperk.cz/",
    name: "Městský úřad Vimperk",
    cityDepartment: "central",
  },
  {
    url: "https://vimperk.cz/osobni%2Ddoklady/ms-9487/p1=9487",
    name: "Městský úřad Vimperk — Osobní doklady",
    cityDepartment: "vnitrni-veci",
  },
  {
    url: "https://vimperk.cz/matrika%2Da%2Devidence%2Dobyvatel/ms-9488/p1=9488",
    name: "Městský úřad Vimperk — Matrika a evidence obyvatel",
    cityDepartment: "vnitrni-veci",
  },
  {
    url: "https://vimperk.cz/doprava%2Da%2Dvozidla/ms-9485/p1=9485",
    name: "Městský úřad Vimperk — Doprava a vozidla",
    cityDepartment: "doprava",
  },
  {
    url: "https://vimperk.cz/stavebni%2Drizeni/ms-9484/p1=9484",
    name: "Městský úřad Vimperk — Stavební řízení",
    cityDepartment: "vystavba",
  },
  {
    url: "https://vimperk.cz/socialni%2Dsluzby/ms-10583/p1=9486",
    name: "Městský úřad Vimperk — Sociální služby",
    cityDepartment: "socialni",
  },
  {
    url: "https://vimperk.cz/zivotni%2Dprostredi/ms-9491/p1=9491",
    name: "Městský úřad Vimperk — Životní prostředí",
    cityDepartment: "zivotni-prostredi",
  },
  {
    url: "https://vimperk.cz/podnikani/ms-9492/p1=9492",
    name: "Městský úřad Vimperk — Podnikání",
    cityDepartment: "zivnostensky",
  },
  {
    url: "https://vimperk.cz/bezpecnost/ms-9493/p1=9493",
    name: "Městský úřad Vimperk — Bezpečnost",
    cityDepartment: "bezpecnost",
  },
];

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

function readKnowledgeBase() {
  const raw = readFileSync(KB_PATH, "utf8");
  return JSON.parse(raw);
}

function normalizeWhitespace(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitParagraphs(text) {
  return normalizeWhitespace(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatAddress(rawAddress) {
  return rawAddress
    .replace(/\s+/g, " ")
    .replace(/(\d\/\d)(\d{3}\s?\d{2})/, "$1 $2")
    .trim();
}

function formatHoursBlock(block) {
  const normalized = normalizeWhitespace(block).replace(
    /(Pondělí|Úterý|Středa|Čtvrtek|Pátek|Sobota|Neděle)/g,
    "\n$1",
  );

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" · ");
}

function parseContactFields(text) {
  const compact = normalizeWhitespace(text);

  const addressMatch = compact.match(/Městský úřad Vimperk\s*(.*?)\s*Tel\.:/s);
  const phoneMatch = compact.match(/Tel\.\:\s*([0-9 ]{9,})/);
  const emailBlockMatch = compact.match(/E-mail\:\s*(.*?)\s*ID datové schránky/s);
  const officeHoursMatch = compact.match(/Úřední hodiny\s*(.*?)\s*Pracovní doba podatelny/s);
  const filingHoursMatch = compact.match(/Pracovní doba podatelny\s*(.*?)\s*Důležité odkazy/s);

  return {
    address: addressMatch ? formatAddress(addressMatch[1]) : "",
    phone: phoneMatch ? phoneMatch[1].replace(/\s+/g, " ").trim() : "",
    email: emailBlockMatch ? emailBlockMatch[1].trim() : "",
    hours: officeHoursMatch ? formatHoursBlock(officeHoursMatch[1]) : "",
    filingHours: filingHoursMatch ? formatHoursBlock(filingHoursMatch[1]) : "",
  };
}

function parseDescription(text, title) {
  const paragraphs = splitParagraphs(text);
  const titleIndex = paragraphs.findIndex((paragraph) => paragraph === title);
  if (titleIndex < 0) return "";

  for (const paragraph of paragraphs.slice(titleIndex + 1)) {
    if (
      paragraph === "Kontakt" ||
      paragraph.startsWith("On-line rezervace") ||
      paragraph.startsWith("Městský úřad Vimperk")
    ) {
      continue;
    }
    return paragraph;
  }

  return "";
}

function collectPageContent(pages, url) {
  return pages
    .filter((page) => page.url === url)
    .sort((left, right) => left.chunk - right.chunk)
    .map((page) => page.content)
    .join("\n\n");
}

function buildOfficialRecords(kb) {
  return SOURCE_PAGES.map((pageConfig) => {
    const content = collectPageContent(kb.pages, pageConfig.url);
    if (!content) {
      throw new Error(`Ve znalostní bázi chybí stránka ${pageConfig.url}`);
    }

    const contact = parseContactFields(content);
    const description = parseDescription(content, pageConfig.name.replace("Městský úřad Vimperk — ", ""));
    const noteParts = [];

    if (description) noteParts.push(description);
    if (pageConfig.cityDepartment === "central" && contact.filingHours) {
      noteParts.push(`Pracovní doba podatelny: ${contact.filingHours}`);
    }

    return {
      name: pageConfig.name,
      category: "město",
      city_department: pageConfig.cityDepartment,
      phone: contact.phone,
      address: contact.address,
      hours: contact.hours || null,
      note: noteParts.length > 0 ? noteParts.join(" | ") : null,
      email: contact.email || null,
      website: "https://vimperk.cz",
      source_url: pageConfig.url,
      appointment_url: content.includes("On-line rezervace na") ? APPOINTMENT_URL : null,
      appointment_label: content.includes("On-line rezervace na") ? "On-line rezervace na přepážky" : null,
      source_kind: "vimperk_web",
      source_external_id: pageConfig.url,
      source_synced_at: new Date().toISOString(),
      is_locked: true,
    };
  });
}

function printPreview(records) {
  console.log(`Připraveno ${records.length} oficiálních kontaktů:`);
  for (const record of records) {
    console.log(`- ${record.name}`);
    console.log(`  ${record.phone} | ${record.email ?? "bez e-mailu"}`);
    console.log(`  ${record.address}`);
  }
}

async function syncRecords(records, supabase) {
  const { data: existing, error: existingError } = await supabase
    .from("directory")
    .select("id, source_external_id")
    .eq("source_kind", "vimperk_web");

  if (existingError) {
    throw new Error(`Načtení stávajících official záznamů selhalo: ${existingError.message}`);
  }

  const existingByExternalId = new Map(
    (existing ?? []).map((item) => [item.source_external_id, item]),
  );
  const incomingIds = new Set(records.map((record) => record.source_external_id));

  for (const record of records) {
    const existingRecord = existingByExternalId.get(record.source_external_id);
    if (existingRecord) {
      const { error } = await supabase
        .from("directory")
        .update(record)
        .eq("id", existingRecord.id);

      if (error) {
        throw new Error(`Update ${record.name} selhal: ${error.message}`);
      }
      continue;
    }

    const { error } = await supabase.from("directory").insert([record]);
    if (error) {
      throw new Error(`Insert ${record.name} selhal: ${error.message}`);
    }
  }

  const staleIds = (existing ?? [])
    .filter((item) => !incomingIds.has(item.source_external_id))
    .map((item) => item.id);

  if (staleIds.length > 0) {
    const { error } = await supabase.from("directory").delete().in("id", staleIds);
    if (error) {
      throw new Error(`Mazání zastaralých official záznamů selhalo: ${error.message}`);
    }
  }

  return { updated: records.length, deleted: staleIds.length };
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));
  loadEnvFile(ENV_PATH);

  const kb = readKnowledgeBase();
  const records = buildOfficialRecords(kb);

  if (records.some((record) => !record.phone || !record.address)) {
    throw new Error("Některé oficiální záznamy nemají parsovaný telefon nebo adresu.");
  }

  printPreview(records);

  if (dryRun) {
    console.log("\nDry run: databáze se nemění.");
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl === "https://YOUR_PROJECT.supabase.co") {
    throw new Error("Chybí NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceRoleKey) {
    throw new Error("Chybí SUPABASE_SERVICE_ROLE_KEY. Bez service role nejde synchronizovat directory.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const result = await syncRecords(records, supabase);
  console.log(`\nSync hotov: ${result.updated} kontaktů synchronizováno, ${result.deleted} zastaralých smazáno.`);
}

main().catch((error) => {
  console.error("\nSync selhal.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
