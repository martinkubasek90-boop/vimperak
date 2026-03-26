/**
 * Knowledge Base — RAG retrieval pro AI chatbot Vimperák.
 * Načítá obsah z data/vimperk-kb.json a hledá relevantní chunks.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

type KBPage = {
  id:      string;
  url:     string;
  title:   string;
  h1:      string;
  section: string;
  chunk:   number;
  content: string;
};

type KnowledgeBase = {
  source:      string;
  scraped_at:  string;
  page_count:  number;
  chunk_count: number;
  pages:       KBPage[];
};

// Singleton — načte se jednou při startu serveru
let _kb: KnowledgeBase | null = null;

function loadKB(): KnowledgeBase | null {
  if (_kb) return _kb;
  const path = join(process.cwd(), "data", "vimperk-kb.json");
  if (!existsSync(path)) return null;
  try {
    _kb = JSON.parse(readFileSync(path, "utf-8")) as KnowledgeBase;
    console.log(`[KB] Načteno ${_kb.chunk_count} chunks z ${_kb.page_count} stránek (${_kb.scraped_at.slice(0,10)})`);
    return _kb;
  } catch (err) {
    console.error("[KB] Chyba při načítání:", err);
    return null;
  }
}

// ── Keyword scoring ───────────────────────────────────────────────────────────
// BM25-inspired: počítá váhu klíčových slov v chunku

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // odstraní diakritiku pro matching
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreChunk(chunk: KBPage, queryTokens: string[]): number {
  const content    = tokenize(chunk.content);
  const title      = tokenize(chunk.title + " " + chunk.h1);
  const contentSet = new Set(content);
  const titleSet   = new Set(title);

  let score = 0;
  for (const token of queryTokens) {
    // Přesná shoda v titulku = velká váha
    if (titleSet.has(token)) score += 5;
    // Přesná shoda v obsahu
    if (contentSet.has(token)) score += 2;
    // Částečná shoda (prefix)
    if (content.some((w) => w.startsWith(token) || token.startsWith(w))) score += 1;
    if (title.some((w) => w.startsWith(token) || token.startsWith(w))) score += 2;
  }

  // Bonus za relevantní sekce
  const sectionBonus: Record<string, number> = {
    "urad": 1, "radnice": 1, "mestsky": 1,
    "kultura": 0.5, "sport": 0.5, "turistika": 0.5,
  };
  const sectionTokens = tokenize(chunk.section);
  for (const [key, bonus] of Object.entries(sectionBonus)) {
    if (sectionTokens.some((t) => t.includes(key))) score += bonus;
  }

  return score;
}

// ── Veřejné API ───────────────────────────────────────────────────────────────

export function getKBStatus(): { available: boolean; chunks: number; scraped_at: string } {
  const kb = loadKB();
  if (!kb) return { available: false, chunks: 0, scraped_at: "" };
  return { available: true, chunks: kb.chunk_count, scraped_at: kb.scraped_at };
}

export function retrieveRelevantChunks(query: string, topK = 6): string {
  const kb = loadKB();
  if (!kb || kb.pages.length === 0) return "";

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return "";

  // Ohodnoť všechny chunks
  const scored = kb.pages
    .map((page) => ({ page, score: scoreChunk(page, queryTokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (scored.length === 0) return "";

  // Sestav kontext pro Claude
  const context = scored
    .map(({ page }) =>
      `### ${page.title}${page.h1 && page.h1 !== page.title ? ` — ${page.h1}` : ""}\n` +
      `Zdroj: ${page.url}\n\n` +
      page.content
    )
    .join("\n\n---\n\n");

  return context;
}

export function getKBSystemContext(query: string): string {
  const kb = loadKB();
  if (!kb) return "";

  const chunks = retrieveRelevantChunks(query);
  if (!chunks) return "";

  return `\n\n## Relevantní informace z webu vimperk.cz (aktualizováno ${kb.scraped_at.slice(0,10)})\n\n${chunks}\n\n---\n`;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function truncateSentence(text: string, max = 260): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return compact.slice(0, max - 1).trimEnd() + "…";
}

export function getTopRelevantPages(query: string, topK = 3): KBPage[] {
  const kb = loadKB();
  if (!kb || kb.pages.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  return kb.pages
    .map((page) => ({ page, score: scoreChunk(page, queryTokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ page }) => page);
}

export function answerFromKnowledgeBase(query: string): { reply: string; sourceUrl?: string } | null {
  const pages = getTopRelevantPages(query, 2);
  if (pages.length === 0) return null;

  const [first, second] = pages;
  const q = normalize(query);

  if (/(obcank|obcansk|osobni doklad|pas|cestovni doklad|ridicsk)/.test(q)) {
    return {
      reply: [
        "K osobním dokladům ve Vimperku jsem našel toto:",
        "Agendy občanských průkazů, cestovních pasů a matriky řeší odbor vnitřních věcí.",
        "Adresa: Steinbrenerova 6, 385 17 Vimperk.",
        "Kontakt: 388 402 231, urad@mesto.vimperk.cz.",
        "Úřední hodiny: pondělí a středa 7:30-11:30 a 12:30-17:00, pátek 7:30-11:30.",
        "Město také uvádí možnost on-line rezervace na přepážky.",
        `Zdroj: ${first.url}`,
      ].join("\n"),
      sourceUrl: first.url,
    };
  }

  const summary = truncateSentence(first.content);
  const extra = second ? `\nDalší relevantní zdroj: ${second.url}` : "";

  return {
    reply: `Našel jsem k tomu informace na webu města:\n${summary}\nZdroj: ${first.url}${extra}`,
    sourceUrl: first.url,
  };
}
