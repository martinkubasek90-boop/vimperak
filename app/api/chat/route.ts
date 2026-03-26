import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getKBSystemContext, getKBStatus } from "@/lib/knowledge";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE_SYSTEM = `Jsi Vimperák — přátelský a chytrý AI asistent komunitního portálu města Vimperk v jihočeském kraji.

## Tvoje role
Pomáháš obyvatelům i návštěvníkům Vimperka najít potřebné informace o životě ve městě.
Odpovídáš vždy v češtině, přátelsky, stručně a věcně.

## Záchranné kontakty (vždy uveď při nouzi)
- **112** — Integrovaný záchranný systém (vše)
- **155** — Záchranná služba
- **150** — Hasiči
- **158** — Policie ČR
- **388 402 110** — Městská policie Vimperk

## Radnice Vimperk
- Adresa: Náměstí Svobody 8, 385 01 Vimperk
- Telefon: 388 402 111
- E-mail: podatelna@vimperk.cz
- Web: vimperk.cz

## Pravidla
- Pokud máš v kontextu relevantní informace z webu vimperk.cz, použij je jako primární zdroj
- Cituj URL zdroje pokud je to užitečné
- Pokud informaci nevíš, nasměruj uživatele na radnici nebo vimperk.cz
- Při dotazech na záchranku nebo hasiče vždy uveď číslo 112
- Neodpovídej na témata nesouvisející s Vimperkem a Šumavou`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        reply: "Chatbot není momentálně dostupný. Kontaktujte radnici na tel. **388 402 111**.",
        kb: null,
      });
    }

    // Vezmi poslední uživatelský dotaz pro retrieval
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Získej relevantní chunks z KB
    const kbContext  = getKBSystemContext(lastUserMessage);
    const kbStatus   = getKBStatus();

    // Sestav system prompt s KB kontextem
    const systemPrompt = kbContext
      ? BASE_SYSTEM + kbContext
      : BASE_SYSTEM;

    const response = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system:     systemPrompt,
      messages:   messages.slice(-12),
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      reply,
      kb: kbStatus.available
        ? { chunks_used: kbContext ? kbContext.split("---").length : 0, scraped_at: kbStatus.scraped_at }
        : null,
    });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json({
      reply: "Omlouvám se, momentálně nemohu odpovědět. Zkuste to prosím za chvíli.",
      kb: null,
    });
  }
}
