"""Saca los frames de un vídeo para el hero con scroll.

Uso:
    python tools/extract_frames.py ruta/al/video.mp4 [--frames 90] [--width 1280] [--mobile 720]

Genera en assets/hero/frames/:
    f_0001.webp ... (escritorio), m_0001.webp ... (móvil) y manifest.json.
El hero detecta manifest.json y reproduce los frames con el scroll en lugar de las dos fotos.
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "hero" / "frames"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--frames", type=int, default=90, help="número de frames a guardar")
    ap.add_argument("--width", type=int, default=1280, help="ancho de los frames de escritorio")
    ap.add_argument("--mobile", type=int, default=720, help="ancho de los frames de móvil")
    ap.add_argument("--quality", type=int, default=80)
    args = ap.parse_args()

    video = Path(args.video)
    if not video.exists():
        sys.exit(f"No existe el vídeo: {video}")

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = OUT / "_tmp"
    if OUT.exists():
        shutil.rmtree(OUT)
    tmp.mkdir(parents=True)

    # 1. Todos los frames a PNG temporales
    subprocess.run([ffmpeg, "-v", "error", "-i", str(video), str(tmp / "%05d.png")], check=True)
    raw = sorted(tmp.glob("*.png"))
    if not raw:
        sys.exit("ffmpeg no sacó ningún frame")

    # 2. Muestreo uniforme hasta --frames y conversión a WebP
    n = min(args.frames, len(raw))
    picks = [raw[round(i * (len(raw) - 1) / max(n - 1, 1))] for i in range(n)]
    size = None
    for i, src in enumerate(picks, 1):
        im = Image.open(src).convert("RGB")
        size = im.size
        for prefix, w in (("f", args.width), ("m", args.mobile)):
            out = im.copy()
            if out.width > w:
                out = out.resize((w, round(out.height * w / out.width)), Image.LANCZOS)
            out.save(OUT / f"{prefix}_{i:04d}.webp", quality=args.quality, method=6)

    shutil.rmtree(tmp)
    manifest = {"count": n, "width": size[0], "height": size[1], "desktop": "f_", "mobile": "m_", "ext": "webp"}
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    total = sum(p.stat().st_size for p in OUT.glob("*.webp")) / 1e6
    print(f"{n} frames de {len(raw)} -> {OUT} ({total:.1f} MB en total)")


if __name__ == "__main__":
    main()
