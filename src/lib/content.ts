import { Ajv2020 } from 'ajv/dist/2020.js';
import schema from '../../specs/001-cinematic-identity/contracts/content.schema.json' with { type: 'json' };
import snapshot from '../../content/en.json' with { type: 'json' };

export type Locale = 'en' | 'ar';
export type Localized = { en: string; ar?: string };
export type Rect = { x: number; y: number; width: number; height: number };
export type Content = {
  schemaVersion: 1; defaultLocale: Locale;
  locales: { id: Locale; direction: 'ltr' | 'rtl' }[];
  profile: { id: string; fullName: string; displayName: string; role: Localized; location: Localized };
  hero: { heading: Localized; subtitle: Localized; question: Localized; cta: Localized; hint: Localized };
  about: { heading: Localized; bio: Localized; capabilityStatements: Localized[] };
  portrait: { id: string; source: string; width: number; height: number; sha256: string; alt: Localized;
    cutout: string | null; heroCrop: Rect | null; aboutCrop: Rect | null; faceBox: Rect | null };
  socials: { id: string; kind: 'github' | 'linkedin' | 'email' | 'other'; label: Localized; url: string }[];
};
const validateSchema = new Ajv2020({ strict: true, allErrors: true }).compile<Content>(schema);
function requireValue(ok: unknown, field: string): asserts ok {
  if (!ok) throw new Error(`Invalid content: ${field}`);
}
export function validateContent(input: unknown): Content {
  requireValue(validateSchema(input), JSON.stringify(validateSchema.errors));
  const data = input;
  const locales = data.locales.map(item => item.id);
  requireValue(new Set(locales).size === locales.length && locales.includes('en') && locales.includes(data.defaultLocale), 'locales');
  requireValue(data.locales.every(item => item.direction === (item.id === 'ar' ? 'rtl' : 'ltr')), 'locale direction');
  function walk(value: unknown, path: string) {
    if (typeof value === 'string') requireValue(!/[<>\x00-\x1f]/.test(value), path);
    if (typeof value === 'number') requireValue(Number.isFinite(value), path);
    if (value && typeof value === 'object') {
      if (!Array.isArray(value) && 'en' in value) requireValue(locales.every(locale => locale in value), `${path}: incomplete locale`);
      for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`);
    }
  }
  walk(data, 'content');
  requireValue(new Set(data.socials.map(item => item.id)).size === data.socials.length, 'duplicate social ID');
  for (const item of data.socials) {
    requireValue(!/[\x00-\x20\\]/.test(decodeURIComponent(item.url)), `socials.${item.id}.url`);
    const url = new URL(item.url);
    requireValue(item.kind === 'email'
      ? url.protocol === 'mailto:' && !url.search && !url.hash && /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(url.pathname)
      : url.protocol === 'https:' && !!url.hostname && !url.username && !url.password && !url.port,
    `socials.${item.id}.url`);
  }
  for (const key of ['heroCrop', 'aboutCrop', 'faceBox'] as const) {
    const box = data.portrait[key];
    if (box) requireValue(box.x + box.width <= 1 && box.y + box.height <= 1, `portrait.${key}`);
  }
  const { heroCrop: crop, faceBox: face } = data.portrait;
  if (crop && face) requireValue(face.x >= crop.x && face.y >= crop.y && face.x + face.width <= crop.x + crop.width && face.y + face.height <= crop.y + crop.height, 'face outside Hero');
  requireValue(data.hero.question.en === 'Who is he?' && data.hero.hint.en === 'Scroll to explore' && data.hero.cta.en === 'Find out', 'discovery copy');
  return data;
}
export function resolveContent(data = validateContent(snapshot), requested: Locale = data.defaultLocale) {
  const locale = data.locales.some(item => item.id === requested) ? requested : 'en';
  return { data, locale, direction: locale === 'ar' ? 'rtl' as const : 'ltr' as const,
    text: (copy: Localized) => copy[locale] ?? copy.en };
}
