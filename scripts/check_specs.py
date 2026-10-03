"""Documentation/contract checks only; not the production content validator.
Run: .tools/spec-kit-venv/Scripts/python.exe scripts/check_specs.py
"""
from copy import deepcopy
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit

from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError

ROOT = Path(__file__).resolve().parents[1]
FEATURE = ROOT / 'specs/001-cinematic-identity'
SCHEMA = json.loads((FEATURE / 'contracts/content.schema.json').read_text(encoding='utf-8'))
EXAMPLE = json.loads((FEATURE / 'contracts/content.example.json').read_text(encoding='utf-8'))
Draft202012Validator.check_schema(SCHEMA)
VALIDATOR = Draft202012Validator(SCHEMA)


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for child in value.values():
            yield from strings(child)
    elif isinstance(value, list):
        for child in value:
            yield from strings(child)


def validate(data):
    VALIDATOR.validate(data)
    locales = [item['id'] for item in data['locales']]
    assert len(locales) == len(set(locales)), 'Duplicate locale ID'
    assert 'en' in locales and data['defaultLocale'] in locales
    assert all(item['direction'] == {'en': 'ltr', 'ar': 'rtl'}[item['id']] for item in data['locales'])
    def localized_maps(value):
        if isinstance(value, dict):
            if 'en' in value and set(value) <= {'en', 'ar'}:
                yield value
            for child in value.values():
                yield from localized_maps(child)
        elif isinstance(value, list):
            for child in value:
                yield from localized_maps(child)
    assert all(set(locales) <= set(item) for item in localized_maps(data)), 'Enabled locale has incomplete copy'
    assert all(not re.search(r'[<>\x00-\x1f]', s) for s in strings(data)), 'Unsafe text/control character'
    social_ids = [item['id'] for item in data['socials']]
    assert len(social_ids) == len(set(social_ids)), 'Duplicate social ID'
    for link in data['socials']:
        url = link['url']
        parsed = urlsplit(url)
        assert not re.search(r'[\x00-\x20\\]', unquote(url)), 'Unsafe URL encoding'
        if link['kind'] == 'email':
            assert parsed.scheme == 'mailto' and not parsed.query and not parsed.fragment
            assert re.fullmatch(r'[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', parsed.path)
        else:
            assert parsed.scheme == 'https' and parsed.hostname
            assert parsed.username is None and parsed.password is None
            assert parsed.port in (None, 443), 'Unexpected destination port'
    portrait = data['portrait']
    for key in ('heroCrop', 'aboutCrop', 'faceBox'):
        box = portrait[key]
        if box is not None:
            assert box['x'] + box['width'] <= 1 and box['y'] + box['height'] <= 1
    hero, face = portrait['heroCrop'], portrait['faceBox']
    if hero is not None and face is not None:
        assert hero['x'] <= face['x'] and hero['y'] <= face['y']
        assert face['x'] + face['width'] <= hero['x'] + hero['width']
        assert face['y'] + face['height'] <= hero['y'] + hero['height']
    for key in ('question', 'cta', 'hint'):
        assert data['hero'][key]['en'] == {'question': 'Who is he?', 'cta': 'Find out', 'hint': 'Scroll to explore'}[key]


def git(*args):
    return subprocess.check_output(['git', '-c', f'safe.directory={ROOT.as_posix()}', *args], cwd=ROOT)


