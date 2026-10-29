import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://www.smartscity.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', 'zh-CN': 'zh-CN' } },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    routing: { prefixDefaultLocale: true },
  },
  vite: { plugins: [tailwindcss()] },
});
