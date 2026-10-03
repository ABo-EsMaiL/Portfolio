"""Offline T009 portrait pipeline; run from project-local Python 3.12 venv.
Setup (uv uses an existing interpreter; no global install):
  UV_CACHE_DIR=.tools/uv-cache uv venv --python <existing-python-3.12> .tools/portrait-venv
  UV_CACHE_DIR=.tools/uv-cache uv pip install --python .tools/portrait-venv/Scripts/python.exe rembg[cpu]==2.0.85 onnxruntime==1.30.0 Pillow==12.3.0
Run: .tools/portrait-venv/Scripts/python.exe scripts/process_portrait.py
Resize/export only: add --reuse-reviewed-matte (verifies original and archived matte hashes).
First run downloads only the model to .tools/models; image never leaves this process.
The source is never written. Anchors are manually measured, not model detections.
"""
import hashlib
import gc
import importlib.metadata
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
for key, relative in {
    'U2NET_HOME': '.tools/models', 'NUMBA_CACHE_DIR': '.tools/numba-cache',
    'XDG_CACHE_HOME': '.tools/cache', 'MPLCONFIGDIR': '.tools/matplotlib',
    'UV_CACHE_DIR': '.tools/uv-cache', 'UV_PYTHON_INSTALL_DIR': '.tools/python',
    'TEMP': 'tmp', 'TMP': 'tmp', 'TMPDIR': 'tmp',
}.items():
    os.environ[key] = str(ROOT / relative)
    (ROOT / relative).mkdir(parents=True, exist_ok=True)

import numpy as np
from PIL import Image, ImageDraw
from rembg import new_session
from rembg.bg import alpha_matting_cutout
from scipy.ndimage import distance_transform_edt

SOURCE = ROOT / 'Picsart_26-07-31_23-36-42-453.jpg.jpeg'
SOURCE_SHA = 'b7d08c04b6759e21e6f58df44069329584ed4c826891066f7473fe800add15e4'
MODEL_SHA = '60920e99c45464f2ba57bee2ad08c919a52bbf852739e96947fbb4358c0d964a'
SIZE = (3072, 4096)
# Source pixels, measured against original/100% face detail and silhouette.
# Face excludes top hair, includes ears and forehead through chin; HUD geometry only.
RECTS = {'faceBox': (1224, 196, 632, 804), 'heroCrop': (576, 48, 1920, 1920),
         'aboutCrop': (576, 48, 1920, 3648)}
PATCHES = {
    'hair apex': (1328, 80, 1808, 400),
    'left ear / temple': (1136, 440, 1616, 888),
    'right ear / temple': (1664, 440, 2144, 888),
    'left shoulder': (664, 1080, 1144, 1528),
    'right shoulder': (2032, 1080, 2512, 1528),
    'collar / white shirt': (1296, 944, 1776, 1392),
    'left cuff / hand': (792, 2856, 1272, 3304),
    'right cuff / hand': (1784, 3160, 2264, 3608),
    'trouser gap': (1456, 3440, 1936, 3888),
}


def sha(path):
    with path.open('rb') as file:
        return hashlib.file_digest(file, 'sha256').hexdigest()


def normalized(rect):
    x, y, width, height = rect
    assert 0 <= x < x + width <= SIZE[0] and 0 <= y < y + height <= SIZE[1]
    return dict(x=x / SIZE[0], y=y / SIZE[1], width=width / SIZE[0], height=height / SIZE[1])


def bounds(rect):
    x, y, width, height = rect
    return x, y, x + width, y + height


