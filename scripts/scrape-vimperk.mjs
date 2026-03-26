/**
 * Vimperk.cz Web Scraper
 * Prochází všechny stránky webu a ukládá obsah do JSON knowledge base.
 *
 * Spuštění: node scripts/scrape-vimperk.mjs
 */

import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://vimperk.cz";
const OUTPUT   = resolve("data/vimperk-kb.json");
const DELAY_MS = 800;          // slušnost vůči serveru
const MAX_PAGES = 200;         // limit stránek

const visited   = new Set();
const queue     = ["/"];
const pages     = [];
let   crawled   = 0;

// ── Pomocné funkce ────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeUrl(href, base) {
  try {
    const url = new URL(href, base);
    // Pouze interní stránky, žádné kotvy, soubory nebo query-only
    if (!url.hostname.includes("vimperk.cz")) return null;
    if (url.pathname.match(/\.(pdf|jpg|jpeg|png|gif|svg|doc|xls|zip|mp3|mp4)$/i)) return null;
    url.hash = "";
    url.search = "";  // odstraní query string pro deduplikaci
    return url.pathname;
  } catch {
    return null;
  }
}

function extractText($, selector) {
  return $(selector).text().replace(/\s+/g, " ").trim();
}

function cleanContent(text) {
  return text
    .replace(/\s{3,}/g, "\n\n")
    .replace(/\n{4,}/g, "\n\n")
    .trim();
}

// ── Scraper ───────────────────────────────────────────────────────────────────

async function scrapePage(path) {
  const url = BASE_URL + path;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VimperkApp-Bot/1.0 (komunitní portál; info@vimperk.app)",
        "Accept-Language": "cs,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.log(`  ⚠ ${res.status} ${url}`);
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    const html = await res.text();
    const $    = cheerio.load(html);

    // Odstraní navigaci, footer, skripty, styly, reklamy
    $("script, style, nav, footer, header, .menu, .nav, .sidebar, .cookie, .gdpr, iframe, noscript").remove();
    $("[class*='nav'], [class*='menu'], [class*='footer'], [class*='header'], [class*='cookie']").remove();
    $("[id*='nav'], [id*='menu'], [id*='footer'], [id*='header']").remove();

    // Extrahuj obsah
    const title    = $("title").text().replace(" | Vimperk", "").trim() || $("h1").first().text().trim();
    const h1       = $("h1").first().text().trim();
    const metaDesc = $('meta[name="description"]').attr("content") ?? "";

    // Sbírej veškerý text z obsahu
    const bodyText = cleanContent(
      $("main, article, .content, .page-content, #content, .entry-content, body")
        .first()
        .text()
    );

    // Sbírej nové linky pro queue
    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const norm = normalizeUrl(href, BASE_URL);
      if (norm && !visited.has(norm)) links.push(norm);
    });

    return { title, h1, metaDesc, bodyText, links, url };
  } catch (err) {
    console.log(`  ✗ ${url} — ${err.message}`);
    return null;
  }
}

// ── Chunking ──────────────────────────────────────────────────────────────────

function chunkText(text, maxChars = 1500) {
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current  = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ── Main loop ─────────────────────────────────────────────────────────────────

console.log("🕷️  Spouštím scraper vimperk.cz...\n");

while (queue.length > 0 && crawled < MAX_PAGES) {
  const path = queue.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  crawled++;

  process.stdout.write(`[${crawled}/${MAX_PAGES}] ${path} ...`);
  const result = await scrapePage(path);

  if (!result || result.bodyText.length < 100) {
    console.log(" přeskočeno");
    continue;
  }

  // Přidej nové linky do fronty
  for (const link of result.links) {
    if (!visited.has(link) && !queue.includes(link)) {
      queue.push(link);
    }
  }

  // Rozděl na chunks
  const chunks = chunkText(result.bodyText);
  for (let i = 0; i < chunks.length; i++) {
    pages.push({
      id:      `${path.replace(/\//g, "_")}_${i}`,
      url:     result.url,
      title:   result.title,
      h1:      result.h1,
      section: path.split("/").filter(Boolean).join(" › ") || "Úvod",
      chunk:   i,
      content: chunks[i],
    });
  }

  console.log(` ✓ (${chunks.length} chunks, ${result.bodyText.length} znaků)`);
  await sleep(DELAY_MS);
}

// ── Ulož výsledek ─────────────────────────────────────────────────────────────

mkdirSync("data", { recursive: true });

const output = {
  source:     BASE_URL,
  scraped_at: new Date().toISOString(),
  page_count: visited.size,
  chunk_count: pages.length,
  pages,
};

writeFileSync(OUTPUT, JSON.stringify(output, null, 2), "utf-8");

console.log(`
✅ Hotovo!
   Stránky: ${visited.size}
   Chunks:  ${pages.length}
   Soubor:  ${OUTPUT}
`);
