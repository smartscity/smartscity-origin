import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'node:fs';
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ['--headless', '--no-sandbox'],
});
mkdirSync('.lighthouse', { recursive: true });
try {
  for (const formFactor of ['desktop', 'mobile']) {
    const result = await lighthouse('http://127.0.0.1:4321/en/', {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor,
      screenEmulation:
        formFactor === 'desktop'
          ? {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            }
          : undefined,
    });
    writeFileSync(`.lighthouse/${formFactor}.html`, result.report[0]);
    writeFileSync(`.lighthouse/${formFactor}.json`, result.report[1]);
    const lhr = result.lhr;
    console.log(
      JSON.stringify({
        formFactor,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
        metrics: {
          LCP: lhr.audits['largest-contentful-paint'].numericValue,
          CLS: lhr.audits['cumulative-layout-shift'].numericValue,
          TBT: lhr.audits['total-blocking-time'].numericValue,
        },
        warnings: lhr.runWarnings,
      }),
    );
  }
} finally {
  await chrome.kill();
}
