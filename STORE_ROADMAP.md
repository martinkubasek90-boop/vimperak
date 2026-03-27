# Vimperak Store Roadmap

## Cil

Dostat aktualni Next.js aplikaci do `App Store` a `Google Play` bez prepisovani celeho produktu do nativniho frameworku.

## Doporucena cesta

- Zachovat web jako hlavni kodovou zakladnu.
- Pouzit `Capacitor` jako nativni wrapper pro `iOS` a `Android`.
- Webovou cast dal nasazovat na `https://vimperaci.cz`.
- Store buildy pouzivat pro distribuci, push opravnene nativni integrace a lepsi duveryhodnost.

## Co uz je pripraveno

- PWA manifest a service worker.
- Produkcni metadata a zakladni pravni stranky.
- Produkcni domena `vimperaci.cz`.
- Basic auth ochrana pro predspousteci rezim.

## Co je potreba udelat dal

### 1. Scaffold Capacitoru

- Nainstalovat `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`.
- Vygenerovat nativni projekty:
- `npx cap add ios`
- `npx cap add android`

### 2. Rozhodnout architekturu wrapperu

Aktualne je navrzene:
- store appka bude nacitat produkcni web `https://vimperaci.cz` uvnitr nativniho wrapperu.

Vyhody:
- rychlejsi iterace obsahu,
- jeden hlavni kodbase,
- mensi naklady na vyvoj.

Nevyhody:
- push notifikace a nektere nativni funkce bude potreba doplnit pres Capacitor pluginy,
- App Store review muze byt prisnejsi, pokud appka nebude mit dostatecnou nativni hodnotu.

### 3. iOS

- Otevrit projekt v Xcode.
- Nastavit bundle ID.
- Nastavit team a signing.
- Pridat app icony a launch assets.
- Dopsat privacy usage texty.
- Otestovat na realnem iPhonu.
- Nastavit `APNs` pro push notifikace.

### 4. Android

- Otevrit projekt v Android Studio.
- Nastavit package name.
- Nastavit signing key.
- Pridat app icony.
- Otestovat na realnem Android telefonu.
- Nastavit `Firebase Cloud Messaging`.

### 5. Push notifikace

- Soucasne web push nestaci pro plnohodnotnou store distribuci.
- Pro store appky je potreba doplnit nativni push flow pro `iOS` a `Android`.
- To bude znamenat upravit backend i klienta.

### 6. Store assets

- Nazev aplikace.
- Kratky a dlouhy popis.
- Screenshoty pro iPhone a Android.
- Ikona aplikace.
- Privacy policy URL.
- Support URL.
- Marketing text.

### 7. Review a vydani

- App Store Connect.
- Google Play Console.
- TestFlight / Internal Testing.
- Finalni review a publikace.

## Prakticke doporuceni

Nejkratsi realisticka cesta je:

1. scaffoldnout `Capacitor`,
2. vytvorit `ios` a `android` projekty,
3. dostat prvni internim buildem appku do telefonu,
4. pak doresit push, ikony, signing a store submission.
