# Dreame Vacuum Clean — Edistymisen seuranta (PROGRESS.md)

## Tila: Aloitettu

### Valmistuneet vaiheet
- [x] Repositorio `Tasshack/dreame-vacuum` kloonattu paikallisesti tarkasteltavaksi.
- [x] Telemetria- ja DRM-koodin syväluotaus suoritettu:
  - `frontend.py`: Tunnistettu laitetietojen lähetys (`https://api.tasshack.com/get`), integraation Python-tiedostojen SHA256-tiivisteiden tarkistus ja DRM-salauksen purkaminen.
  - `const.py`: Tunnistettu 272 kt hämärretty `FRONTEND`-base64-paketti ja `CONF_DVC_KEY`.
  - `coordinator.py` & `config_flow.py`: Tunnistettu DVC-avaimen kyselyt ja mainoslinkit.
  - `dreame/protocol.py`: Varmistettu, että IoT-yhteydet ovat vain suoria valmistajan yhteyksiä (Dreame/Xiaomi Cloud), eikä ylimääräisiä kolmannen osapuolen kutsuja ole.
- [x] Eristetty virtuaaliympäristö `.venv` luotu `uv`:lla.
- [x] `PLAN.md` luotu.

### Seuraavat askeleet
- [ ] Git-haarojen alustus (`upstream-tracking` ja `clean-master`).
- [ ] Tiedostojen puhdistus ja modulaarinen korjaus (`frontend.py`, `const.py`, `coordinator.py`, `config_flow.py`).
- [ ] Syntaksitarkistus ja haun varmistus.
- [ ] Synkronointityökalun `scripts/sync_upstream.sh` luominen.
- [ ] Dokumentaation ja git-ohjeiden laadinta.
