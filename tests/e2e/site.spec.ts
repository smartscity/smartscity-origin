import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const slugs = ['hyperraft', 'polarbear', 'qualitysphere', 'polarbear-vocab'];
test('English is the default and core content works without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Engineering',
  );
  await expect(
    page
      .locator('#projects')
      .getByRole('heading', { name: 'Polarbear', exact: true }),
  ).toBeVisible();
  await context.close();
});
for (const lang of ['en', 'zh-CN']) {
  test(`${lang} routes, semantics and layout`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of [
      `/${lang}/`,
      ...slugs.map((s) => `/${lang}/projects/${s}/`),
      `/${lang}/privacy/`,
      `/${lang}/about/`,
      `/${lang}/contact/`,
    ]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://www.smartscity.com${path}`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
  for (const theme of ['dark', 'light']) {
    test(`${lang} accessibility in ${theme} theme`, async ({ page }) => {
      test.setTimeout(90000);
      await page.emulateMedia({ colorScheme: theme as 'dark' | 'light' });
      for (const path of [
        `/${lang}/`,
        ...slugs.map((s) => `/${lang}/projects/${s}/`),
        `/${lang}/about/`,
        `/${lang}/contact/`,
        `/${lang}/privacy/`,
      ]) {
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
      }
    });
  }
}
test('language preserves project route and theme persists', async ({
  page,
}) => {
  await page.goto('/en/projects/polarbear/');
  await page.locator('.project-demo-wrap').scrollIntoViewIfNeeded();
  await page.locator('.language-switch').click();
  await expect(page).toHaveURL(/\/zh-CN\/projects\/polarbear\/$/);
  const previous = await page.locator('html').getAttribute('data-theme');
  await page.locator('.theme-toggle').click();
  expect(await page.locator('html').getAttribute('data-theme')).not.toBe(
    previous,
  );
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
});
test('Raft commits only after replication and resets', async ({ page }) => {
  await page.goto('/en/projects/hyperraft/');
  await page
    .getByRole('button', { name: '1. Propose entry' })
    .scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: '1. Propose entry' }).click();
  await expect(page.getByTestId('commit-index')).toHaveText('0');
  await page
    .getByRole('button', { name: '2. Replicate & acknowledge' })
    .click();
  await expect(page.getByTestId('commit-index')).toHaveText('0');
  await page.getByRole('button', { name: '3. Advance commit index' }).click();
  await expect(page.getByTestId('commit-index')).toHaveText('1');
  await page.getByRole('button', { name: 'Reset cycle' }).click();
  await expect(page.getByTestId('commit-index')).toHaveText('0');
});
test('all product interactions work', async ({ page }) => {
  await page.goto('/en/projects/polarbear/');
  await page.locator('.project-demo-wrap').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Write', exact: true }).click();
  await expect(page.getByRole('textbox')).toBeVisible();
  await page.getByRole('textbox').fill('Local sample');
  await page.getByRole('button', { name: 'Read', exact: true }).click();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  await expect(page.locator('.editor-paper h3')).toHaveText('Local sample');
  await page.goto('/en/projects/qualitysphere/');
  await page.locator('.project-demo-wrap').scrollIntoViewIfNeeded();
  for (let i = 0; i < 5; i++)
    await page.getByRole('button', { name: 'Run sample flow' }).click();
  await expect(page.getByText('Sample flow complete')).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByText('Ready to explore')).toBeVisible();
  await page.goto('/en/projects/polarbear-vocab/');
  await page.locator('.project-demo-wrap').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Reveal meaning' }).click();
  await expect(page.locator('.word-definition')).toBeVisible();
  await page.getByRole('button', { name: 'Next word' }).click();
  await expect(page.locator('.word-content h3')).toHaveText('resilience');
  await expect(page.locator('.word-definition')).toHaveCount(0);
});
test('reduced motion disables continuous animation and unknown routes return 404', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  await expect(page.locator('#digital-city')).toHaveAttribute(
    'data-motion',
    'paused',
  );
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'This path',
  );
});
test('responsive navigation works with keyboard', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en/');
  if (isMobile) {
    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await page
      .locator('#mobile-nav')
      .getByRole('link', { name: 'Projects', exact: true })
      .click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Skip to content' }),
    ).toBeFocused();
  }
});
test('capture homepage', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/en/');
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
