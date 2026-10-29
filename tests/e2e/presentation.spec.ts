import { test, expect } from '@playwright/test';

for (const lang of ['en', 'zh-CN']) {
  test(`${lang} project specifications expose their sources`, async ({
    page,
  }) => {
    for (const slug of ['hyperraft', 'polarbear', 'polarbear-vocab']) {
      await page.goto(`/${lang}/projects/${slug}/`);
      const metrics = page.locator('.specifications .metric');
      await expect(metrics).toHaveCount(3);
      for (const metric of await metrics.all()) {
        await expect(metric.locator('.metric-value')).not.toBeEmpty();
        await expect(metric.locator('.metric-detail a')).toHaveAttribute(
          'href',
          /^https:\/\//,
        );
      }
    }
    await page.goto(`/${lang}/projects/hyperraft/`);
    await expect(
      page
        .locator(
          'a[href="https://central.sonatype.com/artifact/com.smartscity/hyperraft-client"]',
        )
        .last(),
    ).toBeVisible();
    await page.goto(`/${lang}/projects/qualitysphere/`);
    await expect(page.locator('.specifications')).toHaveCount(0);
  });
}

test('new ambient motion stops when reduced motion is requested', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  for (const selector of [
    '.travel-wires',
    '.core-float',
    '.ecosystem-module',
  ]) {
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
  }
});

test('ambient motion pauses when its illustration leaves the viewport', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en/');
  await page.locator('.network-art').scrollIntoViewIfNeeded();
  await expect(page.locator('.network-art')).toHaveClass(/in-view/);
  await expect(page.locator('.core-float')).toHaveCSS(
    'animation-play-state',
    'running',
  );
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(page.locator('.network-art')).not.toHaveClass(/in-view/);
  await expect(page.locator('.core-float')).toHaveCSS(
    'animation-play-state',
    'paused',
  );
});
