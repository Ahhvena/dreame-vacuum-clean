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

## Työvaiheiden tarkistuslista (Checklist)
- [ ] 1. Projektin tilan alustus: luodaan `PLAN.md` ja `PROGRESS.md`.
- [ ] 2. Git-haarojen valmistelu: nimetään upstream-remote `upstream`iksi ja luodaan `clean-master`-haara.
- [ ] 3. Puhdistustyö:
  - [ ] 3.1 Poistetaan `frontend.py` (DRM, SHA256-tiedostotarkistukset, `api.tasshack.com`-telemetria).
  - [ ] 3.2 Siivotaan `const.py` (`FRONTEND`-jättiblobi, `CONF_DVC_KEY`, `DVC`).
  - [ ] 3.3 Siivotaan `coordinator.py` (DVC-ilmoitukset).
  - [ ] 3.4 Siivotaan `config_flow.py` (DVC-konfigurointivaiheet ja linkit).
  - [ ] 3.5 Siivotaan `__init__.py` ja tarkistetaan integraation lataus ilman `frontend.py`tä.
- [ ] 4. Synkronointityökalun luominen (`scripts/sync_upstream.sh`).
- [ ] 5. Laadunvarmistus ja testaus:
  - [ ] 5.1 Syntaksitarkistus (`py_compile`) kaikille muokatuille moduuleille.
  - [ ] 5.2 Haku: varmistetaan, ettei koodissa ole enää yhtään viittausta `tasshack.com`-palvelimille tai DRM-hasheihin.
  - [ ] 5.3 Simuloitu komponentin alustus/import-tarkistus.
- [ ] 6. Dokumentaatio: luodaan `README.md`, jossa ohjeistetaan asennus Home Assistantiin ja synkronointi.
- [ ] 7. Ohjeet käyttäjälle yksityisen GitHub-repon luomiseen ja koodin puskemiseen.

## Testausstrategia
- Staattinen analyysi ja syntaksitarkistus kaikille `.py`-tiedostoille (`python3 -m py_compile`).
- Grep-haku: 0 osumaa `tasshack.com` tai `dvc_key` aktiivisessa koodissa.
- Python-ajotesti: `import custom_components.dreame_vacuum` (mockatulla HA:lla tai ilman virheitä perusmoduuleissa).