def background(size, kind):
    if kind != 'checker':
        return Image.new('RGBA', size, '#090c12' if kind == 'dark' else '#ffffff')
    canvas = Image.new('RGBA', size, '#dddddd')
    draw = ImageDraw.Draw(canvas)
    for y in range(0, size[1], 24):
        for x in range(0, size[0], 24):
            if (x // 24 + y // 24) % 2:
                draw.rectangle((x, y, x + 23, y + 23), fill='#999999')
    return canvas


def composite(image, kind):
    canvas = background(image.size, kind)
    canvas.alpha_composite(image)
    return canvas.convert('RGB')


def review(source, cutout):
    # Each edge tile remains 1 source pixel = 1 artifact pixel; overview is 1:4.
    board = Image.new('RGB', (1536, 560 + sum(b[3]-b[1]+36 for b in PATCHES.values())), '#20242a')
    draw = ImageDraw.Draw(board)
    for column, kind in enumerate(('dark', 'light', 'checker')):
        draw.text((column * 512 + 16, 12), f'{kind.upper()} | overview 1:4 | edge tiles 100%', fill='white')
        board.paste(composite(cutout.crop(bounds(RECTS['heroCrop'])), kind).resize((480, 480), Image.Resampling.LANCZOS), (column * 512 + 16, 40))
    y = 560
    for label, box in PATCHES.items():
        draw.text((16, y + 4), f'{label} | source bounds {box} | 100% (no resize)', fill='white')
        for column, kind in enumerate(('dark', 'light', 'checker')):
            tile = composite(cutout.crop(box), kind)
            tile.save(ROOT / f'tmp/portrait-edge-{label.replace(" / ", "-").replace(" ", "-")}-{kind}.png')
            board.paste(tile, (column * 512 + 16, y + 28))
        y += box[3] - box[1] + 36
    board.save(ROOT / 'docs/portrait-matte-review.png')
    overlay = source.resize((768, 1024), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(overlay)
    for (label, rect), color in zip(RECTS.items(), ('#ff6333', '#ffffff', '#00aaff')):
        box = tuple(v / 4 for v in bounds(rect))
        draw.rectangle(box, outline=color, width=2)
        draw.text((box[0], box[1] + 4), f'{label}: {rect}', fill=color, stroke_width=1, stroke_fill='black')
    overlay.save(ROOT / 'tmp/portrait-source-anchors.png')
    for kind in ('dark', 'light', 'checker'):
        composite(cutout, kind).save(ROOT / f'tmp/portrait-full-{kind}.png')


def main():
    assert sha(SOURCE) == SOURCE_SHA, 'Source hash mismatch; refusing processing'
    source = Image.open(SOURCE)
    assert source.size == SIZE and source.getexif().get(274, 1) == 1
    source = source.convert('RGB')
    reuse = '--reuse-reviewed-matte' in sys.argv
    previous = None
    session = None
    archived = ROOT / 'public/assets/portrait-source-cutout.webp'
    if reuse:
        previous = json.loads((ROOT / 'public/assets/portrait-manifest.json').read_text())
        assert previous['source']['sha256'] == SOURCE_SHA
        archived = ROOT / 'public/assets/portrait-source-cutout.webp'
        record = next(item for item in previous['derivatives'] if item['role'] == 'source-aligned-lossless-rgba')
        assert sha(archived) == record['sha256'], 'Reviewed matte changed; refusing reuse'
        model = ROOT / previous['provenance']['modelPath']
    else:
        session = new_session('isnet-general-use', providers=['CPUExecutionProvider'])
        model = Path(session.__class__.download_models())
    assert model.resolve().is_relative_to((ROOT / '.tools').resolve())
    assert sha(model) == MODEL_SHA, 'Unexpected checkpoint; provenance must be re-reviewed'
    hair_box = (1176, 80, 1888, 552)
    if reuse:
        assert previous is not None
        cutout = Image.open(archived).convert('RGBA')
        box = tuple(previous['matting']['sourceWindow'])
        despill_pixels = previous['matting']['hairEdgeDespill']['changedRgbPixels']
        assert tuple(previous['matting']['hairEdgeDespill']['sourceBounds']) == hair_box
        print('Reusing hash-verified reviewed matte; no inference or matting performed',flush=True)
    else:
        assert session is not None
        mask = session.predict(source)[0]
        # The ORT arena is no longer needed; do not retain it beside the full-resolution sparse matting system.
        session = None
        gc.collect()
        mask.save(ROOT / 'tmp/portrait-model-mask.png')
        box = mask.point(lambda a: 255 if a >= 10 else 0).getbbox()
        assert box is not None
        box = (max(0, box[0]-32), max(0, box[1]-32), min(SIZE[0], box[2]+32), min(SIZE[1], box[3]+32))
        print(f'Local IS-Net + closed-form matting, source window {box}', flush=True)
        # Fail rather than silently substituting a poorer matte under memory pressure.
        matte = alpha_matting_cutout(source.crop(box), mask.crop(box), 240, 10, 6)
        pixels = np.array(matte)
        original = np.array(source.crop(box))
        opaque = pixels[:, :, 3] == 255
        pixels[:, :, :3][opaque] = original[opaque]
        cutout = Image.new('RGBA', SIZE)
        cutout.paste(Image.fromarray(pixels), box[:2])
        # Suppress only cool spill in the reviewed crown edge band; preserve alpha and face.
        hair = np.array(cutout.crop(hair_box))
        rgb = hair[:, :, :3].astype(np.float32)
        edge_distance = distance_transform_edt(hair[:, :, 3] >= 254)
        fringe = (hair[:, :, 3] > 0) & (edge_distance < 16) & (rgb.max(axis=2) < 160) & (rgb[:, :, 1] > rgb[:, :, 0] + 4) & (rgb[:, :, 2] > rgb[:, :, 0] + 4)
        target = rgb.copy()
        target[:, :, 1] = np.minimum(rgb[:, :, 1], rgb[:, :, 0] + 4)
        target[:, :, 2] = np.minimum(rgb[:, :, 2], rgb[:, :, 0] + 8)
        weight = np.clip(1 - edge_distance / 16, 0, 1)[:, :, None]
        corrected = np.rint(rgb + (target - rgb) * weight).astype(np.uint8)
        before = hair[:, :, :3].copy()
        hair[:, :, :3][fringe] = corrected[fringe]
        despill_pixels = int(np.count_nonzero(np.any(before != hair[:, :, :3], axis=2)))
        cutout.paste(Image.fromarray(hair), hair_box[:2])
    print(f'Hair-edge despill: {despill_pixels} RGB pixels; alpha unchanged', flush=True)
    assets = ROOT / 'public/assets'
    assets.mkdir(parents=True, exist_ok=True)
    (ROOT / 'docs').mkdir(exist_ok=True)
    cutout.save(assets / 'portrait-source-cutout.webp', lossless=True, method=6, exact=True)
    cutout.getchannel('A').save(assets / 'portrait-source-mask.png', optimize=True)
    hero = cutout.crop(bounds(RECTS['heroCrop']))
    derivatives = []
    for filename, role in [('portrait-source-cutout.webp', 'source-aligned-lossless-rgba'), ('portrait-source-mask.png', 'source-aligned-alpha')]:
        path = assets / filename
        derivatives.append(dict(path=f'assets/{filename}', publicUrl=f'/assets/{filename}', role=role,
                                width=SIZE[0], height=SIZE[1], bytes=path.stat().st_size, sha256=sha(path)))
    for width in (640, 960, 1280):
        variant = hero.resize((width, width), Image.Resampling.LANCZOS)
        path = assets / f'portrait-hero-{width}.webp'
        for quality in (92, 90, 88, 86, 84):
            variant.save(path, quality=quality, method=6, exact=True)
            if path.stat().st_size <= 250 * 1024:
                break
        derivatives.append(dict(path=f'assets/{path.name}', publicUrl=f'/assets/{path.name}', role='hero',
                                width=width, height=width, bytes=path.stat().st_size, sha256=sha(path),
                                quality=quality, alphaLossless=True, within250KiB=path.stat().st_size <= 250 * 1024))
    # One small source-aligned texture: UV window can widen without loading the archive.
    scene_texture = cutout.resize((960,1280),Image.Resampling.LANCZOS)
    scene_path = assets / 'portrait-scene-960.webp'
    scene_texture.save(scene_path,quality=92,method=6,exact=True)
    assert scene_path.stat().st_size <= 250 * 1024
    derivatives.append(dict(path=f'assets/{scene_path.name}',publicUrl=f'/assets/{scene_path.name}',role='scene-source-aligned',
                            width=960,height=1280,bytes=scene_path.stat().st_size,sha256=sha(scene_path),quality=92,alphaLossless=True,within250KiB=True))
    review(source, cutout)
    face = RECTS['faceBox']; hero_rect = RECTS['heroCrop']
    hero_face = {key: value for key, value in zip(('x','y','width','height'),
                 ((face[0]-hero_rect[0])/hero_rect[2], (face[1]-hero_rect[1])/hero_rect[3], face[2]/hero_rect[2], face[3]/hero_rect[3]))}
    manifest = {
        'schemaVersion': 1,
        'source': {'path': SOURCE.name, 'sha256': SOURCE_SHA, 'width': SIZE[0], 'height': SIZE[1], 'exifOrientation': 1},
        'coordinateSystem': 'Top-left origin; x/width normalized by original 3072; y/height by original 4096. Rectangles are not inferred ML measurements.',
        'anchors': {name: normalized(rect) for name, rect in RECTS.items()},
        'sourcePixelRects': {name: dict(zip(('x','y','width','height'), rect)) for name, rect in RECTS.items()},
        'heroFaceBox': hero_face,
        'measurement': {'method': 'Manual visual inspection of original, 100% head region and source-coordinate overlay; editorial crops checked against complete matted silhouette.',
                        'faceDefinition': 'Forehead skin to chin, including ears; excludes top hair. Approximate manual boundaries, not biometric detection.',
                        'precision': 'Integer source-pixel authored rectangles; manual visual approximation, no quantified detection accuracy. Normalized values are exact transforms of these rectangles.',
                        'anchorOverlay': 'tmp/portrait-source-anchors.png', 'aboutCropStatus': 'Measured wider source window for future About; not owner-approved choreography.'},
        'derivatives': derivatives,
        'matting': {'model': 'isnet-general-use', 'provider': 'CPUExecutionProvider', 'inferenceInput': [1024,1024],
                    'refinement': 'PyMatting closed-form alpha and multilevel foreground estimation at original pixel resolution',
                    'foregroundThreshold': 240, 'backgroundThreshold': 10, 'erodeSize': 6, 'sourceWindow': list(box),
                    'opaqueRgb': 'Original decoded JPEG RGB restored wherever refined alpha == 255, except the bounded outer hair-edge despill region. Face/skin interiors are unchanged.',
                    'hairEdgeDespill': {'method': 'Green/blue excess-channel suppression with smooth distance fade; red detail and alpha untouched', 'sourceBounds': list(hair_box), 'edgeBandPixels': 16, 'greenCeiling': 'R+4', 'blueCeiling': 'R+8', 'changedRgbPixels': despill_pixels, 'trigger': 'Outer dark hair with G > R+4 and B > R+4; max channel <160'},
                    'alphaBoundsSourcePixels': list(cutout.getchannel('A').getbbox()),
                    'manualMaskEdits': [], 'generativeReplacement': False, 'imageUploaded': False},
        'provenance': {'python': sys.version.split()[0],
                       'packages': {name: importlib.metadata.version(name) for name in ('rembg','onnxruntime','Pillow','numpy','pymatting','scipy')},
                       'modelPath': model.relative_to(ROOT).as_posix(), 'modelSha256': MODEL_SHA, 'modelBytes': model.stat().st_size,
                       'modelDownloadUrl': 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx',
                       'modelUpstream': 'https://github.com/xuebinqin/DIS',
                       'licenses': {'rembg': 'MIT', 'onnxruntime': 'MIT', 'Pillow': 'MIT-CMU', 'pymatting': 'MIT',
                                    'modelUpstreamRepository': 'Apache-2.0; upstream README explicitly covers code/evaluation metric; no separate checkpoint grant stated.',
                                    'modelLicenseEvidence': 'https://github.com/xuebinqin/DIS/blob/main/LICENSE.md',
                                    'modelLicenseScopeEvidence': 'https://github.com/xuebinqin/DIS#license',
                                    'sourcePortrait': 'Owner-provided input; no redistribution license inferred.'}},
        'textureMapping': {'cutout': '/assets/portrait-source-cutout.webp', 'mask': '/assets/portrait-source-mask.png', 'sceneTexture': '/assets/portrait-scene-960.webp',
                           'sourceFrame': {'width': 3072, 'height': 4096}, 'heroFallback': '/assets/portrait-hero-960.webp',
                           'heroSrcSet': ', '.join(f'/assets/portrait-hero-{w}.webp {w}w' for w in (640,960,1280)),
                           'cropTransform': 'cropX=(sourceX-crop.x)/crop.width; cropY=(sourceY-crop.y)/crop.height; top-left UV; invert Y only for bottom-left shader UVs.',
                           'identity': 'All assets derive from the same source-aligned cutout; About can widen source UVs without replacing identity.'},
        'review': {'artifact': 'docs/portrait-matte-review.png', 'edgeTilesScale': '100% / 1:1 source pixels',
                   'backgrounds': ['dark #090c12', 'white #ffffff', 'checker #dddddd/#999999'],
                   'edgeRegionsSourcePixels': {name: list(rect) for name, rect in PATCHES.items()},
                   'ownerVisualApproval': False,
                   'limitations': ['Original ends at thighs; no pixels generated below original frame.', 'Original RGB contains photographic green reflections; soft-edge spill is unmixed without global face recoloring.',
                                   'Very fine hair was already softened in original JPEG; matting cannot reconstruct missing strands.', 'Manual anchors are authored HUD/crop geometry, not measured biometric confidence.']},
    }
    # Runnable regression checks: source integrity, transform invertibility, alpha, geometry and bytes.
    decoded = Image.open(assets / 'portrait-source-cutout.webp').convert('RGBA')
    assert decoded.size == SIZE and np.array_equal(np.asarray(decoded), np.asarray(cutout))
    assert cutout.getchannel('A').getextrema() == (0, 255)
    assert np.all(np.asarray(cutout)[320:920,1400:1680,3] == 255), 'Face interior must stay opaque'
    assert np.array_equal(np.asarray(cutout)[320:920,1400:1680,:3], np.asarray(source)[320:920,1400:1680,:3]), 'Face interior RGB must remain original'
    assert np.all(np.asarray(cutout)[1500:1800,1440:1600,3] == 255), 'White shirt must stay opaque'
    for key, rect in RECTS.items():
        norm = manifest['anchors'][key]
        assert all(abs(norm[k] * SIZE[i % 2] - rect[i]) < 1e-9 for i,k in enumerate(('x','y','width','height')))
    for derivative in derivatives:
        path = ROOT / 'public' / derivative['path']
        image = Image.open(path)
        assert image.size == (derivative['width'], derivative['height'])
        assert path.stat().st_size == derivative['bytes'] and sha(path) == derivative['sha256']
        if derivative['role'] == 'hero':
            assert image.mode == 'RGBA' and image.getchannel('A').getextrema() == (0,255)
    assert sha(SOURCE) == SOURCE_SHA, 'Original changed during processing'
    (assets / 'portrait-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'verified': True, 'anchors': manifest['anchors'], 'heroFaceBox': hero_face, 'derivatives': derivatives}, indent=2))


if __name__ == '__main__':
    main()
