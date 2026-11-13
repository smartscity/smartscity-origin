# Contact composer — 2026-11-13

The owner explicitly chose: fill in a message, open the visitor's mail application, then send from their own mailbox. The website neither sends nor stores inquiries. It does not verify mailbox ownership or guarantee spam prevention. No email service, API, credentials, DNS changes, Turnstile, form database or server deployment is needed.

The design draws on [Linear contact](https://linear.app/contact)'s distinct business/support routes, with original green artwork and a bilingual, mobile-first form. Name, optional organization, inquiry type and message become an encoded email subject/body addressed only to the existing official company mailbox. The visitor's mail application supplies the sender address. Open-source issues retain their GitHub path.

## Ownership and behavior

- `ContactForm.astro`: static labels, constraints, local-only privacy notice and disabled no-JavaScript actions.
- `contact-draft.ts`: pure draft encoding; fixed recipient supplied by the company registry, header-safe subject, encoded multiline message.
- `contact-form.ts`: document-owned interaction adapter; explicit mailto handoff and clipboard fallback. No submission request, persistence or sent-success state. Inputs remain available after either action. Clipboard denial has a truthful fallback.
- Existing static rendering, global identity and privacy policies remain intact. No generic service hierarchy or state machine is needed for this local draft composer.

## Acceptance

Validate both languages and desktop/mobile layouts, English-only text, accessible field labels, URI encoding, clipboard success/denial, no POST requests and no-JavaScript email fallback. A browser invoking mailto does not prove an installed mail app opened or that the visitor sent the message; actual mail receipt is outside website validation.

The earlier server-send prototype was removed after the owner clarified the intended flow. No provider configuration or real messages were sent.

## Local validation

PASS: Astro check (0 errors, 0 warnings, one existing Lighthouse hint), ESLint, Prettier, i18n parity, 14 unit tests, 46-page static build and internal link checks. Final contact/corporate browser run: 12/12 passed across installed Chrome desktop and mobile emulation, including clipboard success/denial, no inquiry POST and no-JavaScript fallback. Screenshots were reviewed. No mail was sent and installed mail-client delivery is NOT_RUN. Production status is verified separately after the release commit.
