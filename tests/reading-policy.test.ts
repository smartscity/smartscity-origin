import { describe, expect, it } from 'vitest';
import { selectPublished, type Reading } from '../src/lib/reading-policy';
function entry(
  language: 'en' | 'zh-CN',
  overrides: Partial<Reading['data']> = {},
): Reading {
  return {
    id: `${language}-one`,
    collection: 'library',
    body: 'body',
    data: {
      contentId: 'one',
      language,
      kind: 'docs',
      status: 'published',
      product: 'agent-reliability',
      sourceRevision: '1',
      related: [],
      order: 1,
      section: 'overview',
      topic: 'ai-engineering',
      title: 'One',
      summary: 'Summary',
      version: '1',
      updated: '2026-11-12',
      author: 'Smartscity',
      sources: [],
      ...overrides,
    },
  };
}
describe('publication boundary', () => {
  it('excludes draft and review content before validating public translations or links', () => {
    const all = [
      entry('en'),
      entry('zh-CN'),
      entry('en', {
        contentId: 'secret',
        status: 'draft',
        related: ['missing'],
      }),
      entry('en', { contentId: 'pending', status: 'review' }),
    ];
    expect(selectPublished(all, 'en').map((e) => e.data.contentId)).toEqual([
      'one',
    ]);
  });
  it('rejects missing translations and divergent source revisions', () => {
    expect(() => selectPublished([entry('en')])).toThrow('translation');
    expect(() =>
      selectPublished([entry('en'), entry('zh-CN', { sourceRevision: '2' })]),
    ).toThrow('translation');
  });
  it('rejects ambiguous identities and links to unpublished readings', () => {
    expect(() =>
      selectPublished([entry('en'), entry('en'), entry('zh-CN')]),
    ).toThrow('Duplicate');
    expect(() =>
      selectPublished([
        entry('en', { related: ['draft'] }),
        entry('zh-CN'),
        entry('en', { contentId: 'draft', status: 'draft' }),
      ]),
    ).toThrow('Missing related');
  });
});
