import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const lang of ['en', 'zh-CN']) {
  test(`${lang} strategy house is localized, readable and keyboard accessible`, async ({
    page,
  }, testInfo) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(`/${lang}/about/`);
      const section = page.locator('.strategy-house');
      const img = section.locator('img');
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth))
        .toBe(1440);
      await expect(img).toHaveAttribute(
        'src',
        `/images/company/strategy-house-${lang}.svg`,
      );
      await expect(img).not.toHaveAttribute('alt', '');
      if (lang === 'en') {
        expect(await page.locator('body').innerText()).not.toMatch(
          /\p{Script=Han}/u,
        );
        const svg = await page.request.get(
          '/images/company/strategy-house-en.svg',
        );
        expect(svg.status()).toBe(200);
        expect(await svg.text()).not.toMatch(/\p{Script=Han}/u);
      }
      const summary = section.locator('summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(section.locator('details')).toHaveAttribute('open', '');
      await expect(section.locator('.strategy-pillars > div')).toHaveCount(3);
      await expect(section.locator('.strategy-text-content li')).toHaveCount(6);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await section.screenshot({
        path: `test-results/strategy-${lang}-${theme}-${testInfo.project.name}.png`,
      });
    }
    const link = page.locator('.strategy-visual');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/strategy-house-${lang}\\.svg$`));
    await expect(page.locator('svg')).toHaveAttribute(
      'viewBox',
      '0 0 1440 1440',
    );
    // Verify translated text stays inside the illustration, without relying on image screenshots alone.
    const overflow = await page.locator('svg text').evaluateAll((elements) =>
      elements
        .filter((el) => {
          const b = (el as SVGGraphicsElement).getBBox();
          return (
            b.x < 0 || b.y < 0 || b.x + b.width > 1440 || b.y + b.height > 1440
          );
        })
        .map((el) => el.textContent),
    );
    expect(overflow).toEqual([]);
    if (lang === 'en') {
      const overlaps = await page.locator('svg text').evaluateAll((elements) =>
        elements
          .filter((el) => {
            const node = el as SVGGraphicsElement;
            const b = node.getBBox();
            const x = Number(el.getAttribute('x'));
            const y = Number(el.getAttribute('y'));
            if (y === 311) {
              const roofLeft = 720 - ((b.y - 170) * 640) / 240;
              return b.x < roofLeft + 8 || b.x + b.width > 1440 - roofLeft - 8;
            }
            if (y >= 620 && y <= 873 && [136, 556, 976].includes(x))
              return b.x + b.width > x + 328;
            if ([1099, 1147].includes(y)) return b.x + b.width > x + 364;
            return false;
          })
          .map((el) => el.textContent),
      );
      expect(overlaps).toEqual([]);
    }
  });
}

test('strategy diagram and text work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const lang of ['en', 'zh-CN']) {
    await page.goto(`${baseURL}/${lang}/about/`);
    await page.locator('.strategy-text summary').click();
    await expect(page.locator('.strategy-pillars')).toBeVisible();
    await page.locator('.strategy-visual').click();
    await expect(page.locator('svg')).toBeVisible();
  }
  await context.close();
});
