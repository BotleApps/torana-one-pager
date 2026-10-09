"""Build optimized WebP variants for backdrops and named collection sets."""

import os
from PIL import Image
from PIL import ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'backdrops')
OUT = os.path.join(ROOT, 'assets', 'img')
LOGO_SRC = os.path.join(ROOT, 'assets', 'logo', 'IMG_2145.PNG')
LOGO_OUT = os.path.join(ROOT, 'assets', 'logo')
COLLECTIONS_SRC = os.path.join(ROOT, 'assets', 'collections')
COLLECTIONS_OUT = os.path.join(ROOT, 'assets', 'collections-webp')

os.makedirs(OUT, exist_ok=True)


def fit(im, box):
    w, h = im.size
    scale = min(box / max(w, h), 1)
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def backdrops():
    total_in = total_out = 0
    for n in range(1, 21):
        src = os.path.join(SRC, f'IMG_0D1C675FEC95-{n}.jpeg')
        total_in += os.path.getsize(src)
        im = Image.open(src).convert('RGB')
        for suffix, box, q in (('lg', 1400, 74), ('sm', 700, 68)):
            dst = os.path.join(OUT, f'{n}-{suffix}.webp')
            fit(im, box).save(dst, 'WEBP', quality=q, method=6)
            total_out += os.path.getsize(dst)
    print(f'backdrops: {total_in/1e6:.1f} MB -> {total_out/1e6:.1f} MB')


def collections():
    total_in = total_out = image_count = 0
    for folder in sorted(os.scandir(COLLECTIONS_SRC), key=lambda item: item.name.casefold()):
        if not folder.is_dir():
            continue
        slug = folder.name.removesuffix(' Series').casefold().replace(' ', '-')
        output_dir = os.path.join(COLLECTIONS_OUT, slug)
        os.makedirs(output_dir, exist_ok=True)
        files = sorted(
            (name for name in os.listdir(folder.path)
             if os.path.isfile(os.path.join(folder.path, name))),
            key=str.casefold,
        )
        for index, name in enumerate(files, 1):
            src = os.path.join(folder.path, name)
            total_in += os.path.getsize(src)
            image = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
            for suffix, edge, quality in (('lg', 1440, 76), ('sm', 800, 70)):
                dst = os.path.join(output_dir, f'{index:02d}-{suffix}.webp')
                fit(image, edge).save(dst, 'WEBP', quality=quality, method=6)
                total_out += os.path.getsize(dst)
            image_count += 1
    print(f'collections: {image_count} images, {total_in/1e6:.1f} MB -> {total_out/1e6:.1f} MB')


def logo():
    im = Image.open(LOGO_SRC).convert('RGB')
    w, h = im.size
    px = im.load()

    # Background colour sampled from the four corners of the textured plate.
    samples = [px[x, y]
               for x in (2, w - 3) for y in (2, h - 3)]
    bg = tuple(sum(c[i] for c in samples) // len(samples) for i in range(3))

    # The plate is paper-textured, so anything under FLOOR is noise, not ink.
    FLOOR = 0.12
    out = Image.new('RGBA', (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            a = max((bg[i] - v) / bg[i] for i, v in enumerate((r, g, b)))
            a = min(max((a - FLOOR) / (1 - FLOOR), 0.0), 1.0)
            if a <= 0.0:
                op[x, y] = (0, 0, 0, 0)
                continue
            # un-premultiply against the sampled plate colour
            col = tuple(
                min(255, max(0, round(bg[i] + (v - bg[i]) / a)))
                for i, v in enumerate((r, g, b))
            )
            op[x, y] = (*col, round(a * 255))

    out = out.crop(out.getbbox())
    print('trimmed logo:', out.size)

    # Row ink profile -> locate the horizontal gaps between text bands.
    alpha = out.split()[3]
    rows = [sum(alpha.crop((0, y, out.size[0], y + 1)).getdata())
            for y in range(out.size[1])]
    peak = max(rows)
    bands, start = [], None
    for y, v in enumerate(rows):
        ink = v > peak * 0.012
        if ink and start is None:
            start = y
        elif not ink and start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, out.size[1]))
    print('ink bands:', bands)

    out.save(os.path.join(LOGO_OUT, 'torana-lockup.png'), optimize=True)
    fit(out, 900).save(os.path.join(LOGO_OUT, 'torana-lockup.webp'), 'WEBP',
                       quality=92, method=6, lossless=False)

    # Nav variant: everything above the script tagline band.
    cut = bands[-2][0] - 4 if len(bands) > 1 else out.size[1]
    nav = out.crop((0, 0, out.size[0], cut))
    nav = nav.crop(nav.getbbox())
    print('nav lockup:', nav.size)
    fit(nav, 420).save(os.path.join(LOGO_OUT, 'torana-nav.webp'), 'WEBP',
                       quality=92, method=6)
    fit(nav, 420).save(os.path.join(LOGO_OUT, 'torana-nav.png'), optimize=True)

    # Favicon: the lotus finial sitting above the toran bar.
    lw, lh = out.size
    lotus = out.crop((int(lw * 0.38), 0, int(lw * 0.62), int(lh * 0.29)))
    lotus = lotus.crop(lotus.getbbox())
    side = max(lotus.size) + 24
    icon = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    icon.paste(lotus, ((side - lotus.size[0]) // 2, (side - lotus.size[1]) // 2))
    icon.resize((180, 180), Image.LANCZOS).save(
        os.path.join(LOGO_OUT, 'favicon.png'), optimize=True)
    return out, bands


if __name__ == '__main__':
    backdrops()
    collections()
    logo()
