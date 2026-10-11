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
