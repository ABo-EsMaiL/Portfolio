# Data Contract Spec — Editorial Content / Assets / Motion Boundaries

**Status:** Draft v1 for Hero/About; CMS provider deliberately unselected.
**Machine contract:** `contracts/content.schema.json` (JSON Schema 2020-12).
**CV-backed example:** `contracts/content.example.json`; null derived assets honestly mean not produced yet.

## Ownership
| Boundary | Owns | Cannot own |
|---|---|---|
| Editorial content | profile, localized copy, bio/capability statements, social destinations | timing, camera positions, shader source or DOM selectors |
| Reviewed asset manifest | source dimensions/digest, derived local paths, face/crop normalized anchors | inferred attributes, generated face, live ML result |
| Authored motion configuration | stable stage IDs, timeline labels, camera endpoints, budget tiers | content strings, locale keys, CMS arbitrary transforms |
| UI state | capsule expanded/focus/active stage | narrative progress writer |
| Runtime geometry | measured text/portrait bounds, viewport and crop matrices | stored editorial copy or source-image mutation |

## Current schema and cardinality
Root has schemaVersion, defaultLocale, locales, profile, hero, about, portrait and socials. Strict objects reject unknown properties. English text is required; Arabic keys are optional for future content. `locales` lists enabled locales with direction; example enables English only. Resolver must return chosen locale or explicit English fallback, set correct html lang/dir and expose fallback consistently.

Proposed limits: display name 80 chars, role/location 100, headings 120, Hero subtitle 240, About bio 1200, capability statements 1–5 items ×180 chars, socials 0–6. Limits are data guards, not a reason to truncate silently. Preview must check wrapping/line-height against typography at each viewport, because character counts do not guarantee layout. Overflow uses readable expansion/normal flow, not microscopic text.

Stage IDs are fixed (`hero`, `about`, `capabilities`, `experience`, `projects`, `contact`) in authored motion, not user-renamable keys. Nav labels come from content, but destinations are filtered against scenes actually implemented. Item IDs remain stable when labels are edited. Position/display order may not be read from translated strings.

## Assets and measurement
Source filename is fixed to the sole supplied portrait. Original width/height/digest are verified by the tooling check. Derived asset paths stay null until Milestone 2 creates them; fake usable URLs are prohibited. Crops/faceBox use x,y,width,height normalized to the original image. Schema constrains each component; semantic validation also requires x+width≤1 and y+height≤1. The face box must be fully visible within the Hero crop before the intro is approved.

At public rendering, resolve source/derived asset IDs through an allowlisted asset map; do not concatenate arbitrary client paths or expose file-reading endpoints. Absolute filesystem paths never go to the browser. Source filenames are documentation metadata, not upload/download permissions.

## Trust-boundary validation
1. Reject unknown fields, wrong types, non-finite values, control characters and raw HTML markup. React text escaping remains required; no dangerouslySetInnerHTML for editorial fields.
2. HTTPS only for external socials; mailto only for an email link, with no headers/query/newline. Reject javascript/data/file URLs, credentials in URLs and ambiguous schemes. Parse URLs at runtime rather than treating the schema pattern alone as security validation.
3. Enforce unique social IDs and enabled-locale IDs. Published localized fields must cover every enabled locale. Unsupported/unavailable requested locales fall back consistently to English; do not advertise Arabic as enabled until all intended copy is complete.
4. For derivatives, allow only controlled relative `assets/` paths; reject traversal, encoded traversal, backslashes and absolute/remote paths. Asset uploads need file type/size/dimension checks in the eventual CMS milestone.
5. Reject contract violations before publish/build; return field-path diagnostics. Preserve last validated public content snapshot rather than partially applying a failed edit.

## Future admin integration boundary
A future authenticated owner dashboard writes this same validated public projection, using server-only credentials and authorization. Draft/preview/publish/revision behavior and vendor are explicit later decisions. An initial local JSON snapshot is allowed for the Hero prototype; it is not a claim that the required admin dashboard has been built.

Future modules add scoped schemas for capabilities, experience/education/service, projects, certificates and contact. Preserve source references and evidence for claims. Military service must be categorized separately; Omni's mock data remains labelled; no “98% accuracy” headline without metric context. Independent live demo domains are distinct from portfolio detail routes. Those schemas are not fabricated here before their editorial requirements are approved.

## Content versus motion example (documentation only)
```ts
// Editorial data changes copy; stable scene IDs still select geometry.
const copy = content.about.heading[locale] ?? content.about.heading.en;
const sceneId = 'about'; // never derived from the translated heading
```
This snippet is explanatory; no `.ts` application file exists.

## Versioning and acceptance
Current schemaVersion is 1. Compatible optional fields can be added with a documented schema revision; breaking semantics require a new version and migration. The Phase 2 checker uses a real JSON Schema validator plus small semantic assertions and positive/negative cases. It does not pretend to implement the future admin API or production validator.
