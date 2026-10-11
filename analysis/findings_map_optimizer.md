# Karttaoptimoijan analyysi (findings_map_optimizer.md)

## Tausta & Tarkoitus
Alkuperäinen `dreame-vacuum`-integraatio suorittaa siivouskartan pikseli- ja matriisioptimoinnin JavaScript-koodilla (`MAP_OPTIMIZER_JS`), jota ajetaan Python-backendistä `mini-racer`-kirjaston (V8-moottori) kautta.

### Miksi korvaaminen on tarpeen?
1. **Alustariippuvuudet:** `mini-racer` kääntää raskaan V8-C++ -moottorin. Se kaatuu ja aiheuttaa asennusongelmia useilla Home Assistant -alustoilla (ARM, Alpine/musl, erikoisemmat Linux-jakelut).
2. **Integraation itsenäisyys:** Korvaamalla tämä algoritmi puhtaalla Pythonilla / NumPylla saadaan integraatiosta täysin alustariippumaton ja kevyempi.

## REA-analyysin tulokset (`analysis/map_optimizer_raw.js`)
- **Pituus:** 1007 riviä (purettu ja formatoitu).
- **Turvallisuus:** 0 järjestelmä- tai verkkokutsua. Koodi ei tee telemetriaa, tiedostolukuja eikä verkko-operaatioita.
- **Toiminta:**
  - Pääfunktio: `optimize(data, data_size, saved_data, saved_data_size, charger_position)`.
  - Syöte: 2D-pikselitaulukko kartan huoneista, esteistä ja seinistä (`data`), kartan mitat ja lataustelakan koordinaatit.
  - Toiminnallisuus:
    1. Tulvatäyttö / flood-fill (rajojen ja ulkopuolisten pikselien merkkaus).
    2. Kohinanpoisto ja reunojen tasoitus.
    3. Huoneiden segmentointi ja sovittaminen tallennetun referenssikartan (`saved_data`) koordinaatistoon.
  - Tuloste: Optimoitu 2D-pikselitaulukko ja uudet mitat (`dimensions`).

## Seuraavat askeleet
- [ ] Luodaan testisyöte (mock/näytekarttadata) ja verifioidaan JS-tuloste `node index.js` -ajolla.
- [ ] Toteutetaan vastaava puhdas Python/NumPy-funktio.
- [ ] Verrataan Python-funktion tulostetta JS-tulosteeseen 1:1.
- [ ] Korvataan `MiniRacer`-kutsu `map.py`:ssä ja poistetaan riippuvuus `manifest.json`:sta.
