import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
export type Reading = CollectionEntry<'library'>;
/** Fail the build on ambiguous identity, missing translations or dangling public links. */
export function selectPublished(entries: Reading[], lang?: Locale) {
  const published = entries.filter((e) => e.data.status === 'published');
  const keys = new Set(
    published.map(
      (e) => `${e.data.language}/${e.data.kind}/${e.data.contentId}`,
    ),
  );
  if (keys.size !== published.length) throw new Error('Duplicate reading ID');
  for (const entry of published) {
    const d = entry.data;
    if (d.kind === 'blog' && (!d.cover || !d.coverAlt))
      throw new Error(`Missing article cover: ${entry.id}`);
    const other = d.language === 'en' ? 'zh-CN' : 'en';
    const translation = published.find(
      (e) =>
        e.data.language === other &&
        e.data.kind === d.kind &&
        e.data.contentId === d.contentId,
    );
    if (
      !translation ||
      translation.data.product !== d.product ||
      translation.data.sourceRevision !== d.sourceRevision
    )
      throw new Error(`Missing or mismatched translation: ${entry.id}`);
    for (const related of d.related) {
      if (
        !published.some(
          (e) => e.data.language === d.language && e.data.contentId === related,
        )
      )
        throw new Error(`Missing related reading: ${related}`);
    }
  }
  return published
    .filter((e) => !lang || e.data.language === lang)
    .sort((a, b) => a.data.order - b.data.order);
}
