import en from './en.json';
import zh from './zh-CN.json';
export const locales = ['en', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;
export const dictionaries: Record<Locale, Dictionary> = { en, 'zh-CN': zh };
export function alternatePath(path: string, target: Locale) {
  const suffix = path.replace(/^\/(en|zh-CN)(?=\/|$)/, '');
  return `/${target}${suffix || '/'}`;
}
