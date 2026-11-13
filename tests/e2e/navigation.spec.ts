import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const lang of ['en', 'zh-CN']) {
  test(`${lang} grouped navigation supports keyboard and dismissal`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(`/${lang}/about/`);
    const menu = page.locator('.mobile-menu');
    const nav = page.locator(isMobile ? '#mobile-nav' : '.desktop-nav');
    if (isMobile) await menu.locator(':scope > summary').click();
    const summaries = nav.locator('.nav-group > summary');
    await expect(summaries).toHaveCount(3);
    await summaries.nth(0).focus();
    await page.keyboard.press('Enter');
    await expect(
      nav.getByRole('link', { name: 'HyperRaft', exact: true }),
    ).toBeVisible();
    await summaries.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(
      nav.getByRole('link', { name: 'HyperRaft', exact: true }),
    ).not.toBeVisible();
    const docs = nav.getByRole('link', {
      name: lang === 'en' ? 'Docs' : '文档',
      exact: true,
    });
    await expect(docs).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(summaries.nth(1)).toBeFocused();
    await expect(docs).not.toBeVisible();
    await page.keyboard.press('Enter');
    const results = await new AxeBuilder({ page })
      .include('.site-header')
      .analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/navigation-${lang}-${isMobile ? 'mobile' : 'desktop'}.png`,
    });
    await docs.click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/docs/$`));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (lang === 'en')
      expect(await page.locator('.site-header').innerText()).not.toMatch(
        /\p{Script=Han}/u,
      );
    if (isMobile) {
      await menu.locator(':scope > summary').click();
      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('open', '');
      await expect(menu.locator(':scope > summary')).toBeFocused();
    } else {
      await page.setViewportSize({ width: 820, height: 900 });
      await expect(nav).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await summaries.first().hover();
      await expect(
        nav.getByRole('link', { name: 'HyperRaft', exact: true }),
      ).toBeVisible();
      await page.mouse.click(8, 750);
      await expect(nav.locator('.nav-group[open]')).toHaveCount(0);
    }
  });
}

test('mobile navigation remains usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('/en/about/');
  await page.locator('.mobile-menu > summary').click();
  await page.locator('#mobile-nav .nav-group > summary').nth(1).click();
  await page
    .locator('#mobile-nav')
    .getByRole('link', { name: 'Blog', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/blog\/$/);
  await expect(page.locator('h1')).toBeVisible();
  await context.close();
});
