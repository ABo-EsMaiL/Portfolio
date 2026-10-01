# T008 — Runnable Shell Verification

This is foundation evidence, not a finished Hero or 60 FPS claim.

- Milestone 1 approved/merged: main `e22ea4a`, local tag `milestone-1`; active branch `feature/hero-section`.
- Minimal manually authored App Router shell; no stock landing page, CMS, services or unimplemented stage routes.
- Canonical content is copied from the approved CV-backed example, validated with the approved JSON Schema plus semantic URL/locale/crop guards before server rendering.
- Self-hosted Manrope 400/600 and IBM Plex Mono 400 Latin WOFF2: 42,988 bytes total. Fontsource 5.3.0 assets downloaded directly from its npm archives; upstream SIL OFL licenses retained with fonts. No runtime Google Fonts request.
- Dependency compatibility: TypeScript 7.0.2 exceeds the installed Next lint/parser peer range (<6.1); TypeScript 6.0.3 is pinned instead. ESLint 10 exceeds Next's bundled React/import/accessibility plugin peer ranges; ESLint 9.39.5 is pinned. npm warns that ESLint 9 is unsupported; this developer-tool support gap is explicit and must be revisited when Next's lint plugins support ESLint 10. No peer overrides/force flags, removed accessibility rules or skipped library type checking remain.
- `npm run test:unit`: 2 tests pass, including unsafe input mutations and consistent English fallback.
- `npm run typecheck` and `npm run lint`: pass. `skipLibCheck` explicitly remains false after Next's generated defaults were reviewed.
- `npm run build`: successful optimized static Next build with `/` and framework `_not-found` only.
- Production server: HTTP 200 with identity/discovery text present in server HTML.
- Installed Edge browser tests: 2 pass—JavaScript-disabled semantic identity/links at 390px, keyboard skip-link focus, one heading and zero axe violations.
- `npm audit`: zero known production or development vulnerabilities at the time of this check; this is not a claim that an unsupported tool is maintained.
- Three source SHA-256 values preserved; phase-aware contract check passes and forbids shipping offline model weights under public/.

Portrait processing is running separately. The current page openly labels portrait preparation; no fake matte or generated identity is being represented as completed artwork. T009 owner matte review and T010–T013 remain pending.
