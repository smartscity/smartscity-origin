import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const slugs = [
  'ai-agent-reliability-assessment',
  'ai-agent-cross-system-investigation',
];
for (const lang of ['en', 'zh-CN']) {
  test(`${lang} agent articles retain full prose, figures, metadata and paired routes`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(90000);
    for (const [index, slug] of slugs.entries()) {
      const path = `/${lang}/blog/${slug}/`;
      await page.goto(path);
      const prose = page.locator('.reading-prose');
      await expect(prose.locator('h2')).toHaveCount(index === 0 ? 5 : 6);
      await expect(prose.locator('figure')).toHaveCount(2);
      await expect(prose).toContainText(
        lang === 'en' ? 'Illustrative sample' : '虚构样稿',
      );
      expect((await prose.innerText()).length).toBeGreaterThan(
        lang === 'en' ? 4000 : 1000,
      );
      if (lang === 'en') {
        expect(await page.locator('body').innerText()).not.toMatch(
          /\p{Script=Han}/u,
        );
        expect(
          await prose
            .locator('img')
            .evaluateAll((imgs) =>
              imgs.map((i) => (i as HTMLImageElement).alt).join(' '),
            ),
        ).not.toMatch(/\p{Script=Han}/u);
      }
      const localeLinks = await prose
        .locator('a[href^="/"]')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
      expect(
        localeLinks
          .filter((h) => !h.startsWith('/images/'))
          .every((h) => h.startsWith(`/${lang}/`)),
      ).toBe(true);
      expect(localeLinks.some((h) => h.endsWith('.md'))).toBe(false);
      await expect(
        page.locator('.reading-contact a[href$="/contact/"]'),
      ).toHaveAttribute('href', `/${lang}/contact/`);
      await expect(
        page
          .locator('.reading-related a[href*="/docs/agent-reliability/"]')
          .first(),
      ).toHaveAttribute('href', new RegExp(`^/${lang}/docs/`));
      for (const figure of await prose.locator('figure').all()) {
        const img = figure.locator('img');
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            img.evaluate((el) => (el as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
        const ratio = await img.evaluate((el) => {
          const i = el as HTMLImageElement;
          return {
            displayed: i.clientWidth / i.clientHeight,
            intrinsic: i.naturalWidth / i.naturalHeight,
          };
        });
        expect(Math.abs(ratio.displayed - ratio.intrinsic)).toBeLessThan(0.01);
        await expect(figure.locator('figcaption')).not.toBeEmpty();
        const target = await figure.locator('a').first().getAttribute('href');
        expect((await page.request.get(target!)).status()).toBe(200);
        await figure.screenshot({
          path: `test-results/${slug}-${lang}-${testInfo.project.name}-${await img.getAttribute('width')}.png`,
        });
      }
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'article',
      );
      const data = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts
            .map((s) => JSON.parse(s.textContent!))
            .find((d) => d['@type'] === 'BlogPosting'),
        );
      expect(data.inLanguage).toBe(lang);
      expect(data.headline).toBe(await page.locator('h1').innerText());
      expect(data.mainEntityOfPage).toBe(`https://www.smartscity.com${path}`);
      expect(data.dateModified).toBe('2026-11-13');
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' }),
      );
      await page.screenshot({
        path: `test-results/${slug}-${lang}-${testInfo.project.name}.png`,
        fullPage: true,
      });
      const other = lang === 'en' ? 'zh-CN' : 'en';
      await page.locator('.language-switch').click();
      await expect(page).toHaveURL(new RegExp(`/${other}/blog/${slug}/$`));
      await expect(page.locator('.reading-prose figure')).toHaveCount(2);
    }
    await page.goto(`/${lang}/blog/`);
    await expect(page.locator('[data-reading]:visible')).toHaveCount(7);
    await page.locator('select[name="topic"]').selectOption('ai-engineering');
    await expect(page.locator('[data-reading]:visible')).toHaveCount(2);
    // A phrase that only occurs in the body verifies full-text indexing of the new articles.
    await page
      .locator('input[name="q"]')
      .fill(lang === 'en' ? 'context propagation' : '上下文传播');
    await expect(page.locator('[data-reading]:visible')).toHaveCount(1);
    await expect(page.locator('[data-reading]:visible h3 a')).toHaveAttribute(
      'href',
      `/${lang}/blog/ai-agent-cross-system-investigation/`,
    );
  });
}

test('English report HTML retains dependencies, sample disclosure and narrow-screen reading', async ({
  page,
}) => {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  await page.goto('/images/blog/agent-articles/report-overview-en.html');
  await expect(page.locator('h1')).toContainText('Enterprise Reliability');
  await expect(page.locator('.sample')).toContainText(
    'Fictional data. Not a customer assessment.',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
  expect(
    await page
      .locator('.brand img')
      .evaluate((el) => (el as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(failed).toEqual([]);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test('new articles and full-size figures remain available without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const lang of ['en', 'zh-CN']) {
    for (const slug of slugs) {
      await page.goto(`${baseURL}/${lang}/blog/${slug}/`);
      await expect(page.locator('.reading-prose figure')).toHaveCount(2);
      await expect(
        page.locator('.reading-contact a[href^="mailto:"]'),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page.locator('.reading-prose figure a').first().click();
      expect(page.url()).toMatch(/\.(html|svg)$/);
    }
  }
  await context.close();
});
