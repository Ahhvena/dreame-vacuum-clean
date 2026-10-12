# Dreame Vacuum Clean — Projektisuunnitelma (PLAN.md)

## Tavoite
Luoda `Tasshack/dreame-vacuum` -Home Assistant -integraatiosta täysin avoin ja puhdistettu versio, josta on poistettu:
1. Kaikki telemetria ja laitetietojen lähetys ulkoisille palvelimille (`api.tasshack.com`).
2. Suljettu, maksullinen DRM- ja lisenssiavainjärjestelmä (`dvc_key`, Dreame Vacuum Card).
3. Integraation omien Python-tiedostojen tiivisteiden laskenta ja peukalointitarkistukset (`gvh`/`gsh`-hasheja hyödyntävä koodi).
4. Suuri (n. 272 kt) hämärretty `FRONTEND`-base64-blobi `const.py`-tiedostosta sekä mainosviestit.

Lisäksi luodaan selkeä haararakenne ja synkronointityökalu, jolla tulevat upstream-päivitykset (uudet imurimallit, protokollakorjaukset, karttaparannukset) saadaan helposti ja puhtaasti tuotua omaan yksityiseen GitHub-repositorioon.

## Arkkitehtuuri ja komponentit
- **Haararakenne (Git):**
  - `upstream-tracking`: Puhdas upstream-haara, joka seuraa suoraan `https://github.com/Tasshack/dreame-vacuum.git` (`master` / julkaisutagit).
  - `clean-master` (tai `main`): Siivottu tuotantohaara, joka sisältää vain vapaat, siivotut integraatiokoodit.
- **Puhdistettavat moduulit:**
  - `custom_components/dreame_vacuum/frontend.py`: Poistetaan kokonaan (tai korvataan tyhjällä dummyllä). Integraation `__init__.py` on jo valmiiksi koodattu käsittelemään `frontend`-moduulin puuttuminen (`try ... except ModuleNotFoundError: frontend = None`).
  - `custom_components/dreame_vacuum/const.py`: Poistetaan `FRONTEND`-blobi, `CONF_DVC_KEY` ja `DVC`-kuvake.
  - `custom_components/dreame_vacuum/coordinator.py`: Poistetaan DVC-kortin asennuskehotukset ja ilmoitukset.
  - `custom_components/dreame_vacuum/config_flow.py`: Poistetaan DVC-lisenssiavainkenttä ja siihen liittyvät promo-linkit asetuksista.
  - `custom_components/dreame_vacuum/strings.json` & käännökset: Siivotaan dvc-avaimeen liittyvät merkkijonot tarvittaessa.
- **Päivitysten synkronointi (`scripts/sync_upstream.py`):**
  - Yksinkertainen automaatioskripti, joka noutaa uusimmat upstream-muutokset ja soveltaa siivouksen.

## Riippuvuudet
- Python 3.12+ / 3.14 (Home Assistant -yhteensopiva ympäristö)
- `uv` virtuaaliympäristölle ja testaukselle
- Git versionhallintaan ja haarojen yhdistämiseen

## Suunnitelma: Roskakoritoiminto — Aja roskakorille (Vaihe 4)

### Tavoite
Mahdollistaa imurin ajaminen suoraan roskakorin viereen pölysäiliön tyhjennystä varten ja palauttaminen telakkaan yhdellä painalluksella.

### Arkkitehtuuri
1. **Koordinaattien tallennus:**
   - Tallennetaan pysyvästi `coordinator.config_entry.options` -sanakirjaan avaimilla `trash_bin_x` ja `trash_bin_y`.
2. **Entiteetit (`button.py`):**
   - `button.<imuri>_go_to_trash_bin`:
     - Jos imuri telakassa -> ajaa roskakorin koordinaatteihin (`device.go_to(x, y)`).
     - Jos imuri on jo roskakorilla / pois telakasta -> palauttaa telakkaan (`device.return_to_base()`).
     - Kuvake: `mdi:trash-can-outline`.
   - `button.<imuri>_set_trash_bin_location`:
     - Lukee imurin nykyisen robot_position (`x`, `y`) ja tallentaa sen options-asetuksiin.
     - Kuvake: `mdi:map-marker-check`.
3. **Palvelu (`vacuum.py` / `services.yaml`):**
   - `dreame_vacuum.set_trash_bin_location`: ottaa parametrit `x` ja `y` (tai lukee nykyisen sijainnin).
4. **Käännökset:**
   - Lisätään `go_to_trash_bin` ("Aja roskakorille" / "Go to Trash Bin") ja `set_trash_bin_location` ("Tallenna roskakorin sijainti" / "Set Trash Bin Location") tiedostoihin `strings.json`, `en.json`, `fi.json`.

### Työvaiheet
- [x] 1. Toteutetaan roskakorin tallennus ja painikkeet (`button.py`).
- [x] 2. Lisätään palvelukutsu (`vacuum.py`, `services.yaml`).
- [x] 3. Lisätään käännökset ja kuvakkeet (`strings.json`, `en.json`, `fi.json`).
- [x] 4. Kirjoitetaan yksikkötesti `analysis/test_trash_bin.py` ja ajetaan `compileall`.
- [x] 5. Päivitetään `PROGRESS.md`, `README.md` ja nostetaan versio `v2.0.2-clean.3`.
- [x] 6. Yhdistetään `main`-haaraan, julkaistaan GitHubiin ja verifioidaan Home Assistantissa.

---

## Suunnitelma: Huonekohtaiset siivouspainikkeet (Vaihe 3)

