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
- [x] Puhdistustyö:
  - Poistettu `frontend.py` kokonaan (DRM, tiedostojen hashaustarkistukset, laitetietojen lähetys).
  - Siivottu `const.py`: poistettu 272 kt hämärretty `FRONTEND`-blobi ja `DVC`-kuvake.
  - Siivottu `coordinator.py`: poistettu DVC-ilmoitukset ja mainoslinkit.
  - Siivottu `config_flow.py`: poistettu DVC-lisenssiavaimen kysely ja pakotus.
  - Siivottu `__init__.py`: asetettu `frontend = None`.
- [x] Laadunvarmistus:
  - Kaikki `.py`-tiedostot validoitu (`python3 -m py_compile`).
  - Varmistettu 0 telemetriakutsua tai DRM-tarkistusta.
- [x] Upstream-synkronointityökalu luotu (`scripts/sync_upstream.sh`).
- [x] Atominen git-commit suoritettu `main`-haaraan.

### Vaihe 2: JS-karttaoptimoijan korvaaminen ja mini-racer-riippuvuuden poisto (Haara: feature/map-optimizer-python)
- [x] Eristetty oma kehityshaara `feature/map-optimizer-python`.
- [x] Purettu `custom_components/dreame_vacuum/dreame/resources.py` -tiedoston `MAP_OPTIMIZER_JS` tiedostoon `analysis/map_optimizer_raw.js`.
- [x] Suoritettu staattinen AST/sovellusgraafianalyysi REA-työkalulla (`rea analyze-javascript-application`). Todettu: 0 verkko- tai järjestelmäkutsua, puhtaasti pikseli- ja matriisioperaatioita.
- [x] Dokumentoitu algoritmin rakenne ja tavoite tiedostoon `analysis/findings_map_optimizer.md`.
- [ ] Luodaan testidata ja verifiointiputki (JS vs. Python -vertailu).
- [ ] Toteutetaan vastaava puhdas Python/NumPy-optimointialgoritmi.
- [ ] Poistetaan `mini-racer`-riippuvuus ja päivitetään `map.py`.
