# Contributing

Use Node 24 LTS and `npm ci`. Keep primary content static, translations complete, and project facts tied to public sources in `CONTENT_AUDIT.md`. Preserve the requested company identity and existing DNS boundaries.

Run the checks in README before proposing a change. Format with `npm run format`. Browser tests use a production build. Do not replace missing metadata with fabricated values or publish private project documentation.

For animations, preserve reduced-motion support, keyboard behavior, readable static fallback, and offscreen/background pausing. For interactive demos, explain model assumptions and test meaningful state transitions. Avoid a global application store for independent page islands.

Use descriptive English Conventional Commits. Record actual validation results and label unrun checks `NOT_RUN`; local browser results are not deployed-site verification.
