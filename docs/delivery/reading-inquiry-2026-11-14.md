# Reading inquiry continuity

2026-11-14. The owner reported that “Discuss this topic” appeared unresponsive and requested complete button journeys. Live read-only inspection confirmed the article CTA used `mailto:`. Contact's two enhanced actions were enabled; external mail-client availability remains outside page control.

## Change

- Article and Docs primary inquiry CTA opens the same-language Contact page, carrying the reading title and route.
- The existing form pre-fills reading context. Source paths are restricted to same-site localized Blog/Docs routes and text is assigned through DOM values.
- Opening an email draft or copying it reveals the complete draft, giving a manual fallback without a configured email handler or clipboard permission.
- Existing company identity, recipient, local-only delivery, no-POST behavior and privacy semantics are preserved.

## Validation

- Astro check: 0 errors / 0 warnings; one pre-existing Lighthouse hint.
- Static build: PASS, 54 routes. Internal link check: PASS.
- Initial contact/library/article suite: 36 PASS and 4 FAIL. Four failures came from test migration: an accidentally changed canonical expectation, then URLSearchParams space encoding. The canonical assertion was restored, and title/source are now compared via URLSearchParams.
- Corrected four reading cases: PASS in final 12-case run, together with eight existing city interaction cases.
- Final covered browser set: **48 distinct cases passed** across desktop/mobile and English/Chinese. Covers article-to-form click and context, draft visibility on clipboard denial, copy success, no inquiry POST, no-JavaScript reading/contact fallback, article navigation/figures, city selection/tour/keyboard return and WebGL absence.
- Logs from this session: `/private/tmp/portal-contact-check.log`, `/private/tmp/portal-contact-build.log`, `/private/tmp/portal-contact-e2e.log`, `/private/tmp/portal-contact-city-final.log`.

At the original 2026-11-14 handoff, no production message was sent and commit, push and deployment were not performed. The separate city/Agent homepage concept is owned by `biying/docs/company/07-portal/city-agent-design.md`; no production hero replacement is included in this patch.

## Release preparation — 2026-11-17

The owner reviewed the remaining uncommitted work and explicitly authorized committing and pushing useful changes. Review confirmed that all eight pending files belong to this inquiry fix; no disposable files were found.

Fresh validation passed: Astro check (0 errors / 0 warnings; one existing Lighthouse hint), ESLint, Prettier, locale parity, 14 unit tests, the 54-route static build, internal links in 55 HTML files, and 22 focused browser cases across English/Chinese and desktop/mobile. The browser run covered the local composer, article-to-form context, clipboard success/denial, no-POST behavior, accessibility, reading links and no-JavaScript fallbacks. No production email was sent. CI and Cloudflare release status must be verified against the resulting commit after push.

The implementation was committed and pushed as `dbb42d4`; Cloudflare deployment `7ebcfe0b-2044-41af-908e-f6e4cd9aecf9` succeeded. The first live run had three premature assertions reading an empty textarea before the contact script finished loading. The test now polls for the expected title rather than reading once immediately after navigation. With the same deployed application, all four live English/Chinese desktop/mobile inquiry cases passed, including source context and manual draft fallback. This follow-up changes the test synchronization and this record only.
