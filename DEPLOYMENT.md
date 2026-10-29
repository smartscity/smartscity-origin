# Cloudflare Pages deployment

## Connected project

Configured on 2026-10-30:

- Pages project: `smartscity-origin`
- Source: `smartscity/smartscity-origin`, production branch `main`
- Build: `npm run build`; output: `dist`; `NODE_VERSION=24`
- Public site: https://smartscity-origin.pages.dev
- Initial deployment `429a2798-0df6-4e64-8d14-2c8a4fadc3c3` succeeded for commit `7b0d4fb`.
- English and Chinese pages were opened successfully in the browser.
- Pages builds run independently of the GitHub quality workflow. The quality workflow currently reports browser accessibility failures; deployment success does not mean all quality gates passed.

Custom-domain setup and DNS are separate from this GitHub-to-Pages pipeline. This task did not change DNS records.

## Source and build

Repository: `https://github.com/smartscity/smartscity-origin`

Use native Cloudflare Pages Git integration for this static site. No Worker, database, paid add-on, or separate GitHub deployment workflow is required. GitHub Actions performs quality checks; Pages performs its own production build.

1. In Cloudflare, create a Pages project and connect this GitHub repository.
2. Choose `main` as the production branch.
3. Set build command to `npm run build` and output directory to `dist`.
4. Set `NODE_VERSION=24` and optionally `ASTRO_TELEMETRY_DISABLED=1`. There are no secret or client API variables.
5. Deploy to the actual hostname assigned by Pages. Do not assume a project name or hostname before creation.
6. Check English and Chinese routes, asset loading, browser console, unknown-route 404 status, headers, project links, language switching, mobile navigation, and all interactive demonstrations.
7. Keep non-production branch previews enabled only as desired. Review preview access settings before using them for confidential changes.

The static output is intended for the Pages free tier. Plan quotas and current limits are not asserted here; check the official dashboard/documentation before enabling any paid feature. No deployment was performed merely by preparing this repository.

## Existing Alibaba Cloud DNS

The intended initial host is `www.smartscity.com`. **Do not change the root domain or nameservers as part of this setup.**

1. Add `www.smartscity.com` to the Pages project's **Custom domains** first.
2. In the current DNS provider, add or deliberately update only the `www` CNAME to the exact Pages hostname shown by Cloudflare.
3. Wait for custom-domain validation and certificate activation.
4. Verify HTTPS, both locale paths, canonical URLs, social images, sitemap, and redirects on the actual domain.
5. Preserve existing MX, SPF, DKIM, DMARC, email-verification records, and all unrelated business records. Never recreate the DNS zone.

If an existing `www` record serves another application, review that change with the owner before replacing it. Root-domain canonicalization requires a separately approved plan. No domain forwarding service is needed for the `www` CNAME approach.

## Host configuration

`astro.config.mjs` sets the canonical production origin to `https://www.smartscity.com`. If the owner changes the production host, update that configuration, `robots.txt`, the organization structured data, and browser-test canonical assertions together.

`public/_redirects` sends `/` to `/en/`. `404.html` supplies the static not-found document; do not add an SPA catch-all rewrite. Cloudflare's static handling of unknown routes must be verified on deployment. `public/_headers` provides the headers and immutable caching for hashed `_astro` assets. Local Astro preview does not reproduce every Cloudflare header or routing rule.

## Release and rollback

Run all CI quality gates before promoting a build. Use Pages deployment history to roll back to the prior successful deployment. A Git push, Pages build, Pages deployment, custom-domain activation, and live-domain verification are separate delivery states.

Official references: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [redirects](https://developers.cloudflare.com/pages/configuration/redirects/).
