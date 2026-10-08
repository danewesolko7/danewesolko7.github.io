#!/usr/bin/env python3
"""Makes the WebP files the site serves from the JPG masters in assets/img/.

usage: python3 scripts/make-webp.py   (needs Pillow: pip install pillow)

For every assets/img/{covers,graphic,work}/<name>.jpg it writes <name>.webp,
scaled down to MAX_WIDTH for its folder (twice the largest size the layouts show
it at), plus <name>-720.webp when the result is wider than 1000px (pages use it
in srcset for phones). Use the printed size for width/height in the markup.
The JPGs stay in the repo as masters and for scripts/make-og.sh, but aren't
published (see `exclude:` in _config.yml).
Re-run after adding or replacing an image; unchanged files are skipped.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "assets" / "img"
QUALITY = 82
SMALL = 720
MAX_WIDTH = {"covers": 480, "graphic": 600}


def save(img, out, src):
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return
    # Write then rename, so a running `jekyll serve` never copies a half-written file.
    tmp = out.with_name(out.name + ".tmp")
    img.save(tmp, "WEBP", quality=QUALITY, method=6)
    tmp.replace(out)
    print(f"{out.relative_to(ROOT.parent.parent)}  {img.width}×{img.height}  {out.stat().st_size // 1024} KB")


for src in sorted(ROOT.glob("*/*.jpg")):
    if src.parent.name not in ("covers", "graphic", "work"):
        continue
    img = Image.open(src).convert("RGB")
    cap = MAX_WIDTH.get(src.parent.name)
    if cap and img.width > cap:
        img = img.resize((cap, round(img.height * cap / img.width)), Image.LANCZOS)
    save(img, src.with_suffix(".webp"), src)
    if img.width > 1000:
        small = img.resize((SMALL, round(img.height * SMALL / img.width)), Image.LANCZOS)
        save(small, src.with_name(f"{src.stem}-{SMALL}.webp"), src)
