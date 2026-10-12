# Dreame Vacuum (Clean Edition) 🧹✨

[![GitHub Release](https://img.shields.io/github/v/release/Valtteri-H/dreame-vacuum-clean?style=for-the-badge&color=18bcf2)](https://github.com/Valtteri-H/dreame-vacuum-clean/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom%20Repo-orange.svg?logo=HomeAssistantCommunityStore&color=18bcf2&logoColor=white&style=for-the-badge)](https://hacs.xyz/)
[![Validated](https://img.shields.io/badge/Hassfest-Passing-success?style=for-the-badge&logo=homeassistant&logoColor=white)](https://github.com/Valtteri-H/dreame-vacuum-clean/actions)

Täysin avoin, telemetriaton, DRM-vapaa ja itsenäinen Home Assistant -integraatio **Dreame**, **MOVA**, **Mijia** ja **Trouver** -robotti-imureille.

Tämä versio perustuu [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) -integraatioon, josta on poistettu kaikki kyseenalaiset suljetun koodin DRM-mekanismit, telemetriaseuranta ja raskaat V8-C++ -ajonaikaiset riippuvuudet.

---

## 🛡️ Mitä on siivottu ja parannettu?

1. **Ei telemetriaa tai laitetietojen keruuta:**
   - Poistettu kaikki yhteydenotot ja laitetietojen lähetys kolmansien osapuolten palvelimille (`api.tasshack.com`).
   - Kaikki liikenne kulkee ainoastaan Home Assistantin, paikallisen imurin ja valmistajan virallisen pilvipalvelun välillä.
2. **Ei DRM-lukituksia tai maksullisia avaimia:**
   - Poistettu `dvc_key`-lisenssiavaimen pakotus ja maksulliset rajoitukset. Laitteet ja toiminnot ovat heti käytettävissä.
3. **Ei koodin peukalointitarkistuksia:**
   - Poistettu Python-tiedostojen SHA256-tiivisteiden laskenta (`gvh`/`gsh`) ja DRM-salauksenpurkurutiinit.
4. **Ei hämärrettyjä paketteja:**
   - Poistettu 272 kt kokoinen hämärretty `FRONTEND`-base64-blobi `const.py`-tiedostosta sekä mainosviestit.
5. **Natiivi Python-karttaoptimointi (Ei enää `mini-racer`-kaatumisia):**
   - Korvattu erillinen C++/V8 JavaScript -moottoririippuvuus (`mini-racer`, `MAP_OPTIMIZER_JS`) integraation omalla natiivilla Python/NumPy-optimointialgoritmilla.
   - Integraatio on nyt kevyt, itsenäinen ja toimii vakaasti kaikilla Home Assistant -alustoilla (ARM, Alpine/musl, Linux).
6. **Automaattiset huonekohtaiset siivouspainikkeet (One-click Room Cleaning):**
   - Luo automaattisesti jokaiselle kartan huoneelle oman dynaamisen `button`-entiteetin (esim. `button.fifi_clean_eteinen`).
   - Pysyvä `unique_id` (segment_id) takaa, että huoneiden uudelleennimeäminen ei koskaan riko automaatioita tai dashboard-painikkeita.
7. **Roskakoritoiminto (Aja roskakorille / Go to Trash Bin):**
   - Painike `button.<imuri>_go_to_trash_bin`: Ajaa imurin suoraan roskakorin eteen odottamaan tyhjennystä. Toinen painallus palauttaa imurin takaisin telakkaan.
   - Painike `button.<imuri>_set_trash_bin_location` & palvelu `dreame_vacuum.set_trash_bin_location`: Tallentaa nykyisen sijainnin roskakoriksi yhdellä klikkauksella.
8. **Integroitu Lovelace-karttakortti suomen kielellä & roskakorituella (All-in-One):**
   - Sisältää valmiiksi integroidun avoimen lähdekoodin `dreame-vacuum-map-card` -käyttöliittymäkortin.
   - Käännetty suoraan lähdekoodista: sisältää täyden **suomenkielisen lokalisoinnin** ja suoran **"Aja roskakorille" -painikkeen** kortin toimintorivillä!
   - Rekisteröityy automaattisesti Home Assistantiin heti asennuksen jälkeen ilman erillistä HACS Lovelace -asennusta (`type: custom:dreame-vacuum-map-card`).

---

## 🤖 Tekoälyavusteinen kehitys ja auditointi

Täysin vibekoodattu projekti

---

## 📌 Versionumerointi

Tämä projekti seuraa **upstream-peilaus- ja patch-versiointia**:
`v<UPSTREAM_VERSIO>-clean.<PATCH>`

* **Ensimmäinen osa (`v2.0.2`):** Vastaa suoraan alkuperäisen [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) -integraation virallista julkaisuversiota ja sen laitetukea.
* **Jälkimmäinen osa (`-clean.1`, `-clean.2` jne.):** Kertoo tämän puhdistetun ja itsenäisen version omat päivitykset ja parannukset.
* Esimerkki: `v2.0.2-clean.2` = Tasshackin `v2.0.2`-versioon pohjautuva puhdistettu versio, jossa on lisäksi huonekohtaiset siivouspainikkeet.

---

## 🚀 Asennus Home Assistantiin (HACS)

### 1. Lisää HACS:iin Custom Repositoryna
1. Avaa Home Assistant ja mene kohtaan **HACS** -> **Integrations**.
2. Klikkaa oikean yläkulman valikkoa `⋮` ja valitse **Custom repositories** (Omat tietovarastot).
3. Täytä tiedot:
   - **Repository:** `https://github.com/Valtteri-H/dreame-vacuum-clean`
   - **Type / Tyyppi:** `Integration`
4. Paina **Add** (Lisää).

### 2. Lataa ja käynnistä uudelleen
1. Etsi HACS:sta **Dreame Vacuum (Clean)**.
2. Valitse **Download** (Lataa) ja valitse uusin julkaisu (esim. `v2.0.2-clean.2`).
3. Käynnistä Home Assistant uudelleen: **Asetukset** -> **Järjestelmä** -> **Käynnistä uudelleen**.

### 3. Ota imuri käyttöön
- Mene: **Asetukset** -> **Laitteet ja palvelut** -> **Lisää integraatio** -> Etsi *Dreame Vacuum*.
- Kirjaudu sisään Dreamehome-, Xiaomi Home- tai MOVA-tunnuksillasi (tai syötä paikallinen IP ja Token).

---

## 🔄 Upstream-päivitykset

Päivitykset Tasshackin virallisesta repositoriosta voidaan tuoda helposti mukaan valmiilla synkronointityökalulla:

```bash
./scripts/sync_upstream.sh
```

---

## 📜 Lisenssi & Alkuperä

- Alkuperäinen integraatio: [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) (Apache-2.0 License)
- Integroitu karttakortti: [noambergauz/dreame-vacuum-map-card](https://github.com/noambergauz/dreame-vacuum-map-card) (MIT License, Copyright (c) 2023 Noam Bergauz)
- Lisenssi: [Apache-2.0 License](LICENSE)

---
---

# English Documentation 🇬🇧

A fully open, telemetry-free, DRM-free and standalone Home Assistant integration for **Dreame**, **MOVA**, **Mijia**, and **Trouver** robot vacuums.

This edition is based on [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum), with all proprietary DRM mechanisms, telemetry tracking, and fragile V8/JavaScript C++ runtime dependencies removed.

---

## 🛡️ What was cleaned and improved?

1. **No telemetry or device data leakage:**
   - Removed all calls and data transmissions to third-party tracking servers (`api.tasshack.com`).
   - Network traffic is strictly limited to Home Assistant, your local vacuum, and official manufacturer cloud services.
2. **No DRM locks or paywalled license keys:**
   - Removed mandatory `dvc_key` license checks and paywalled restrictions. All features and devices are directly available.
3. **No anti-tamper or integrity checks:**
   - Removed SHA256 file hashing verification (`gvh`/`gsh`) and DRM decryption routines.
4. **No obfuscated payload blobs:**
   - Removed the 272 KB obfuscated `FRONTEND` base64 blob from `const.py` along with promotional messages.
5. **Native Python map optimization (No more `mini-racer` crashes):**
   - Replaced external C++/V8 JavaScript runtime dependency (`mini-racer`, `MAP_OPTIMIZER_JS`) with the integration's native Python/NumPy map optimization algorithm.
   - Lightweight, standalone, and reliable across all Home Assistant host architectures (ARM, Alpine/musl, Linux).
6. **Automatic per-room cleaning buttons (One-click Room Cleaning):**
   - Automatically generates a dynamic `button` entity for every room segment on the map (e.g. `button.fifi_clean_kitchen`).
   - Persistent `unique_id` (anchored to `segment_id`) guarantees that renaming rooms in the mobile app never breaks Home Assistant automations or dashboard buttons.
7. **Trash bin navigation (Go to Trash Bin):**
   - Button `button.<vacuum>_go_to_trash_bin`: Sends the robot directly to your trash bin for dustbin emptying. Pressing it again sends the robot back to the dock.
   - Button `button.<vacuum>_set_trash_bin_location` & service `dreame_vacuum.set_trash_bin_location`: Saves the current robot coordinates as the trash bin spot with one click.
8. **Integrated Lovelace Map Card with Finnish localization & Trash Bin support (All-in-One):**
   - Bundles the open-source `dreame-vacuum-map-card` frontend component directly inside this integration.
   - Built directly from source: includes complete **Finnish localization** and a native **"Go to Trash Bin" button** right in the card action buttons!
   - Automatically registers into Home Assistant's Lovelace resources upon setup (`type: custom:dreame-vacuum-map-card`) — no need to install a separate frontend repository in HACS.

---

## 🤖 AI-Assisted Development & Auditing

Vibe-coded project powered by AI agents.

---

## 📌 Versioning Scheme

This project follows an **upstream-mirroring and patch-versioning scheme**:  
`v<UPSTREAM_VERSION>-clean.<PATCH>`

* **First part (`v2.0.2`):** Matches the official upstream [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) release version and device definitions.
* **Second part (`-clean.1`, `-clean.2`, etc.):** Represents releases and enhancements specific to this clean edition.
* *Example:* `v2.0.2-clean.2` = Based on upstream `v2.0.2`, including clean patches plus dynamic per-room cleaning button entities.

---

## 🚀 Installation via HACS

### 1. Add as a Custom Repository
1. Open Home Assistant and navigate to **HACS** -> **Integrations**.
2. Click the top-right three dots `⋮` and select **Custom repositories**.
3. Fill in the details:
   - **Repository:** `https://github.com/Valtteri-H/dreame-vacuum-clean`
   - **Type:** `Integration`
4. Click **Add**.

### 2. Download and Restart
1. Search for **Dreame Vacuum (Clean)** in HACS.
2. Click **Download** and select the latest release (e.g. `v2.0.2-clean.2`).
3. Restart Home Assistant: **Settings** -> **System** -> **Restart**.

### 3. Add the Integration
- Go to: **Settings** -> **Devices & Services** -> **Add Integration** -> Search for *Dreame Vacuum*.
- Sign in with your Dreamehome, Xiaomi Home, or MOVA credentials (or provide local IP and Token).

---

## 🔄 Upstream Synchronization

Syncing new device profiles and updates from the official upstream repository:

```bash
./scripts/sync_upstream.sh
```

---

## 📜 License & Credits

- Original Project: [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) (Apache-2.0 License)
- Bundled Map Card: [noambergauz/dreame-vacuum-map-card](https://github.com/noambergauz/dreame-vacuum-map-card) (MIT License, Copyright (c) 2023 Noam Bergauz)
- License: [Apache-2.0 License](LICENSE)
