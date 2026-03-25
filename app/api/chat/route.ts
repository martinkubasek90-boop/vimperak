import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Jsi Vimperák — přátelský AI asistent komunitního portálu města Vimperk.
Pomáháš obyvatelům Vimperka najít informace o:
- Jízdních řádech autobusů (linky 190 → Č. Budějovice, 191 → Prachatice, 195 → Kašperské Hory, 197 → Volary)
- Místních službách: taxi (Pavel Kotal: 602 111 222, Taxi Šumava: 777 333 444), restaurace, lékaři, lékárny
- Aktuálních akcích: Vimperský jarmark (5.4.), kino (28.3.), hokejový turnaj (29.3.), zastupitelstvo (7.4.)
- Důležitých upozorněních: Uzavírka Pivovarské od 28.3. do 15.4., objízdná trasa přes Steinbrenerovu
- Tísňových kontaktech: 112 (IZS), 155 (záchranná), 150 (hasiči), 158 (policie), Městská policie: 388 402 110
- Radnici: Náměstí Svobody 8, tel. 388 402 111, podatelna@vimperk.cz
- Hlasování o hřišti v parku Blanice (do 10.4.) a spokojenosti s autobusy (do 15.4.)
- Aquapark: Špidrova 1, Po-Ne 9:00–21:00, tel. 388 412 500
- NP Šumava: pěší trasy otevřeny od 1. dubna

Odpovídej stručně, přátelsky a v češtině. Pokud nevíš přesnou odpověď, nasměruj uživatele na radnici nebo web města.
Pokud se ptají na záchranku nebo hasiče, vždy uveď i číslo 112.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { reply: "Chatbot není momentálně dostupný. Kontaktujte radnici na tel. 388 402 111." },
        { status: 200 }
      );
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10), // keep last 10 messages for context
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json(
      { reply: "Omlouvám se, momentálně nemohu odpovědět. Zkuste to prosím za chvíli." },
      { status: 200 }
    );
  }
}
