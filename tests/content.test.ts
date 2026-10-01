import assert from 'node:assert/strict';
import { test } from 'node:test';
import example from '../content/en.json' with { type: 'json' };
import { resolveContent, validateContent } from '../src/lib/content.ts';

test('approved content passes and unavailable Arabic consistently resolves to English', () => {
  const data = validateContent(example);
  const resolved = resolveContent(data, 'ar');
  assert.equal(resolved.locale, 'en'); assert.equal(resolved.direction, 'ltr');
  assert.equal(resolved.text(data.hero.question), 'Who is he?');
});
test('unsafe content, links, geometry and unapproved copy are rejected', () => {
  const mutations = [
    (x: typeof example) => { x.socials[0].url = 'javascript:alert(1)'; },
    (x: typeof example) => { x.socials[0].url = 'https://user:pass@example.com'; },
    (x: typeof example) => { x.socials[0].url = 'https://example.com/%0afoo'; },
    (x: typeof example) => { x.socials[2].url = 'mailto:a@example.com?subject=bad'; },
    (x: typeof example) => { x.socials.push(structuredClone(x.socials[0])); },
    (x: typeof example) => { x.hero.heading.en = '<script>bad</script>'; },
    (x: typeof example) => { x.hero.cta.en = 'Start Journey'; },
  ];
  for (const mutate of mutations) { const data = structuredClone(example); mutate(data); assert.throws(() => validateContent(data)); }
  assert.throws(() => validateContent({ ...example, cameraProgress: 1 }));
  assert.throws(() => validateContent({ ...example, portrait: { ...example.portrait, heroCrop: { x: .9, y: 0, width: .2, height: .5 } } }));
  assert.throws(() => validateContent({ ...example, locales: [...example.locales, { id: 'ar', direction: 'rtl' }] }));
});
