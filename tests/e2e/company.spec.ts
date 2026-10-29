import { test, expect } from '@playwright/test';
import { company } from '../../src/data/company';

for (const lang of ['en', 'zh-CN'] as const) {
  test(`${lang} corporate pages share identity, working links and locale metadata`, async ({
    page,
  }) => {
    for (const slug of ['about', 'contact', 'privacy']) {
      const path = `/${lang}/${slug}/`;
      await page.goto(path);
      const structured = JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      );
      expect(structured.legalName).toBe(company.operator!.value.legalName);
      expect(structured.email).toBe(company.email!.value);
      expect(structured.url).toBe(company.website);
      for (const key of [
        'address',
        'telephone',
        'identifier',
        'aggregateRating',
        'review',
      ]) {
        expect(structured).not.toHaveProperty(key);
      }
      await expect(
        page.locator('footer [data-company="legal-name"]'),
      ).toHaveText(structured.legalName);
      await expect(page.locator('footer [data-company="country"]')).toHaveText(
        company.countryOfIncorporation!.value[lang],
      );
      await expect(
        page.locator('footer [data-company="email"]'),
      ).toHaveAttribute('href', `mailto:${structured.email}`);
      for (const href of [
        `/${lang}/about/`,
        `/${lang}/contact/`,
        `/${lang}/privacy/`,
        `/${lang}/#projects`,
        company.githubOrganization,
      ]) {
        await expect(
          page.locator(`.footer-links a[href="${href}"]`),
        ).toHaveCount(1);
      }
      for (const locale of ['en', 'zh-CN']) {
        await expect(
          page.locator(`link[hreflang="${locale}"]`),
        ).toHaveAttribute('href', `${company.website}/${locale}/${slug}/`);
      }
      await expect(
        page.locator('meta[name="description"]'),
      ).not.toHaveAttribute('content', '');
      await expect(page.locator('body')).not.toContainText(
        /TODO|TBD|example\.com|\[VERIFIED|®/,
      );
      await expect(page.locator('form')).toHaveCount(0);
      if (slug === 'about') {
        await expect(page.locator('.corporate-project')).toHaveCount(4);
        await expect(page.locator('main')).toContainText(
          'Biying Technology (Beijing) Co., Ltd.',
        );
        await expect(page.locator('main')).toContainText(
          lang === 'en'
            ? 'not a verified registered English name'
            : '不作为已核实的正式英文登记名称',
        );
      }
      await page.locator('.language-switch').click();
      await expect(page).toHaveURL(
        `/${lang === 'en' ? 'zh-CN' : 'en'}/${slug}/`,
      );
    }
  });
}

test('company information is available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/about/');
  await expect(page.locator('main [data-company="legal-name"]')).toBeVisible();
  await expect(page.locator('main [data-company="email"]')).toHaveAttribute(
    'href',
    `mailto:${company.email!.value}`,
  );
  await page.locator('main a[href="/en/contact/"]').click();
  await expect(page).toHaveURL(/\/en\/contact\/$/);
  await context.close();
});
