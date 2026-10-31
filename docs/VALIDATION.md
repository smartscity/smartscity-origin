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

Corporate update **DEPLOYED**: source commit `e98bd4815e5fde4d60e2b94967e96ead0b702715` passed [GitHub quality run 40944547997](https://github.com/smartscity/smartscity-origin/actions/runs/40944547997). Every required quality step, including browser tests, completed successfully on Node 24. Cloudflare deployment `b9473af5-c133-4ebb-a481-395aa419d8d4` reported success for the same commit.

The browser verified all four new HTTPS routes on the official domain: [English About](https://www.smartscity.com/en/about/), [Chinese About](https://www.smartscity.com/zh-CN/about/), [English Contact](https://www.smartscity.com/en/contact/) and [Chinese Contact](https://www.smartscity.com/zh-CN/contact/). Rendered legal identity, mailbox, canonical URLs and Organization JSON-LD agree. The deployed About page was visually inspected in dark mode; its company-information panel displays the Chinese legal name, labeled reference translation, registration region and public mailbox. This follow-up changes documentation only and records evidence for the exact source commit above.

Command-line HTTP requests previously returned 403 in this execution environment; those responses are not browser accessibility evidence. Domain legal ownership, host-wide security configuration and email delivery remain outside this website acceptance.

## Neutral visual and specification refresh — 2026-10-30

The neutral white/gray and black themes, original layered hero SVG, document-owned motion visibility, and source-linked project specifications passed Astro/TypeScript (0 errors, 0 warnings, 1 existing hint), ESLint, translation checks, 8 unit tests, the 18-page production build, local asset/page links, and the existing 28 desktop/mobile browser checks. After a small hero typography adjustment, eight focused presentation tests passed for specification source links, reduced-motion behavior and offscreen animation pausing. Browser visual review covered the white homepage, the dimensional artwork and its transition into the project section. No performance experiment was executed by this portal task.

HyperRaft public Maven 0.1.0 POMs were checked independently of the portal build. The owner explicitly deferred publication of private performance numbers until a formal report is available. Public specifications and documented product feature counts are the only new numerical claims. This paragraph is a pre-push record; deployment of this refresh is verified against its pushed commit, independently from the earlier corporate update above.

## Digital city implementation — 2026-10-31

Implemented five original procedural buildings, a localized HTML district dock, camera focus and manually advanced tour, a library roof cutaway with editable Write/Split/Preview layouts, and an illustrative Memory context packet. The city is a WebGL React island, with static poster and project content retained for missing WebGL or JavaScript. Public performance figures remain unpublished. Scroll-driven cinematic touring, free-flight controls, failover simulation and authored Blender assets are not implemented in this first city version.

Local checks: Astro/TypeScript PASS (0 errors, 0 warnings, one pre-existing Lighthouse hint); ESLint, Prettier, translation parity, diff whitespace, 10 Vitest tests, 18-page build and internal links PASS. The build emits a size advisory for the lazy city chunk: approximately 979 KiB minified / 265 KiB gzip. No external models or texture downloads are required. This is a bundle measurement, not a page-load timing result.

The initial browser run passed 40 of 42 checks; two mobile accessibility cases exceeded their combined 90-second budgets while scanning both themes and all pages. The same page/theme assertions were split into individual theme cases, without removing checks. All 18 targeted city/accessibility checks then passed (1.8 minutes), including both locales, both themes, desktop and mobile, WebGL absence, library editing, keyboard return, motion preferences, offscreen pausing and the five-stop tour. Together with the unchanged passing tests this covers the resulting 46-case suite; CI will independently run the whole suite against the pushed commit.

Visual inspection in the browser confirmed the production build's city composition, five building silhouettes, three distinct consensus towers, district detail panel and library interaction. Screenshots are local QA artifacts and are not committed. Mobile tests use Chromium viewport/touch emulation: physical iOS/Android, sustained 30/60 FPS, battery use and Lighthouse are NOT_RUN. Publication is pending the push/deployment checks for this change.

## Forest-green palette and English-only visible copy — 2026-10-31

The logo-derived palette now covers city terrain, glass, lighting, selection rings, fallback poster, shared themes and project accents. English pages display the existing reference English company translation; the canonical identity and JSON-LD remain unchanged. Rendered English route checks now reject Han characters in visible body text, covering home, four projects, About, Contact and Privacy.

Typecheck, lint, formatting, translation parity, build, internal links and diff checks passed. The first focused browser run passed 22/26 cases and found insufficient contrast in the light-theme Polarbear card accents. After darkening that token, all 12 accessibility/city-panel cases passed across both languages and desktop/mobile (1.3 minutes). The earlier English-copy and corporate-route checks passed. Browser inspection confirmed the green city, English language switch and translated operator/footer. No rendering behavior or product claims were changed. Deployment is verified separately against the resulting commit.
