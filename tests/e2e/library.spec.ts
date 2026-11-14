import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths = [
  'docs/',
  'blog/',
  'docs/agent-reliability/assessment-overview/',
  'docs/agent-reliability/assessment-start/',
  'docs/agent-reliability/assessment-evidence/',
  'docs/starter-id/id-overview/',
  'docs/starter-id/id-start/',
  'docs/starter-id/id-operations/',
  'docs/hyperraft/hyperraft-overview/',
  'docs/qualitysphere/qualitysphere-overview/',
  'docs/reconsphere/reconsphere-overview/',
  'blog/retry-budget/',
  'blog/rollback-state/',
  'blog/failover-dependencies/',
  'blog/ai-agent-reliability-assessment/',
  'blog/ai-agent-cross-system-investigation/',
];
for (const lang of ['en', 'zh-CN']) {
  test(`${lang} library routes, reading navigation and contact context`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    for (const suffix of paths) {
      const path = `/${lang}/${suffix}`;
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      if (lang === 'en')
        expect(await page.locator('body').innerText()).not.toMatch(
          /\p{Script=Han}/u,
        );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://www.smartscity.com${path}`,
      );
      const other = lang === 'en' ? 'zh-CN' : 'en';
      await expect(page.locator('.language-switch')).toHaveAttribute(
        'href',
        `/${other}/${suffix}`,
      );
      if (
        suffix.endsWith('overview/') ||
        suffix.endsWith('start/') ||
        (suffix.startsWith('blog/') && suffix !== 'blog/')
      ) {
        const href = await page
          .locator('.reading-contact a[href^="mailto:"]')
          .getAttribute('href');
        expect(href).toContain('mailto:liyunlong@smartscity.com?');
        expect(decodeURIComponent(href!)).toContain(
          `https://www.smartscity.com${path}`,
        );
        expect(decodeURIComponent(href!)).toContain(
          await page.locator('h1').innerText(),
        );
      }
      const brokenAnchors = await page
        .locator('.reading-mobile-toc a,.reading-toc a')
        .evaluateAll((links) =>
          links
            .filter(
              (link) =>
                !document.getElementById(
                  decodeURIComponent((link as HTMLAnchorElement).hash.slice(1)),
                ),
            )
            .map((link) => link.getAttribute('href')),
        );
      expect(brokenAnchors).toEqual([]);
    }
  });
  test(`${lang} full-text search, filters, empty state and URL restore`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/docs/`);
    const root = page.locator('[data-library-search]');
    await root.locator('select[name="kind"]').selectOption('');
    await root
      .locator('input')
      .fill(lang === 'en' ? 'per-attempt timeout' : '单次超时');
    await expect(root.locator('[data-reading]:visible')).toHaveCount(1);
    await expect(root.locator('[data-reading]:visible h3 a')).toHaveAttribute(
      'href',
      `/${lang}/blog/retry-budget/`,
    );
    await page.reload();
    await expect(root.locator('[data-reading]:visible')).toHaveCount(1);
    await root.locator('input').fill('no-result-987654321');
    await expect(root.locator('[data-empty]')).toBeVisible();
    await root.locator('button[type="reset"]').click();
    await expect(root.locator('[data-reading]:visible')).toHaveCount(16);
    await root.locator('select[name="product"]').selectOption('starter-id');
    await expect(root.locator('[data-reading]:visible')).toHaveCount(3);
    await root.locator('select[name="topic"]').selectOption('release-recovery');
    await expect(root.locator('[data-empty]')).toBeVisible();
  });
  for (const theme of ['dark', 'light'] as const)
    test(`${lang} library accessibility ${theme}`, async ({ page }) => {
      test.setTimeout(90000);
      await page.emulateMedia({ colorScheme: theme });
      for (const path of [
        'docs/',
        'blog/retry-budget/',
        'blog/ai-agent-reliability-assessment/',
        'blog/ai-agent-cross-system-investigation/',
        'docs/starter-id/id-start/',
      ]) {
        await page.goto(`/${lang}/${path}`);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(
          results.violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
      }
    });
}
test('code copy writes the code and reports permission failure honestly', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/docs/starter-id/id-start/');
  await page
    .getByRole('button', { name: 'Copy code', exact: true })
    .first()
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'git checkout 6e60f068',
  );
  await expect(page.locator('.copy-status').first()).toHaveText('Copied');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
      configurable: true,
    }),
  );
  await page
    .getByRole('button', { name: 'Copy code', exact: true })
    .first()
    .click();
  await expect(page.locator('.copy-status').first()).toContainText(
    'Copy unavailable',
  );
});
test('reading and navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/docs/');
  await expect(page.locator('.library-product')).toHaveCount(5);
  await expect(page.locator('[data-reading]:visible')).toHaveCount(9);
  await page.goto('http://127.0.0.1:4321/en/docs/starter-id/id-start/');
  await expect(page.locator('.reading-prose pre').first()).toContainText(
    'git clone',
  );
  await expect(page.locator('.reading-pagination a')).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await context.close();
});

test('English blog covers load and core catalog excludes Starter', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/blog/');
  await expect(
    page.locator('.reading-card:visible .reading-cover img'),
  ).toHaveCount(7);
  for (const img of await page
    .locator('.reading-card:visible .reading-cover img')
    .all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  expect(
    await page
      .locator('.reading-card:visible .reading-cover img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `test-results/blog-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto('/en/blog/retry-budget/');
  await expect(page.locator('.article-cover img')).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://www.smartscity.com/images/blog/retry-budget.png',
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `test-results/article-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto('/en/docs/');
  await expect(page.locator('.catalog-core .library-product')).toHaveCount(3);
  await expect(page.locator('.catalog-core')).toContainText('ReconSphere');
  await expect(page.locator('.catalog-core')).not.toContainText('Starter');
  await expect(page.locator('.catalog-other')).toContainText('Starter');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `test-results/docs-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
