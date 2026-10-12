# Dreame Vacuum Clean — Edistymisen seuranta (PROGRESS.md)

## Tila: Valmis

### Valmistuneet vaiheet
- [x] Repositorio `Tasshack/dreame-vacuum` kloonattu paikallisesti tarkasteltavaksi.
- [x] Telemetria- ja DRM-koodin syväluotaus suoritettu:
  - `frontend.py`: Tunnistettu laitetietojen lähetys (`https://api.tasshack.com/get`), integraation Python-tiedostojen SHA256-tiivisteiden tarkistus ja DRM-salauksen purkaminen.
  - `const.py`: Tunnistettu 272 kt hämärretty `FRONTEND`-base64-paketti ja `CONF_DVC_KEY`.
  - `coordinator.py` & `config_flow.py`: Tunnistettu DVC-avaimen kyselyt ja mainoslinkit.
  - `dreame/protocol.py`: Varmistettu, että IoT-yhteydet ovat vain suoria valmistajan yhteyksiä (Dreame/Xiaomi Cloud), eikä ylimääräisiä kolmannen osapuolen kutsuja ole.
- [x] Eristetty virtuaaliympäristö `.venv` luotu `uv`:lla.
- [x] `PLAN.md` luotu.
- [x] Git-haarojen alustus:
  - `upstream-tracking` seuraa Tasshackin virallista repoa (`upstream/master`).
  - `main` sisältää puhdistetun koodin.
- [x] Puhdistustyö (Vaihe 1):
  - Poistettu `frontend.py` kokonaan (DRM, tiedostojen hashaustarkistukset, laitetietojen lähetys).
  - Siivottu `const.py`: poistettu 272 kt hämärretty `FRONTEND`-blobi ja `DVC`-kuvake.
  - Siivottu `coordinator.py`: poistettu DVC-ilmoitukset ja mainoslinkit.
  - Siivottu `config_flow.py`: poistettu DVC-lisenssiavaimen kysely ja pakotus.
  - Siivottu `__init__.py`: asetettu `frontend = None`.
- [x] JS-karttaoptimoijan purku ja mini-racer-riippuvuuden poisto (Vaihe 2):
  - Purettu ja analysoitu `MAP_OPTIMIZER_JS` REA-työkalulla.
  - Tunnistettu ja verifioitu integraation oma natiivi Python-karttaoptimointialgoritmi.
  - Poistettu `py_mini_racer`-riippuvuus `manifest.json`:sta.
  - Poistettu `MAP_OPTIMIZER_JS`-blobi `resources.py`:stä ja V8-kutsut `map.py`:stä.
  - Otettu käyttöön 100 % natiivi Python-optimointi.
- [x] Laadunvarmistus:
  - Kaikki `.py`-tiedostot validoitu (`compileall`).
  - Varmistettu 0 telemetriakutsua, 0 DRM-tarkistusta ja 0 `mini-racer`-kutsua.
- [x] Upstream-synkronointityökalu luotu (`scripts/sync_upstream.sh`).
- [x] Automaattinen GitHub Actions -julkaisutyönkulku luotu (`.github/workflows/release.yaml`).
- [x] Atomiset git-commitit suoritettu `main`-haaraan.

### Meneillään oleva vaihe: Vaihe 4 — Roskakoritoiminto (Haara: feature/trash-bin-location)
- [x] Eristetty oma kehityshaara `feature/trash-bin-location`.
- [x] Suunnitelma ja arkkitehtuuri kirjattu `PLAN.md`:hen.
- [x] Toteutettu vakiot `CONF_TRASH_BIN_X` ja `CONF_TRASH_BIN_Y` (`const.py`).
- [x] Toteutettu painikkeet `go_to_trash_bin` ja `set_trash_bin_location` (`button.py`).
- [x] Toteutettu palvelu `dreame_vacuum.set_trash_bin_location` ja entiteettikutsut (`vacuum.py`, `services.yaml`).
- [x] Lisätty käännökset ja kuvakkeet (`strings.json`, `translations/en.json`, `translations/fi.json`).
- [x] Luotu kattava testisarja `analysis/test_trash_bin.py` (6/6 testiä hyväksytty).
- [x] Suoritettu syntaksitarkistus `python3 -m compileall` (0 virhettä).
- [x] Päivitetty versio `v2.0.2-clean.3` tiedostoon `manifest.json`.
- [x] Päivitetty `README.md` roskakoritoiminnon kuvauksella (suomi + englanti).
- [x] Yhdistetty `main`-haaraan, julkaistu GitHub Release `v2.0.2-clean.3`.
- [x] Verifioitu live Home Assistantissa: painikkeet luotu ja toiminnassa (`Fifi Aja roskakorille`, `Fifi Tallenna roskakorin sijainti`).
- [x] GitHub asetettu takaisin yksityiseksi (`private`).

### Valmistunut vaihe: Vaihe 3 — Huonekohtaiset siivouspainikkeet (v2.0.2-clean.2)
- [x] Eristetty oma kehityshaara `feature/room-cleaning-buttons`.
- [x] Arkkitehtuuri ja suunnitelma dokumentoitu `PLAN.md`:hen.
- [x] Toteutettu `DreameVacuumSegmentButtonEntity` ja dynaaminen rekisteröinti tiedostoon `button.py`.
- [x] Lisätty lokalisoinnit (`clean_segment`) tiedostoihin `strings.json`, `translations/en.json` ja `translations/fi.json`.
- [x] Luotu ja suoritettu kattava testisarja `analysis/test_segment_buttons.py` (5 testiä, kaikki hyväksytty).
- [x] Suoritettu syntaksitarkistus `python3 -m compileall` (0 virhettä).
- [x] Päivitetty versio `v2.0.2-clean.2` tiedostoon `manifest.json`.
- [x] Päivitetty `README.md` uudella huonepainikeominaisuudella.
- [x] Yhdistetty `main`-haaraan, julkaistu GitHub Release `v2.0.2-clean.2`.
- [x] Verifioitu live Home Assistantissa: huonepainikkeet luotu onnistuneesti (`Fifi Siivoa Eteinen`, `Fifi Siivoa Makuuhuone`, `Fifi Siivoa Olohuone`).
