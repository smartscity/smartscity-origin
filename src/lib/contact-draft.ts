export function createContactDraft(
  fields: {
    name: string;
    organization: string;
    topic: string;
    message: string;
  },
  labels: {
    name: string;
    organization: string;
    topic: string;
    message: string;
  },
  recipient: string,
) {
  const clean = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();
  const subject = `Smartscity — ${clean(fields.topic)}`;
  const body = `${labels.name}: ${clean(fields.name)}\n${labels.organization}: ${clean(fields.organization) || '—'}\n${labels.topic}: ${clean(fields.topic)}\n\n${labels.message}:\n${fields.message.trim()}`;
  return {
    subject,
    body,
    url: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
