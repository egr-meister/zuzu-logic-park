# Zuzu Logic Park

A calm, friendly, fully offline logic-learning app for children, built with React Native and Expo. Children explore a small cheerful park with **Zuzu**, a round leaf-hatted guide, and solve gentle thinking games with animals, toys, and fruits.

There are **no timers, no countdowns, no penalties, no leaderboards, no coins, no bonuses, no jackpots, and no real-money mechanics**. Progress is celebrated with stickers, stars, and badges that are simple local learning markers only.

## Features

- Five park learning zones, each a different kind of logic game:
  - **Odd Spot Bench** — find the item that does not belong.
  - **Pattern Path** — continue a simple repeating row.
  - **Pair Picnic** — find the matching pair.
  - **Color Garden** — sort items by color.
  - **Size Playground** — sort items by size.
- Three item groups: Animals, Toys, Fruits.
- Three difficulty levels: Easy (2 options), Medium (3 options), Hard (4 options).
- Friendly hints that appear only after a mistake, when enabled.
- Local statistics, progress, and seven achievement badges.
- Parent settings for sound, default difficulty, hints, and answer animation.
- Custom Zuzu app icon, adaptive icon, and park-scene splash screen.

## Child safety notes

Zuzu Logic Park does not use ads, in-app purchases, accounts, analytics, Firebase, external APIs, internet access, social sharing, public profiles, leaderboards, chat, gambling mechanics, loot boxes, real-money mechanics, or behavioral tracking. It does not access the camera, microphone, contacts, calendar, notifications, photo gallery, storage, Bluetooth, sensors, or location.

The experience is calm and pressure-free: no timers, no countdowns, no shaming, and no negative punishment. Mistakes lead to gentle encouragement and an optional hint.

## Zuzu Park Adventure visual style

The home screen is a small cheerful park map of learning stations. Zuzu and all characters, item cards, baskets, and badges are drawn with pure React Native Views and emoji — no heavy image packs, no realistic graphics, no 3D. Colors are bright but calm (soft green grass, gentle sky, rounded white cards, warm accents).

## Logic task rules

Each logic task (Odd Item, Pattern, Pair) runs a short set of rounds with no timer. Tapping the correct answer shows "Great thinking!" and a soft animation; an incorrect tap shows "Good try. Let's look again." and lets the child try again. Questions are generated to be simple and unambiguous: choices never contain duplicates, odd-item tasks always show at least three items so the odd one is clear, pattern tasks always have a clearly repeating sequence, and pair tasks always have exactly one clear match (by shared color).

## Sorting task rules

Sorting tasks (Color, Size) use simple, reliable **tap-to-sort**: tap an item, then tap the basket it belongs in. A correct placement snaps the item into the basket; an incorrect placement returns it to the tray and never resets progress. The task completes when every item is sorted. Color sorting uses Red / Blue / Yellow / Green baskets; size sorting uses Small / Big (and Small / Medium / Big on Hard).

## Hint system

Hints are friendly and optional. They appear as Zuzu's small speech bubble only after a mistake, and only when hints are enabled in Parent Settings. Easy and Medium show a hint after the first mistake; Hard shows it after the second. Hints are never used as a penalty and the child is never shamed for using them.

## No timer / no pressure

There are no timers or countdowns anywhere in the app. Children can take as long as they like on every task.

## No internet / no permissions

The app works fully offline and **requests no runtime permissions**. The Android `permissions` array is empty and the app never adds the `INTERNET` permission. No package that automatically requires internet, ads, analytics, location, camera, microphone, or notifications is used.

## Airplane mode support

Because all data and task content are local and static, the app works normally in airplane mode.

## Fullscreen sticky immersive mode

On Android the app runs edge-to-edge with the status and navigation bars hidden using `SystemBars` from `react-native-edge-to-edge`. System bars reappear only briefly after an edge swipe (sticky immersive behavior).

## Portrait only

Orientation is locked to portrait via `app.json` (`"orientation": "portrait"`).

## Safe area handling

Every screen uses `react-native-safe-area-context` so content never overlaps notches, camera cutouts, or rounded corners.

## Keep awake only on task screens

`expo-keep-awake` is activated only on the active task/game screens (Logic Task and Sorting Task) and is released when leaving them. Static screens (Home, Park Zone, Task Picker, Result, Achievements, Parent Settings) never keep the device awake.

## No ads / no purchases / no accounts / no data collection

The app never shows ads, never offers purchases, never requires an account, and never collects personal data. No names, age, location, device identifiers, or behavioral data are stored.

## No coins / no bonus / no jackpot / no real money rewards

Progress is shown only as badges, stickers, stars, and achievements. These are local learning markers with no money value. The app contains none of the forbidden words: coins, coin, bonus, jackpot, cash, money, reward money, win money, earn money, payout, bet, spin, slot, casino.

## Achievements and progress

Statistics (correct answers, mistakes, completed tasks, hints used) and progress by task mode and item group are stored locally with AsyncStorage. Seven badges can be unlocked:

