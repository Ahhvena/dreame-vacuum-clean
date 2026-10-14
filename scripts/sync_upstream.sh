#!/usr/bin/env bash
set -euo pipefail

# Dreame Vacuum Clean - Upstream Synkronointiskripti
# Hakee uusimmat päivitykset Tasshackin alkuperäisestä reposta ja siirtää ne siivottuun versioon.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
cd "$REPO_DIR"

UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="master"
CLEAN_BRANCH="main"

echo "=== Dreame Vacuum Clean: Synkronointi ==="

# Varmistetaan, että upstream remote on olemassa
if ! git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
    echo "Virhe: Remote '$UPSTREAM_REMOTE' ei löydy. Lisätään..."
    git remote add "$UPSTREAM_REMOTE" https://github.com/Tasshack/dreame-vacuum.git
fi

echo "1. Haetaan uusimmat tiedot upstream-reposta..."
git fetch "$UPSTREAM_REMOTE" --tags

echo "2. Päivitetään paikallinen 'upstream-tracking' -haara..."
git checkout upstream-tracking
git merge --ff-only "${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}" || {
    echo "Pika-etumatka (ff-only) epäonnistui, nollataan upstream-tracking tilaan ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}..."
    git reset --hard "${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}"
}

echo "3. Palataan siivottuun työkappaleeseen ($CLEAN_BRANCH)..."
git checkout "$CLEAN_BRANCH"

echo "4. Yhdistetään upstream-tracking -> $CLEAN_BRANCH (rebase suositeltu)..."
if git rebase -X ignore-space-at-eol upstream-tracking; then
    echo "Rebase onnistui suoraan ilman konflikteja!"
else
    echo "Huomio: Rebase kohtasi konflikteja. Ratkaise ne tai keskeytä: git rebase --abort"
    exit 1
fi

echo "5. Varmistetaan että telemetriatiedostot pysyvät poissa..."
if [ -f "custom_components/dreame_vacuum/frontend.py" ]; then
    echo "frontend.py palasi upstreamista, poistetaan se..."
    git rm "custom_components/dreame_vacuum/frontend.py"
    git commit -m "chore: strip upstream frontend.py after sync" || true
fi

echo "=== Synkronointi valmis! ==="
