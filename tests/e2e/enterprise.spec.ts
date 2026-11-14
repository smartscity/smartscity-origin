import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const articles = ['enterprise-agent-teams', 'governable-agent-expertise'];
for (const lang of ['en', 'zh-CN']) {
  test(`${lang} enterprise direction, strategy and full articles`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`/${lang}/`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(
      lang === 'en' ? 'AI agents' : '以智能体',
    );
    await expect(page.locator('.enterprise-capabilities li')).toHaveCount(5);
    await expect(page.locator('.pilot-cards article')).toHaveCount(3);
    await expect(page.locator('.enterprise-reading-grid article')).toHaveCount(
      2,
    );
    await expect(page.locator('.enterprise-actions .button')).toHaveAttribute(
      'href',
      `/${lang}/contact/`,
    );
    await page.screenshot({
      path: `test-results/enterprise-home-${lang}-${info.project.name}.png`,
    });
    const accessibility = await new AxeBuilder({ page })
      .include('.enterprise-hero')
      .include('.enterprise-capabilities')
      .include('.enterprise-pilot')
      .analyze();
    expect(accessibility.violations).toEqual([]);
    if (lang === 'en')
      expect(await page.locator('body').innerText()).not.toMatch(
        /\p{Script=Han}/u,
      );
    await page.goto(`/${lang}/about/`);
    await expect(page.locator('h1')).toContainText(
      lang === 'en' ? 'Enterprise AI agents' : '企业智能体',
    );
    const tree = page.locator('.strategy-tree');
    await tree.locator('img').scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        tree
          .locator('img')
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBe(1440);
    await expect(tree.locator('figcaption')).toContainText(
      lang === 'en' ? 'under review' : '待审阅',
    );
    await expect(page.locator('.strategy-history')).not.toHaveAttribute(
      'open',
      '',
    );
    await expect(page.locator('.agent-progress')).toContainText(
      lang === 'en' ? 'under development' : '研发中',
    );
    await tree.screenshot({
      path: `test-results/enterprise-tree-${lang}-${info.project.name}.png`,
    });
    for (const id of articles) {
      await page.goto(`/${lang}/blog/${id}/`);
      const prose = page.locator('.reading-prose');
      expect(await prose.locator('p').count()).toBeGreaterThan(15);
      expect(await prose.locator('h2').count()).toBeGreaterThanOrEqual(5);
      const img = prose.locator('figure img');
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBe(1280);
      await expect(img).not.toHaveAttribute('alt', '');
      await expect(prose.locator('figure a').last()).toHaveAttribute(
        'href',
        /\.svg$/,
      );
      await expect(page.locator('h1')).toHaveCount(1);
      const metadata = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const post = metadata
        .map((text) => JSON.parse(text))
        .find((data) => data['@type'] === 'BlogPosting');
      expect(post.inLanguage).toBe(lang);
      expect(post.headline).toBe(await page.locator('h1').innerText());
      expect(
        (await page.request.get(new URL(post.image).pathname)).status(),
      ).toBe(200);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      if (lang === 'en')
        expect(await page.locator('body').innerText()).not.toMatch(
          /\p{Script=Han}/u,
        );
      expect(await prose.innerText()).not.toMatch(
        /\/Users\/|file:\/\/|IN_REVIEW/,
      );
      const audit = await new AxeBuilder({ page })
        .include('.reading-prose')
        .analyze();
      expect(audit.violations).toEqual([]);
      await page.screenshot({
        path: `test-results/${id}-${lang}-${info.project.name}.png`,
        fullPage: true,
      });
      await page.locator('.language-switch').click();
      await expect(page).toHaveURL(
        new RegExp(`/${lang === 'en' ? 'zh-CN' : 'en'}/blog/${id}/$`),
      );
    }
    await page.goto(`/${lang}/blog/`);
    await expect(page.locator('[data-reading]:visible')).toHaveCount(7);
    await page
      .locator('select[name="product"]')
      .selectOption('enterprise-agents');
    await expect(page.locator('[data-reading]:visible')).toHaveCount(2);
    await page
      .locator('input[name="q"]')
      .fill(lang === 'en' ? 'candidate version' : '撤回时要明确');
    await expect(page.locator('[data-reading]:visible')).toHaveCount(1);
    await expect(page.locator('[data-reading]:visible h3 a')).toHaveAttribute(
      'href',
      `/${lang}/blog/governable-agent-expertise/`,
    );
  });
}

test('enterprise reading and strategy work without scripts', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const lang of ['en', 'zh-CN']) {
    await page.goto(`${baseURL}/${lang}/`);
    await expect(page.locator('.enterprise-hero h1')).toBeVisible();
    await expect(page.locator('.enterprise-reading-grid article')).toHaveCount(
      2,
    );
    await page.goto(`${baseURL}/${lang}/about/`);
    await expect(page.locator('.strategy-tree-text')).toBeVisible();
    for (const id of articles) {
      await page.goto(`${baseURL}/${lang}/blog/${id}/`);
      await expect(page.locator('.reading-prose h2').first()).toBeVisible();
      await expect(page.locator('.reading-prose figure img')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  }
  await context.close();
});
