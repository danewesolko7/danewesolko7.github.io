#!/bin/zsh
# Renders a 1200×630 share image into assets/img/og/<slug>.png
# usage: scripts/make-og.sh <slug> "<kicker>" "<title, *word* = red>" [crumb] [cover1.jpg,cover2.jpg,cover3.jpg]
# Needs a Chromium browser (Chrome or Brave). Set BROWSER=/path/to/binary to override.
set -e
cd "$(dirname "$0")/.."
slug=$1; kicker=$2; title=$3; crumb=${4:-}; covers=${5:-}
browser=${BROWSER:-}
for b in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
  [[ -z $browser && -x $b ]] && browser=$b
done
[[ -z $browser ]] && { echo "No Chrome or Brave found; set BROWSER=" >&2; exit 1; }
enc(){ python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1"; }
url="file://$PWD/scripts/og-card.html?kicker=$(enc "$kicker")&title=$(enc "$title")&crumb=$(enc "$crumb")&covers=$(enc "$covers")"
"$browser" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=5000 --window-size=1200,630 --screenshot="$PWD/assets/img/og/$slug.png" "$url" >/dev/null 2>&1
echo "assets/img/og/$slug.png"
