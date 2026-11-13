import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const lang of ['en', 'zh-CN'])
  test(`${lang} local email composer, responsive layout and accessibility`, async ({
    page,
    context,
  }, info) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${lang}/contact/`);
    const form = page.locator('[data-contact-form]');
    await expect(form).toBeVisible();
    await expect(form.locator('[name=email]')).toHaveCount(0);
    await form.locator('[name=name]').fill('Alex');
    await form
      .locator('[name=message]')
      .fill('I would like help with a distributed system integration.');
    let posts = 0;
    page.on('request', (r) => {
      if (r.method() === 'POST') posts++;
    });
    await form.locator('button[type=submit]').click();
    await expect(page.locator('[data-status]')).toContainText(
      lang === 'en' ? 'Continue in your email app' : '请在邮件应用中',
    );
    await expect(form.locator('[name=message]')).not.toHaveValue('');
    expect(posts).toBe(0);
    await form.locator('[data-copy-draft]').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      'liyunlong@smartscity.com',
    );
    await expect(page.locator('[data-status]')).toContainText(
      lang === 'en' ? 'copied' : '已复制',
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      }),
    );
    await form.locator('[data-copy-draft]').click();
    await expect(page.locator('[data-status]')).toContainText(
      lang === 'en' ? 'Copy unavailable' : '无法自动复制',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    if (lang === 'en')
      expect(await page.locator('body').innerText()).not.toMatch(
        /\p{Script=Han}/u,
      );
    await form.evaluate((el) => (el as HTMLFormElement).reset());
    await page.locator('[data-status]').evaluate((el) => (el.textContent = ''));
    await page.locator('h1').click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: `/tmp/contact-${lang}-${info.project.name}.png`,
      fullPage: true,
    });
  });
test('contact retains an email path without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/contact/');
  await expect(page.locator('form button[type=submit]')).toBeDisabled();
  await expect(page.locator('.inquiry-direct a')).toHaveAttribute(
    'href',
    'mailto:liyunlong@smartscity.com',
  );
  await context.close();
});
