import { createContactDraft } from './contact-draft';
const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const copy = JSON.parse(form.dataset.copy!) as Record<string, string>;
  const recipient = form.dataset.recipient;
  const draft = () => {
    const data = new FormData(form);
    return createContactDraft(
      {
        name: String(data.get('name') || ''),
        organization: String(data.get('organization') || ''),
        topic: String(data.get('topic') || ''),
        message: String(data.get('message') || ''),
      },
      {
        name: copy.name,
        organization: copy.organization,
        topic: copy.topic,
        message: copy.message,
      },
      recipient!,
    );
  };
  if (recipient)
    form
      .querySelectorAll<HTMLButtonElement>('button')
      .forEach((button) => (button.disabled = false));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!recipient || !form.reportValidity()) return;
    status.textContent = copy.draft; // Browser handoff cannot confirm that the visitor sent an email.
    window.location.href = draft().url;
  });
  form
    .querySelector('[data-copy-draft]')
    ?.addEventListener('click', async () => {
      if (!recipient || !form.reportValidity()) return;
      const { subject, body } = draft();
      try {
        await navigator.clipboard.writeText(
          `${recipient}\n${subject}\n\n${body}`,
        );
        status.textContent = copy.copied;
      } catch {
        status.textContent = copy.copyFailed;
      }
    });
}