def main():
    hero_mode = '--hero' in sys.argv
    if not __debug__:
        raise RuntimeError('Run this assert-based check without python -O')
    positive = 0
    validate(EXAMPLE)
    positive += 1
    zero_social = deepcopy(EXAMPLE)
    zero_social['socials'] = []
    validate(zero_social)
    positive += 1
    # Synthetic geometry fixture; not measured portrait coordinates or released assets.
    bounded = deepcopy(EXAMPLE)
    bounded['portrait']['heroCrop'] = {'x': 0.1, 'y': 0.0, 'width': 0.8, 'height': 0.6}
    bounded['portrait']['faceBox'] = {'x': 0.3, 'y': 0.1, 'width': 0.3, 'height': 0.3}
    validate(bounded)
    positive += 1
    # Synthetic locale fixture only: no claimed production Arabic translation.
    arabic = deepcopy(EXAMPLE)
    arabic['locales'].append({'id': 'ar', 'direction': 'rtl'})
    arabic['defaultLocale'] = 'ar'
    def add_test_translation(value):
        if isinstance(value, dict):
            if 'en' in value and set(value) <= {'en', 'ar'}:
                value['ar'] = 'نص اختباري'
            for child in list(value.values()):
                add_test_translation(child)
        elif isinstance(value, list):
            for child in value:
                add_test_translation(child)
    add_test_translation(arabic)
    validate(arabic)
    positive += 1

    rejected = []
    cases = [
        ('unknown root field', lambda x: x.update(cameraProgress=0.5)),
        ('unknown shader field', lambda x: x['hero'].update(shaderSource='unsafe')),
        ('javascript URL', lambda x: x['socials'][0].update(url='javascript:alert(1)')),
        ('URL credentials', lambda x: x['socials'][0].update(url='https://user:pass@example.com')),
        ('encoded URL newline', lambda x: x['socials'][0].update(url='https://example.com/%0afoo')),
        ('email headers', lambda x: x['socials'][2].update(url='mailto:a@example.com?subject=bad')),
        ('wrong email protocol', lambda x: x['socials'][2].update(url='https://example.com')),
        ('duplicate social ID', lambda x: x['socials'].append(deepcopy(x['socials'][0]))),
        ('duplicate locale ID', lambda x: x['locales'].append({'id': 'en', 'direction': 'rtl'})),
        ('wrong locale direction', lambda x: x['locales'][0].update(direction='rtl')),
        ('enabled Arabic missing copy', lambda x: x['locales'].append({'id': 'ar', 'direction': 'rtl'})),
        ('invalid default locale', lambda x: x.update(defaultLocale='ar')),
        ('crop overflow', lambda x: x['portrait'].update(heroCrop={'x': 0.9, 'y': 0.0, 'width': 0.2, 'height': 0.5})),
        ('raw markup', lambda x: x['about']['bio'].update(en='<script>bad</script>')),
        ('name control character', lambda x: x['profile'].update(fullName='bad\nname')),
        ('long copy', lambda x: x['hero']['subtitle'].update(en='a' * 241)),
        ('asset traversal', lambda x: x['portrait'].update(cutout='assets/../private.png')),
        ('asset encoded traversal', lambda x: x['portrait'].update(cutout='assets/%2e%2e/private.png')),
        ('unapproved discovery copy', lambda x: x['hero']['cta'].update(en='Start Journey')),
    ]
    for name, mutate in cases:
        bad = deepcopy(EXAMPLE)
        mutate(bad)
        try:
            validate(bad)
        except (AssertionError, ValidationError, ValueError):
            rejected.append(name)
        else:
            raise AssertionError(f'Negative case accepted: {name}')
    hidden_face = deepcopy(bounded)
    hidden_face['portrait']['faceBox']['y'] = 0.7
    try:
        validate(hidden_face)
    except (AssertionError, ValidationError, ValueError):
        rejected.append('face outside Hero crop')
    else:
        raise AssertionError('Face outside crop was accepted')

    lock = json.loads((ROOT / 'docs/tooling-lock.json').read_text(encoding='utf-8'))
    for filename, expected in lock['sourceSha256'].items():
        assert hashlib.sha256((ROOT / filename).read_bytes()).hexdigest() == expected, filename
        assert hashlib.sha256(git('show', lock['gitBaseline'] + ':' + filename)).hexdigest() == lock['baselineSourceSha256'][filename], filename
        baseline = git('show', lock['gitBaseline'] + ':' + filename)
        current = (ROOT / filename).read_bytes()
        if filename.endswith('.md'):
            assert current.replace(b'\r\n', b'\n') == baseline.replace(b'\r\n', b'\n'), 'Source content differs beyond baseline newline normalization'
        else:
            assert current == baseline, filename
    assert EXAMPLE['portrait']['sha256'] == lock['sourceSha256'][EXAMPLE['portrait']['source']]
    branch = git('branch', '--show-current').decode().strip()
    assert branch in ({'feature/hero-section', 'feature/hero-about-transition'} if hero_mode else {'feature/spec-kit-setup'})
    if branch == 'feature/hero-about-transition':
        assert (ROOT / 'docs/owner-narrative-alignment.md').is_file(), 'Combined review authorization must be recorded'
    if hero_mode:
        git('merge-base', '--is-ancestor', lock['gitBaseline'], 'main')
        git('merge-base', '--is-ancestor', 'milestone-1^{}', 'main')
    else:
        assert git('rev-parse', '--short', 'main').decode().strip() == lock['gitBaseline']
    assert git('remote').strip() == b''
    if hero_mode:
        assert (ROOT / 'src/app/page.tsx').is_file() and (ROOT / 'package.json').is_file()
        assert not any(p.suffix.lower() in {'.onnx', '.pt', '.pth'} for p in (ROOT / 'public').rglob('*')), 'Offline models must never ship to browsers'
    else:
        assert not any((ROOT / n).exists() for n in ['src', 'app', 'public', 'node_modules', 'package.json'])
    integration = json.loads((ROOT / '.specify/integration.json').read_text(encoding='utf-8'))
    assert integration['default_integration'] == 'generic'
    assert integration['integration_settings']['generic']['parsed_options']['commands_dir'] == '.specify/commands'
    assert (ROOT / '.specify/workflows/speckit/workflow.yml').is_file()
    assert (ROOT / '.specify/commands/speckit.specify.md').is_file()
    assert (ROOT / '.specify/commands/speckit.plan.md').is_file()
    spec = (FEATURE / 'spec.md').read_text(encoding='utf-8')
    ids = re.findall(r'^- \*\*FR-(\d{3}):\*\*', spec, re.M)
    assert ids == [f'{i:03d}' for i in range(1, 25)]
    authored = [*FEATURE.glob('*.md'), ROOT / 'DESIGN.md', ROOT / '.specify/memory/constitution.md', * (ROOT / 'tasks').glob('*.md'), ROOT / 'docs/phase-2-review.md', ROOT / 'README.md']
    link_count = 0
    for path in authored:
        text = path.read_text(encoding='utf-8')
        assert not re.search(r'\[(FEATURE NAME|DATE|PROJECT_NAME|PRINCIPLE_\d+_NAME|###-feature-name)\]|\$ARGUMENTS', text), path
        for link in re.findall(r'\]\(([^)]+)\)', text):
            if '://' in link or link.startswith(('mailto:', '#')):
                continue
            assert (path.parent / link.split('#')[0]).resolve().exists(), f'{path}: {link}'
            link_count += 1
    html = (ROOT / 'docs/architecture-roadmap.html').read_text(encoding='utf-8')
    assert '<script' not in html.lower()
    for href in re.findall(r'href="([^"]+)"', html):
        assert (ROOT / 'docs' / href).resolve().exists(), href
        link_count += 1
    tokens = json.loads((FEATURE / 'contracts/design.tokens.json').read_text(encoding='utf-8'))
    assert tokens['color']['tertiary']['$value']['hex'] == '#9fe8f5'
    assert (FEATURE / 'contracts/design.theme.css').read_text(encoding='utf-8').startswith('@theme')
    diagram = json.loads((ROOT / 'docs/diagram-verification.json').read_text(encoding='utf-8'))
    assert diagram['status'] == 'PASS'
    assert [v['width'] for v in diagram['viewports']] == [1440, 390, 320]
    assert len(rejected) == len(cases) + 1
    print(json.dumps({'status': 'PASS', 'positiveContractCases': positive, 'negativeCasesRejected': len(rejected),
                      'functionalRequirements': len(ids), 'sourceHashesUnchanged': len(lock['sourceSha256']),
                      'localLinksVerified': link_count, 'diagramViewports': [v['width'] for v in diagram['viewports']],
                      'applicationCodeCreated': hero_mode, 'currentBranch': branch,
                      'mainHead': git('rev-parse', '--short', 'main').decode().strip(), 'cacheBoundaryIncidentDisclosed': True}, indent=2))


if __name__ == '__main__':
    main()
