# Bilingual AI Agent articles — 2026-11-13

## Scope and ownership

Adapt the two owner-supplied C2 articles into the existing portal. The company repository owns the Chinese source and supplied report/diagram assets; it was read-only throughout this task. The portal owns full English translations, route adaptation, localized figure captions/alt text, editorial cover assets and publication metadata. No new infrastructure, email service, customer assessment or detection integration is part of this work.

| Article ID                            | English route                                   | Chinese route                                      |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `ai-agent-reliability-assessment`     | `/en/blog/ai-agent-reliability-assessment/`     | `/zh-CN/blog/ai-agent-reliability-assessment/`     |
| `ai-agent-cross-system-investigation` | `/en/blog/ai-agent-cross-system-investigation/` | `/zh-CN/blog/ai-agent-cross-system-investigation/` |

Both articles appear in the five-article Blog list, the AI engineering topic and local full-text search. Existing article IDs/URLs remain unchanged. Article-to-article links, related Docs, language switching and contact routes use the current language. The existing shared email action retains article title and canonical URL as inquiry context.

## Design and claims review

| Problem                                          | Decision                                                           | Reason                                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Publication eligibility and translation identity | Reuse the existing pure publication policy and Markdown collection | One validated source for routes, search, navigation and related content                                   |
| Figures and enlargement                          | Native linked figures with localized captions and alt text         | Works with keyboard, without JavaScript and without a new dialog/state owner                              |
| List covers versus body illustrations            | Optional `coverInArticle`, defaulting to existing behavior         | New articles open with the report/method figures, while list and social previews have designed thumbnails |
| Article metadata                                 | Reading-template projection through a layout head slot             | Language, title, description, update date and canonical URL come from the same entry                      |
| Rich client gallery or CMS                       | Not adopted                                                        | No new persistent state or interaction lifecycle is needed                                                |

The report homepage, summary excerpt, diagrams and logo retain their original image bytes (seven originals checked). PNG report images have uncropped 720/1440 px WebP variants; diagrams use SVG. The independent English report ships with its CSS/logo dependencies, selectable text, responsive layout and `noindex`. Original article-preview screenshots are not published.

Fictional report data is labeled in visible captions and alt text. The Chinese investigation caption was strengthened during browser review so its fictional-sample status is visible outside the image as well. Method/tool descriptions retain scope and verified-capability limitations. No sample figure is presented as a customer finding or an implemented detector. Publication metadata records the current editorial update date, without inventing a historical publication date.

## Verification

- PASS: Chinese source prose and table cell content compared with the portal adaptations. Five sections in article one and six in article two have complete English counterparts, reviewed paragraph by paragraph.
- PASS: seven supplied image originals are byte-identical; all four article routes have paired English/Chinese sitemap entries.
- PASS: Astro check, ESLint, Prettier, i18n shape checks, 14 unit tests, static build (50 routes) and internal links (51 HTML files including the report).
- PASS: 22 Docs/Blog regression browser checks across desktop and mobile emulation, including both languages, light/dark accessibility, search, existing covers, code copy and no-JavaScript reading.
- PASS: final 8 article/report browser checks (58.2 s) across desktop and mobile emulation: full bilingual content, figure loading/aspect ratios, full-size targets, exact article language switching, metadata, topic/full-text indexing, no-JavaScript access, and standalone report dependencies/layout/accessibility.
- Production deployment and live verification: pending at commit time; final release status is reported in the delivery conversation.

The initial article run exposed a visible-caption disclosure omission, which was fixed without weakening the test. One subsequent run was interrupted because a rebuild had failed on Astro telemetry preferences; telemetry was disabled and the build completed before the final run. Neither failed nor interrupted runs are counted as passing acceptance.

Existing diagnostics: a Lighthouse script type hint and the pre-existing large city bundle warning. This content task does not change the city runtime. Browser mobile emulation is not physical-device testing. Search-engine indexing and actual service delivery are NOT_VERIFIED; no reliability experiment or benchmark was run.
