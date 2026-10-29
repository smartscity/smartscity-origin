# Validation record

Date: **2026-10-30** (Asia/Singapore). Scope: local production build of the portal, not acceptance of the showcased products or a live Cloudflare deployment.

## Environment

- macOS 26.5.1, x86_64; Node 26.1.0; npm lockfile committed.
- Astro 7.4.4, React 19.3.1, Playwright 1.64.1.
- CI is configured for Node 24 LTS and matching Playwright Chromium.
- Desktop viewport: 1440 × 1000. Mobile: Playwright iPhone 13 profile in Chromium; this is viewport/touch emulation, not a physical iPhone or Safari acceptance.

## Completed checks

| Check                         | Result                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Astro / TypeScript            | PASS — 0 errors, 0 warnings; one non-blocking type hint in the Lighthouse runner                           |
| ESLint                        | PASS                                                                                                       |
| Translation completeness      | PASS — matching nested keys, array shapes, and nonempty values                                             |
| Vitest                        | PASS — 5 tests covering Raft commit conditions, reset, and locale routing                                  |
| Production build              | PASS — 14 HTML documents                                                                                   |
| Internal page and asset links | PASS — all generated HTML checked                                                                          |
| Repeat build                  | PASS — all 28 output files byte-identical across consecutive builds on this host                           |
| Dependency install audit      | PASS — npm reported 0 vulnerabilities at installation time; not a comprehensive security audit             |
| Secret-pattern review         | No matching private-key or common token patterns found in source, assets, scripts, tests, or configuration |

## Browser checks

**INCOMPLETE — paused at the owner’s request to prioritize the publication pipeline.** Earlier full browser runs had failures; the final matching-Chromium run was interrupted and is not a PASS. Tests cover both languages, all product routes, light/dark themes, WCAG A/AA automated checks, responsive layout, no-JavaScript primary content, language-preserving navigation, persistent theme, reduced motion, mobile keyboard/menu behavior, 404 status, and demonstration interactions.

A real first-click hydration issue was fixed by keeping controls disabled until the interactive island is ready. Tests explicitly scroll to lazily hydrated islands before interacting. Editing the local Markdown sample now updates its preview. A broken locale link from the 404 page was corrected to the language homepage.

## Performance

**NOT_RUN — deferred at the owner’s request.** Lighthouse lab results must not be reported as real-user Core Web Vitals or an INP measurement.

## Delivery boundary

Cloudflare deployment: **NOT_DEPLOYED**. Production domain, custom-domain validation, TLS, CDN behavior, and Cloudflare header enforcement: **NOT_VERIFIED**. DNS and enterprise-email records: **UNCHANGED**.

The portal includes honest introductions for HyperRaft and QualitySphere where public implementation evidence is unavailable. Those missing product facts remain documented in `CONTENT_AUDIT.md`.
