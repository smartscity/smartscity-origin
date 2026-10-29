# Validation record

Date: **2026-10-30** (Asia/Singapore). Scope: corporate identity enhancement to the static portal. This is not acceptance of the showcased products, registry verification, mailbox delivery verification or Apple enrollment approval.

## Environment

- macOS 26.5.1, x86_64; Node 26.1.0; committed npm lockfile.
- Astro 7.4.4, React 19.3.1, Playwright 1.64.1; matching Chromium installed under `/tmp/smartscity-playwright`.
- CI and Cloudflare use Node 24. No dependency, pipeline, DNS, MX or mailbox configuration changes.
- Desktop: 1440 × 1000. Mobile: iPhone 13 viewport/touch emulation in Chromium, not physical-device or Safari acceptance.

## Current local checks

| Check                    | Result                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Astro / TypeScript       | PASS — 0 errors, 0 warnings; existing non-blocking Lighthouse type hint                                           |
| ESLint                   | PASS                                                                                                              |
| Prettier                 | PASS                                                                                                              |
| Translation completeness | PASS — matching nested keys, array shapes and nonempty text                                                       |
| Vitest                   | PASS — 8 tests: Raft invariants, locale routing, identity projection, absent facts and safe JSON-LD serialization |
| Production build         | PASS — 18 static HTML documents, including four new localized corporate pages                                     |
| Internal links/assets    | PASS — all 18 HTML documents                                                                                      |
| Playwright               | PASS — 28 tests, desktop and mobile projects, 2.4 minutes                                                         |
| Diff whitespace          | PASS                                                                                                              |

Browser coverage includes About, Contact, Privacy, home and four project routes in both languages; light/dark WCAG A/AA automated checks; responsive overflow; visible legal name/email versus structured data; footer links; canonical/hreflang; route-preserving language switching; omitted unknown corporate facts; no fake contact form; content without JavaScript; keyboard/menu navigation; theme persistence; reduced motion; 404; and project demonstrations. Automated accessibility is not a complete human accessibility audit.

The earlier 20-pass/2-fail browser result is superseded. Hero/reveal entrance animations retain vertical movement without temporarily lowering text opacity, resolving the contrast failures. The separate menu entrance animation remains unchanged. Local browser visual inspection confirmed that the corporate page retains the portal design.

## Performance and historical evidence

Lighthouse: **NOT_RUN** for this corporate-content change. Previous installation audit and repeat-build checks are historical and are not presented as new security or performance acceptance.

## Deployment evidence

Before this change, Cloudflare deployments `429a2798-0df6-4e64-8d14-2c8a4fadc3c3` (commit `7b0d4fb`) and `9901d885-47b6-4ecf-80dd-a4235427df43` (commit `fbb01fb`) succeeded. The latter check was re-read on this review date. The old GitHub quality run failed before the animation fix; it is not evidence for the enhanced site.

The browser opened the existing custom-domain homepage at https://www.smartscity.com/en/ over HTTPS. New corporate pages are locally verified; **this pre-push record does not yet assert their public deployment or a successful new CI run**. Inspect the exact pushed commit's GitHub quality and Cloudflare checks, then verify the new official-domain routes. Live verification will be reported separately after publication.

Command-line HTTP requests previously returned 403 in this execution environment; those responses are not browser accessibility evidence. Domain legal ownership, host-wide security configuration and email delivery remain outside this website acceptance.
