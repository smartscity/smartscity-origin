import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const lang of ['en', 'zh-CN']) {
  test(`${lang} city opens the library, edits a sample and returns by keyboard`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${lang}/`);
    const city = page.locator('#digital-city');
    await expect(city).toHaveAttribute('data-scene', 'ready', {
      timeout: 30000,
    });
    await page.locator('.city-dock button').nth(0).click();
    await expect(page.locator('.city-detail h2')).toHaveText('Polarbear');
    await page.locator('.city-open').click();
    await expect(page.locator('.city-open')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await page
      .locator('.city-editor textarea')
      .fill('# A persistent thought\n\nLocal demonstration.');
    await page.locator('.city-editor-modes button').nth(2).click();
    await expect(page.locator('.city-editor textarea')).toHaveCount(0);
    await expect(page.locator('.city-editor-preview h4')).toHaveText(
      'A persistent thought',
    );
    const a11y = await new AxeBuilder({ page })
      .include('.digital-city')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      a11y.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.city-detail')).toHaveCount(0);
    await expect(page.locator('.city-dock button').nth(0)).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  });
}

test('tour reaches the archive and returns to the overview', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Take a guided tour' }).click();
  for (const name of [
    'Polarbear',
    'Polarbear Vocab',
    'HyperRaft',
    'QualitySphere',
  ]) {
    await expect(page.locator('.city-detail h2')).toHaveText(name);
    await page
      .getByRole('button', { name: 'Next district', exact: true })
      .click();
  }
  await expect(page.locator('.city-detail h2')).toHaveText('Polarbear Memory');
  await page.getByRole('button', { name: 'Assemble context' }).click();
  await expect(page.getByRole('status')).toHaveText('Context packet assembled');
  await page.locator('.city-next').click();
  await expect(page.locator('.city-detail')).toHaveCount(0);
});

test('WebGL absence retains project navigation and library interaction', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === 'webgl2') return null;
      return original.call(this, type as '2d', ...(args as [])) as never;
    } as typeof original;
  });
  await page.goto('/en/');
  await expect(page.locator('#digital-city')).toHaveAttribute(
    'data-scene',
    'fallback',
  );
  await page.locator('.city-dock button').nth(0).click();
  await page.getByRole('button', { name: 'Look inside' }).click();
  await expect(page.locator('.city-editor textarea')).toBeVisible();
  await expect(page.locator('.city-detail-link')).toHaveAttribute(
    'href',
    '/en/projects/polarbear/',
  );
});