1. First Park Badge — complete 1 task.
2. Odd Spot Badge — complete 5 Odd Item tasks.
3. Pattern Path Badge — complete 5 Pattern tasks.
4. Pair Picnic Badge — complete 5 Pair tasks.
5. Color Garden Badge — complete 5 Color Sorting tasks.
6. Size Playground Badge — complete 5 Size Sorting tasks.
7. Zuzu Logic Star — complete 25 tasks.

## App icon and splash screen concept

The **icon** shows Zuzu's friendly face on a round green park background, surrounded by small logic cards (a fruit, a toy, an animal, and a puzzle piece) in soft pastel colors. The **splash** is a small park scene: a pastel sky, grass hills, a path to colorful learning stations, Zuzu beside a simple logic board, floating animal/toy/fruit cards, leaves and stars, the title **Zuzu Logic Park**, and the subtitle **"Play, think, and match"**. Custom assets live in `assets/icon.png`, `assets/adaptive-icon.png`, and `assets/splash.png` and are configured in `app.json`.

---

## How to scaffold with the official Expo template

This repository already contains the source. If you are recreating it from scratch, start from the official template and then copy the `src/`, `assets/`, `App.js`, and `app.json` files in:

```bash
npx create-expo-app zuzu-logic-park --template blank
```

## How to install dependencies

Always install packages with `npx expo install` so versions match the Expo SDK:

```bash
npm install
npx expo install --fix
npx expo install \
  @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage \
  react-native-edge-to-edge expo-keep-awake \
  expo-asset expo-constants expo-font expo-modules-core
```

Then verify the environment:

```bash
npx expo-doctor
npx expo install --check
```

Fix any reported issue before continuing.

## How to run locally

```bash
npm install
npx expo start
```

Press `a` to open the Android emulator, or scan the QR code with a development build.

## How to build Android

Generate the native project and build a release:

```bash
npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease   # APK
./gradlew bundleRelease      # AAB
```

Outputs:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## How to generate a PKCS12 keystore

Use the **same password** for the keystore and the key (different passwords can break PKCS12 signing):

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore zuzu-logic-park-release-key.p12 \
  -alias zuzu_logic_park_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

## How to add GitHub Secrets

Convert the keystore to base64:

```bash
# macOS / Linux
base64 -i zuzu-logic-park-release-key.p12 -o keystore-base64.txt
# (or)  base64 zuzu-logic-park-release-key.p12 > keystore-base64.txt
```

Then in your repository: **Settings → Secrets and variables → Actions → New repository secret**, add:

- `ANDROID_KEYSTORE_BASE64` — contents of `keystore-base64.txt`
- `ANDROID_KEYSTORE_PASSWORD` — the keystore password
- `ANDROID_KEY_ALIAS` — `zuzu_logic_park_key`
- `ANDROID_KEY_PASSWORD` — the same password as the keystore

Never commit a real keystore or password to the repository.

## GitHub Actions build explanation

`.github/workflows/android-build.yml` runs on push to `main`. It installs Node and Java, sets up the Android SDK, installs **Platform 35** and **Build Tools 35.0.0**, installs dependencies, runs `expo install --fix`, `expo-doctor`, and `expo install --check`, prebuilds the Android project, decodes the keystore from secrets, applies a release signing config, builds the signed release **APK** and **AAB**, and uploads them as artifacts named `zuzu-logic-park-release.apk` and `zuzu-logic-park-release.aab`. The Android emulator launch smoke-test is intentionally **not** part of CI — launch verification is a local pre-release step (below).

## Google Play compatibility notes

- Targets **Android API 35** (`compileSdkVersion 35`, `targetSdkVersion 35`) via the current Expo SDK / React Native version.
- `minSdkVersion 24`, satisfying the React Native version in use.
- The release AAB supports **Android 15+ 16 KB memory page sizes** (provided by the current React Native version).
- No old native libraries and no Firebase / ads / analytics / payment SDKs are included.
- Avoids the Play errors "must target at least API level 35" and "does not support 16 KB memory page sizes".

### Release optimization (staged)

1. First build and verify a **non-minified** release (`minifyEnabled false`, `shrinkResources false`) — this is the default.
2. Only after that launches successfully, enable standard R8/ProGuard:

   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. Re-test the app launch locally after enabling minify and resource shrinking.

The keep-safe rules are in `android/app/proguard-rules.pro` (ensure this file is present after `expo prebuild`).

## Local launch verification checklist

A successful CI build is **not** proof that the app launches. Before release:

1. Build the release APK.
2. Install it on a physical device or local emulator:
   ```bash
   adb install -r android/app/build/outputs/apk/release/app-release.apk
   ```
3. Launch the app and watch logs:
   ```bash
   adb logcat | grep -i -E "ReactNative|Expo|FATAL|AndroidRuntime"
   ```
4. Confirm there are **no** errors like:
   - "Cannot find native module"
   - "Module has not been registered"
   - "Invariant Violation"
   - "theme.fonts.regular is undefined"
5. Confirm portrait lock, fullscreen sticky immersive bars, safe-area spacing, and that keep-awake is active only on task screens.
6. Confirm the app works in **airplane mode**.

## Useful commands

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo install --check
npx expo start
npx expo run:android
```

## Privacy note

Zuzu Logic Park does not collect, store, or share personal information. The app works offline without internet access. Learning statistics, progress, achievements, and settings are stored only on the device.