### Tavoite
Luoda Home Assistantiin dynaamiset `button`-entiteetit jokaiselle imurin kartassa olevalle huoneelle (`Segment`), jotta käyttäjä voi yhdellä painalluksella (tai fyysisellä Zigbee-napilla/automaatiolla) käynnistää tietyn huoneen siivouksen ilman palvelukutsuja tai skriptejä.

### Arkkitehtuuri
1. **Pysyvä ankkurointi (`unique_id`):**
   - Muoto: `{device_mac}_segment_{segment_id}_clean`.
   - Varmistaa, että nimenmuutokset eivät riko Home Assistantin automaatioita.
2. **Dynaaminen elinkaari (`async_update_segment_buttons`):**
   - Rekisteröidään kuuntelija `coordinator.async_add_listener`.
   - Kun kartasta löytyy uusia segmenttejä -> lisätään uudet painikkeet lennossa (`async_add_entities`).
   - Jos segmentti poistuu kartasta -> merkitään painike `available = False`.
3. **Nimien päivitys:**
   - Painikkeen nimi ottaa huomioon `segment.custom_name` tai `segment.name`.
   - Jos huone nimetään uudelleen sovelluksessa, painikkeen nimi päivittyy automaattisesti.
4. **Toiminto (`async_press`):**
   - Kutsuu `await self._try_command("Unable to call %s", self.device.clean_segment, self.segment_id)`.

### Työvaiheet
- [x] 1. Toteutetaan `DreameVacuumSegmentButtonEntity` ja dynaaminen rekisteröinti tiedostoon `custom_components/dreame_vacuum/button.py`.
- [x] 2. Lisätään tarvittavat käännösavaimet ja kuvakkeet (`mdi:broom` tai huonekohtainen `segment.icon`).
- [x] 3. Suoritetaan laadunvarmistus ja syntaksitarkistus (`compileall`).
- [x] 4. Testataan testiskriptillä ja mock-koordinaattorilla (`analysis/test_segment_buttons.py`).
- [x] 5. Päivitetään `PROGRESS.md`, `README.md` ja nostetaan versio `v2.0.2-clean.2`.
- [x] 6. Yhdistetään `main`-haaraan, commitoidaan ja julkaistaan GitHubiin.
- [x] 7. Verifioidaan Home Assistantissa live-laiteella ("Fifi").

---

## Työvaiheiden tarkistuslista (Checklist)
- [x] 1. Projektin tilan alustus: luodaan `PLAN.md` ja `PROGRESS.md`.
- [x] 2. Git-haarojen valmistelu: nimetään upstream-remote `upstream`iksi ja luodaan `main`-haara.
- [x] 3. Puhdistustyö (Vaihe 1):
  - [x] 3.1 Poistettu `frontend.py` (DRM, SHA256-tiedostotarkistukset, `api.tasshack.com`-telemetria).
  - [x] 3.2 Siivottu `const.py` (`FRONTEND`-jättiblobi, `CONF_DVC_KEY`, `DVC`).
  - [x] 3.3 Siivottu `coordinator.py` (DVC-ilmoitukset).
  - [x] 3.4 Siivottu `config_flow.py` (DVC-konfigurointivaiheet ja linkit).
  - [x] 3.5 Siivottu `__init__.py` ja tarkistettu integraation lataus ilman `frontend.py`tä.
- [x] 4. JS-karttaoptimoijan korvaaminen ja riippuvuuksien poisto (Vaihe 2):
  - [x] 4.1 Analysoitu `MAP_OPTIMIZER_JS` REA-työkaluilla (0 ulkoista kutsua).
  - [x] 4.2 Tunnistettu ja otettu käyttöön integraation oma natiivi Python-algoritmi.
  - [x] 4.3 Poistettu `mini-racer`-riippuvuus `manifest.json`:sta ja `map.py`:stä.
  - [x] 4.4 Poistettu hämärretty `MAP_OPTIMIZER_JS` `resources.py`:stä.
- [x] 5. Synkronointi- ja julkaisutyökalut:
  - [x] 5.1 Luotu `scripts/sync_upstream.sh` tulevia päivityksiä varten.
  - [x] 5.2 Luotu `.github/workflows/release.yaml` automaattiseen HACS-zip-paketointiin.
- [x] 6. Laadunvarmistus ja testaus:
  - [x] 6.1 Syntaksitarkistus (`compileall`) kaikille moduuleille (0 virhettä).
  - [x] 6.2 Haku: varmistettu 0 osumaa `tasshack.com`, `dvc_key` tai `mini-racer`.
  - [x] 6.3 Aliagenttien riippumaton turvallisuus- ja HA-auditointi (100 % puhdas).
  - [x] 6.4 Testattu asennus ja toiminta live Home Assistantissa (`vacuum.fifi` -> `state: docked`).
- [x] 7. Dokumentaatio ja julkaisu:
  - [x] 7.1 Luotu moderni `README.md` (HACS-asennusohje, tekoälymaininta).
  - [x] 7.2 Julkaistu GitHub Release `v2.0.2-clean.1` repositoriossa `Valtteri-H/dreame-vacuum-clean`.

## Testausstrategia
- Staattinen analyysi ja syntaksitarkistus kaikille `.py`-tiedostoille (`python3 -m py_compile`).
- Grep-haku: 0 osumaa `tasshack.com` tai `dvc_key` aktiivisessa koodissa.
- Python-ajotesti: `import custom_components.dreame_vacuum` (mockatulla HA:lla tai ilman virheitä perusmoduuleissa).
