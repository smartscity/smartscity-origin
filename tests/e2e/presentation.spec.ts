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

test('city motion respects reduced motion and offscreen visibility', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  await expect(page.locator('#digital-city')).toHaveAttribute(
    'data-motion',
    'paused',
  );
  await expect(
    page.getByRole('button', { name: 'Pause motion' }),
  ).toBeDisabled();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#digital-city')).toHaveAttribute(
    'data-motion',
    'running',
  );
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(page.locator('#digital-city')).toHaveAttribute(
    'data-motion',
    'paused',
  );
});
