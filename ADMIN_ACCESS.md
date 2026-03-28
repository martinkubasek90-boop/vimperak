# Admin Access

`Vimperáci` teď mají první provozní základ pro admin přístup přes `Supabase Auth`.

## Jak to funguje

1. Uživatel se přihlásí přes `/admin/login`.
2. Autentizace běží přes `Supabase Auth`.
3. Po přihlášení se na serveru vyhodnotí role podle allowlistu e-mailů.
4. Pokud e-mail není v žádné roli, účet se do adminu nepustí.

`Basic Auth` v `proxy.ts` zůstává jako vnější ochrana stagingu. Není to náhrada admin oprávnění.

## Role

### `viewer`
- přehled a kontrola stavu
- bez editace

### `editor`
- správa zpravodaje
- správa akcí
- bez urgentního publikování

### `dispatcher`
- práce se závadami a podněty
- změna stavů hlášení

### `approver`
- vše z role `editor`
- vše z role `dispatcher`
- může označit zprávu jako urgentní

### `superadmin`
- vše z role `approver`
- technická správa přístupů
- budoucí správa uživatelů, rolí a audit logu

## Environment Variables

Do lokálního `.env` nebo do `Vercelu` nastav:

```env
ADMIN_VIEWER_EMAILS=
ADMIN_EDITOR_EMAILS=
ADMIN_DISPATCHER_EMAILS=
ADMIN_APPROVER_EMAILS=
ADMIN_SUPERADMIN_EMAILS=
```

Formát je seznam e-mailů oddělený čárkou:

```env
ADMIN_EDITOR_EMAILS=redakce@vimperaci.cz,novak@mestovimperk.cz
ADMIN_DISPATCHER_EMAILS=technicke.sluzby@vimperaci.cz
ADMIN_APPROVER_EMAILS=tiskovy.mluvci@vimperaci.cz
ADMIN_SUPERADMIN_EMAILS=martin@vimperaci.cz
```

## Doporučený provozní model

- `superadmin`
  - 1 až 2 technické účty
- `approver`
  - vedení komunikace města nebo pověřený schvalovatel
- `editor`
  - redakce, kultura, sport, infocentrum
- `dispatcher`
  - technické služby nebo podatelna

## Co ještě chybí do plného produkčního adminu

- perzistence admin CRUD operací do Supabase místo mock dat
- audit log
- správa uživatelů a rolí přímo z UI
- workflow `draft` / `pending_review` / `published`
- ochrana admin API rout podle session místo sdíleného `ADMIN_API_KEY`
