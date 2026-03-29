# Directory Sync

Oficialni mestske kontakty se nemaji rucne prepisovat v adminu. Maji se synchronizovat z `vimperk.cz` do tabulky `directory` jako uzamcene zaznamy:

- `source_kind = 'vimperk_web'`
- `is_locked = true`

## Co sync dela

Script `scripts/sync-vimperk-directory.mjs`:

- nacita `data/vimperk-kb.json`
- vytahne oficialni kontakty mestskeho uradu a vybranych agend
- ulozi je do `public.directory`
- aktualizuje existujici `vimperk_web` zaznamy
- smaze zastarale `vimperk_web` zaznamy, ktere uz ve zdroji nejsou

Manualni zaznamy se syncem nedotkne.

## Pozadavky

- aktualni scrape dump v `data/vimperk-kb.json`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Pouziti

Nejdriv obnov scrape dump z webu:

```bash
npm run scrape
```

Pak si sync jen zkontroluj:

```bash
npm run sync:directory:dry
```

A az potom proved zapis do Supabase:

```bash
npm run sync:directory
```
