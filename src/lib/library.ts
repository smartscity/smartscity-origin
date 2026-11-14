import { getCollection } from 'astro:content';
import { documentationProducts } from '../data/projects';
import type { Locale } from '../i18n';
import { selectPublished, type Reading } from './reading-policy';
export type { Reading } from './reading-policy';
export const productIds = [
  'enterprise-agents',
  ...documentationProducts.map((product) => product.id),
] as const;
export function readingPath(entry: Reading) {
  const d = entry.data;
  return `/${d.language}/${d.kind}/${d.kind === 'docs' ? `${d.product}/` : ''}${d.contentId}/`;
}
/** One publication boundary serves routes, navigation, related links and search. */
export async function publishedReadings(lang?: Locale) {
  return selectPublished(await getCollection('library'), lang);
}
