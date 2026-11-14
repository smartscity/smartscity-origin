# Smartscity / 必赢科技

The English-first, bilingual Smartscity portal for enterprise agent work, specialist engineering methods and products. Astro renders static HTML; small React islands explain consensus, writing, quality workflows, and vocabulary practice. Below the enterprise introduction, the homepage retains a five-district WebGL city with building selection, guided camera transitions and an expandable library. Green brand accents, dark and white themes, reduced motion, and mobile navigation are included.

Official website: [www.smartscity.com](https://www.smartscity.com/en/) · [简体中文](https://www.smartscity.com/zh-CN/). Cloudflare preview: [smartscity-origin.pages.dev](https://smartscity-origin.pages.dev/en/).

## Local development

Use Node 24 LTS (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/en/` or `/zh-CN/`. The root redirects to English. All four projects have routes under `/{locale}/projects/{slug}/`.

Company information, official contact channels and privacy details are available at `/{locale}/about/`, `/{locale}/contact/` and `/{locale}/privacy/`.

```sh
npm run check
npm run lint
npm run format:check
npm run check:i18n
npm test
npm run build
npm run check:links
npx playwright install chromium
CI=1 npm run test:e2e
```

On developer machines the browser tests use installed Google Chrome. `CI=1` selects Playwright Chromium. The production output is `dist/`. Tests launch the production preview automatically.

For a local Lighthouse audit, start `npm run preview -- --port 4321` in another terminal, then run `npm run audit:lighthouse`. Optionally set `CHROME_PATH` to your browser executable. HTML and JSON reports are written to `.lighthouse/` and ignored by Git.

## Content ownership

- `src/data/projects.ts`: project identity, public links, verified release snapshot, and bilingual product copy.
- `src/data/company.ts`: publication-approved company identity, source records, optional corporate facts and Organization JSON-LD projection. Reference translations never replace registered legal names.
- `src/i18n/{en,zh-CN}.json`: shared interface and demonstration copy.
- `src/components/city/`: city navigation reducer, lazy-loaded procedural Three.js scene and local library sample.
- `src/styles/city.css`: city composition, responsive district navigation and detail panels.
- `src/styles/global.css`: shared visual tokens, layout, responsive behavior, motion, and light theme.
- `public/images/`: the requested GitHub organization avatar, original social artwork and the no-WebGL city poster.

Polarbear and Polarbear Vocab have verified public repositories. HyperRaft has verified public Maven Central 0.1.0 package metadata; its private repository and benchmark reports are not linked as public evidence. QualitySphere retains owner-provided positioning with public technical details pending. See [CONTENT_AUDIT.md](CONTENT_AUDIT.md).

## Delivery

- [Architecture](ARCHITECTURE.md)
- [Cloudflare and domain deployment](DEPLOYMENT.md)
- [Content evidence and asset attribution](CONTENT_AUDIT.md)
- [Verification record](docs/VALIDATION.md)
- [Company identity evidence and pending fields](COMPANY_IDENTITY_TODO.md)
- [Apple Developer website readiness](docs/APPLE_DEVELOPER_READINESS.md)
- [Contribution guide](CONTRIBUTING.md)

The GitHub repository stores the source. Pushing source is distinct from deploying Cloudflare Pages or changing DNS. No Cloudflare resource or domain is created by this repository itself.

## Maintaining Docs and Blog

Content lives in `src/content/library/*.md`, validated by `src/content.config.ts`.
Use the same `contentId`, `product`, and `sourceRevision` for English and Chinese counterparts. Set `kind`, `section`, `topic`, `version`, `order`, `summary`, author, update date, public sources and related IDs explicitly. Keep interface strings in `src/i18n` and product identity/evidence in `src/data/projects.ts`.

Only `status: published` enters routes, lists, search and sitemap. `draft` and `review` remain repository-only; review Markdown locally before promotion. Publication status is content eligibility, not production release authorization. The build rejects missing translations, divergent translation revisions, duplicate IDs and missing public related targets. Do not publish private source links, local paths, unapproved measurements or planned API commands.

Docs use `/{lang}/docs/{product}/{contentId}/`; Blog uses `/{lang}/blog/{contentId}/`. Preserve IDs when revising content. There is one documented version per entry today, so versions are labels rather than an empty version switch. The public source pin belongs in the article metadata and sources. Search is local full-text filtering with type/product/topic controls; no service, CMS or account is required. Adding a topic with no content does not create a dead-end filter.

Run the normal checks above, including `tests/e2e/library.spec.ts`. Review both languages, public sources, no-JavaScript reading, copy success/failure, mailto context, narrow layouts and accessibility before publication. Product samples and production telemetry need their own validation; website tests do not validate them.
