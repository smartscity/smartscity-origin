# Architecture

## Rendering and ownership

Astro generates the English and Simplified Chinese route trees at build time. The default root redirects to `/en/`. `SiteLayout.astro` owns document metadata, locale navigation, theme preference, the responsive menu, and observer setup. Primary content is server-rendered and remains readable without JavaScript. There is no database, backend, CMS, analytics, or visitor-facing API request.

`projects.ts` is the source of truth for canonical project identity and reviewed metadata. Shared language strings live in structurally matched JSON dictionaries. Each product has its own bilingual positioning and capability copy; no text is derived from a live visitor request. New projects are generated from the registry.

CSS owns presentation and ambient SVG animation. Motion is used only for vocabulary transitions. React hydrates demonstrations when visible. There is no GSAP or WebGL dependency and no animation-driven React state loop. The continuous hero animation pauses offscreen and when the document is hidden. Reduced-motion preferences disable ambient CSS animation and Motion transitions.

## State model and pattern decisions

| Problem                                | Choice                                           | Reason                                                                                                         |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Raft teaching steps and commit meaning | Explicit finite state model in `src/lib/raft.ts` | One owner determines log presence, majority acknowledgment, and commit index. The view cannot commit directly. |
| Shared project presentation            | Data-driven page composition                     | Stable page structure with real project-specific visuals and localized content. No class hierarchy needed.     |
| UI demonstrations                      | Independent React islands                        | Each island owns its transient state. No shared store or event bus.                                            |
| External GitHub data                   | Reviewed checked-in snapshot                     | Reproducible builds, graceful absence of metadata, no runtime API failure or credential exposure.              |
| Theme preference                       | Browser adapter in layout                        | Storage errors fall back to an in-memory choice. System preference is followed until an explicit override.     |

The Raft model assumes one fixed leader, one current-term entry, and three healthy nodes. Append is not commit. Step two exposes a replicated majority; step three advances the leader commit index and illustrates propagation and the remaining follower catching up. Elections, previous-term entries, persistence, retry, partitions, and real replication are outside this pedagogical model. It is not a protocol implementation or a benchmark.

The quality flow is explicitly conceptual, not a claim that QualitySphere has implemented scheduling. The editor and vocabulary demos use local illustrative data, never a real product session.

## Security and lifecycle

`src/data/company.ts` owns corporate identity and source/confirmation metadata. Optional facts are absent until publication-approved; no generic placeholder is rendered. `CompanyDetails.astro` projects the same values into About, Contact and the global footer, while `organizationData()` projects them into JSON-LD. The Chinese legal name remains canonical; a reference translation is a separate, explicitly labeled field. This small immutable data model and shared rendering component need no service, database, inheritance hierarchy or global client store. JSON-LD serialization escapes `<` to prevent script termination by content.

Corporate routes reuse existing project data and locale dictionaries. Contact is an external `mailto:` action, with no submission state or backend. The source provenance remains in build-time code; only intended public values are rendered. Development checklists are not Astro routes and contain no private registration documents.

Components create no timers, workers, sockets, queues, or background network requests. Browser event handlers belong to the document lifetime; the site uses normal document navigation, not a persistent SPA router. SVG text and project content are build-time trusted constants. User input is rendered as text through React, never as HTML.

Cloudflare `_headers` supplies MIME, framing, referrer, capability, and CSP restrictions. CSP currently allows inline scripts and styles because Astro hydration and the initial theme script use them; it does not allow `unsafe-eval`, external scripts, frames, or objects. A future hash-based CSP must account for every generated route and Astro hydration script, rather than breaking interactive content silently.

## Final review

No state is shared across project demonstrations. Public claims are separated from pending project introductions. The registry does not leak private repository contents. Hosting, DNS, publication, and source push remain distinct operations. Automated checks cover the teaching invariant, locale routing, rendered pages, accessibility, navigation, and actual browser interactions; these tests do not validate the underlying products themselves.
