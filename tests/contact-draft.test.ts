import { it, expect } from 'vitest';
import { createContactDraft } from '../src/lib/contact-draft';
it('encodes a fixed-recipient draft without allowing subject or recipient injection', () => {
  const draft = createContactDraft(
    {
      name: 'Alex\r\nBcc: nobody@example.com',
      organization: '',
      topic: '项目 & integration\nOther',
      message: 'Hello & welcome?\n请帮忙了解项目。',
    },
    { name: 'Name', organization: 'Team', topic: 'Topic', message: 'Message' },
    'liyunlong@smartscity.com',
  );
  const url = new URL(draft.url);
  expect(url.pathname).toBe('liyunlong@smartscity.com');
  expect(url.searchParams.get('bcc')).toBeNull();
  expect(url.searchParams.get('subject')).not.toMatch(/[\r\n]/);
  expect(url.searchParams.get('body')).toContain(
    'Hello & welcome?\n请帮忙了解项目。',
  );
  expect(url.searchParams.get('body')).toContain('Team: —');
});
