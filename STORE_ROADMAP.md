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
- Capacitor konfigurace v `capacitor.config.ts`.
- Android native project ve slozce `android/`.
- Prvni lokalni Android `debug APK` v `android/app/build/outputs/apk/debug/app-debug.apk`.

## Aktualni stav

### Android

- Android scaffold je hotovy.
- Prvni `debug APK` se podarilo uspesne sestavit.
- Pro dalsi lokalni buildy je potreba:
- `Java`
- `Android SDK`
- `Gradle`

### iOS

- `ios/` scaffold zatim neni vygenerovany.
- Aktualni blokery na tomto stroji:
- chybi plne `Xcode`
- systemovy `Ruby 2.6` je prilis stary pro bezproblemovou instalaci `CocoaPods`

## Dalsi nejblizsi kroky

1. Otestovat `app-debug.apk` na realnem Android telefonu.
2. Pripravit `release signing` pro Android.
3. Vytvorit prvni `release` nebo `internal testing` build pro Google Play.
4. Na Macu nainstalovat plne `Xcode`.
5. Doinstalovat funkcni `CocoaPods` toolchain.
6. Vygenerovat `ios/` projekt prikazem `npx cap add ios`.
7. Otevrit iOS projekt v Xcode a nastavit signing.

## Co je potreba udelat dal

### 1. Scaffold Capacitoru

- Nainstalovat `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`.
- Vygenerovat nativni projekty:
- `npx cap add ios`
- `npx cap add android`

Poznamka:
- `android/` uz je vygenerovane.
- `ios/` zatim ceka na pripravu lokalniho iOS toolchainu.

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
- Otestovat aktualni `debug APK` na realnem zarizeni.
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

## Prakticky checklist pro Android

1. Nainstalovat `app-debug.apk` do testovaciho telefonu.
2. Overit spusteni aplikace, navigaci a nacteni `vimperaci.cz`.
3. Otestovat zakladni use-case: domovska stranka, zpravodaj, mesto, formular.
4. Pripravit Android keystore pro release.
5. Nastavit release signing v `android/app/build.gradle` nebo pres Android Studio.
6. Vytvorit `bundleRelease` nebo `assembleRelease`.
7. Zalozit aplikaci v `Google Play Console`.
8. Nahrat prvni `internal testing` build.

## Prakticky checklist pro iOS

1. Nainstalovat plne `Xcode`.
2. Nastavit `xcode-select` na plnou Xcode instalaci.
3. Zprovoznit `CocoaPods`.
4. Spustit `npx cap add ios`.
5. Otevrit `ios/` projekt v Xcode.
6. Nastavit Apple Team, bundle ID a signing.
7. Otestovat build na realnem iPhonu.
8. Pripravit `TestFlight` build.
