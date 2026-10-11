# Dreame Vacuum (Clean Edition) 🧹✨

[![GitHub Release](https://img.shields.io/github/v/release/Ahhvena/dreame-vacuum-clean?style=for-the-badge&color=18bcf2)](https://github.com/Ahhvena/dreame-vacuum-clean/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom%20Repo-orange.svg?logo=HomeAssistantCommunityStore&color=18bcf2&logoColor=white&style=for-the-badge)](https://hacs.xyz/)
[![Validated](https://img.shields.io/badge/Hassfest-Passing-success?style=for-the-badge&logo=homeassistant&logoColor=white)](https://github.com/Ahhvena/dreame-vacuum-clean/actions)

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

---

## 🤖 Tekoälyavusteinen kehitys ja auditointi

Tämän puhdistetun version analyysi, koodin refaktorointi ja turvallisuusauditointi on toteutettu tekoälyagenttien avulla:
- **Arkkitehtuuri & Orkestrointi:** [Hermes Agent](https://hermes-agent.nousresearch.com/) (Nous Research).
- **Reverse Engineering & Staattinen analyysi:** [REA (Reverse Engineer Anything)](https://github.com/morluto/rea) -työkalut JavaScript-AST:n ja koodivirtojen kartoittamiseen.
- **Riippumaton auditointi:** Suoritettu rinnakkaisilla aliagenteilla (0 ulkoista verkkokutsua, 0 DRM-tarkistusta, 100 % Python-syntaksi- ja HA-yhteensopivuus).

---

## 🚀 Asennus Home Assistantiin (HACS)

Helpoin tapa asentaa integraatio (sekä omaan että perheenjäsenten Home Assistantiin):

### 1. Lisää HACS:iin Custom Repositoryna
1. Avaa Home Assistant ja mene kohtaan **HACS** -> **Integrations**.
2. Klikkaa oikean yläkulman valikkoa `⋮` ja valitse **Custom repositories** (Omat tietovarastot).
3. Täytä tiedot:
   - **Repository:** `https://github.com/Ahhvena/dreame-vacuum-clean`
   - **Type / Tyyppi:** `Integration`
4. Paina **Add** (Lisää).

### 2. Lataa ja käynnistä uudelleen
1. Etsi HACS:sta **Dreame Vacuum** (tai *Dreame Vacuum Clean*).
2. Valitse **Download** (Lataa) ja hyväksy uusin versio (esim. `v2.0.2-clean.1`).
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

- Alkuperäinen projekti: [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum)
- Lisenssi: [Apache-2.0 License](LICENSE)
