# Smartscity / 必赢科技

The English-first, bilingual company and project portal for Smartscity. Astro renders static HTML; small React islands explain consensus, writing, quality workflows, and vocabulary practice. Dark and light themes, reduced motion, and mobile navigation are included.

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
- `src/styles/global.css`: visual tokens, layout, responsive behavior, motion, and light theme.
- `public/images/`: the requested GitHub organization avatar and original social artwork.

Polarbear and Polarbear Vocab have verified public repositories. HyperRaft and QualitySphere are presented using the owner-provided positioning with public technical details pending. They are not described as publicly available source code. See [CONTENT_AUDIT.md](CONTENT_AUDIT.md).

## Delivery

- [Architecture](ARCHITECTURE.md)
- [Cloudflare and domain deployment](DEPLOYMENT.md)
- [Content evidence and asset attribution](CONTENT_AUDIT.md)
- [Verification record](docs/VALIDATION.md)
- [Company identity evidence and pending fields](COMPANY_IDENTITY_TODO.md)
- [Apple Developer website readiness](docs/APPLE_DEVELOPER_READINESS.md)
- [Contribution guide](CONTRIBUTING.md)

The GitHub repository stores the source. Pushing source is distinct from deploying Cloudflare Pages or changing DNS. No Cloudflare resource or domain is created by this repository itself.
