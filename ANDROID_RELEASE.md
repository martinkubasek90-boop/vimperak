# Android Release Guide

## Aktualni stav projektu

- `applicationId`: `cz.vimperaci.app`
- `compileSdk` / `targetSdk`: `35`
- release signing je pripraveny pres environment variables v [android/app/build.gradle](/Users/Mk/vimperk-app/android/app/build.gradle)
- debug i emulator build uz byly overene lokalne
- pro release sync pouzij `npm run cap:sync:android:release`

## Dulezite pred prvnim uploadem

### 1. Pouzit produkcni URL

Mobilni wrapper uz defaultne pouziva produkcni URL `https://vimperaci.cz`.

Debug `localhost` se pouzije jen pri explicitnim:

```bash
CAPACITOR_USE_LOCAL_SERVER=true
```

To znamena, ze pro store build uz nehrozi omylem zabalit `localhost`.

### 2. Pripravit upload keystore

Google Play vyzaduje konzistentni podpis release buildu.

Priklad vytvoreni:

```bash
keytool -genkeypair \
  -v \
  -keystore vimperaci-upload-keystore.jks \
  -alias vimperaci \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Ten soubor necommituj do repa.

### 3. Nastavit signing env promene

```bash
export ANDROID_KEYSTORE_PATH="/absolute/path/to/vimperaci-upload-keystore.jks"
export ANDROID_KEYSTORE_PASSWORD="..."
export ANDROID_KEY_ALIAS="vimperaci"
export ANDROID_KEY_PASSWORD="..."
```

### 4. Toolchain na tomto Macu

Pouzity JDK:

```bash
export JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
```

SDK:

- `android/local.properties`
- nebo standardni `~/Library/Android/sdk`

## Release build

### Sync Android projektu na release konfiguraci

```bash
cd /Users/Mk/vimperk-app
npm run cap:sync:android:release
```

### Vytvoreni AAB pro Google Play

```bash
cd /Users/Mk/vimperk-app
JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home" \
./android/gradlew -p android bundleRelease
```

Vystup:

- `android/app/build/outputs/bundle/release/app-release.aab`

### Vytvoreni release APK pro lokalni test

```bash
cd /Users/Mk/vimperk-app
JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home" \
./android/gradlew -p android assembleRelease
```

Vystup:

- `android/app/build/outputs/apk/release/app-release.apk`

## Co vyplnit v Play Console

1. `Create app`
2. `Store listing`
3. `App content`
4. `Data safety`
5. `Content rating`
6. `Target audience`
7. `Pricing and distribution`
8. `Testing > Internal testing` nebo `Closed testing`
9. nahrat `app-release.aab`

## Co jeste muze blokovat vydani

- chybi finalni release keystore, pokud jeste neni vytvoreny
- `google-services.json` neni v projektu, takze nativni FCM push nebude fungovat, dokud nepridas Firebase konfiguraci
- `versionCode` a `versionName` jsou zatim `1` a `1.0`, pred dalsimi releasy je nutne je zvysovat v [android/app/build.gradle](/Users/Mk/vimperk-app/android/app/build.gradle)
- Play Console bude chtit finalni:
  - ikonu
  - screenshoty
  - privacy policy URL
  - kontakt pro podporu

## Nejrychlejsi prvni vydani

1. internal testing
2. kontrola na realnem Android telefonu
3. closed testing
4. production
