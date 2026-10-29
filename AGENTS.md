# Repository instructions

This is the Smartscity static company and project portal. Keep changes within the user's authorized scope.

- If `.codegraph/` exists, use `codegraph explore` or its MCP tool before locating or reading code. Do not initialize the index automatically.
- Read `ARCHITECTURE.md`, `CONTENT_AUDIT.md`, and the relevant source before changing project claims or demonstration semantics.
- Keep English as default and Simplified Chinese complete. Shared strings belong in `src/i18n`; project facts belong in `src/data/projects.ts`.
- Public claims require public evidence. HyperRaft and QualitySphere currently have owner-provided introductions, not verified public implementations.
- Keep Astro static output and isolated interactive components. Preserve no-JavaScript content, keyboard access, reduced motion, and mobile layouts.
- Run relevant checks from README. Report actual results; never mark an unrun or incomplete check PASS.
- Do not commit generated build output, dependency trees, browser reports, tokens, or environment files.
- Commit, push, release, Cloudflare deployment, and DNS changes follow the user's explicit authorization. Never change unrelated DNS or email records.
