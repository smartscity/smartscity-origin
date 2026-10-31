# Architecture

## Rendering and ownership

Astro generates the English and Simplified Chinese route trees at build time. The default root redirects to `/en/`. `SiteLayout.astro` owns document metadata, locale navigation, theme preference, the responsive menu, and observer setup. Primary content is server-rendered and remains readable without JavaScript. There is no database, backend, CMS, analytics, or visitor-facing API request.

`projects.ts` is the source of truth for canonical project identity and reviewed metadata. Shared language strings live in structurally matched JSON dictionaries. Each product has its own bilingual positioning and capability copy; no text is derived from a live visitor request. New projects are generated from the registry.

CSS owns presentation and ambient SVG animation. Motion is used only for vocabulary transitions. React hydrates demonstrations when visible. The homepage additionally lazy-loads the WebGL city described below, with GSAP camera transitions and no animation-driven React state loop. The continuous hero animation pauses offscreen and when the document is hidden. Reduced-motion preferences disable ambient CSS animation and Motion transitions.

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

`src/data/company.ts` owns corporate identity and source/confirmation metadata. Optional facts are absent until publication-approved; no generic placeholder is rendered. `CompanyDetails.astro` projects the same values into About, Contact and the global footer, while `organizationData()` projects them into JSON-LD. The Chinese legal name remains canonical in the identity model and JSON-LD. English pages display the reference English translation, with its translation status explained in the full company details. Chinese pages display the Chinese legal name. This small immutable data model and shared rendering component need no service, database, inheritance hierarchy or global client store. JSON-LD serialization escapes `<` to prevent script termination by content.

Corporate routes reuse existing project data and locale dictionaries. Contact is an external `mailto:` action, with no submission state or backend. The source provenance remains in build-time code; only intended public values are rendered. Development checklists are not Astro routes and contain no private registration documents.

Components create no sockets, queues, or background network requests. The city owns a visibility-scoped render loop and bounded GSAP transitions. Browser event handlers belong to the document lifetime; the site uses normal document navigation, not a persistent SPA router. SVG text and project content are build-time trusted constants. User input is rendered as text through React, never as HTML.

Cloudflare `_headers` supplies MIME, framing, referrer, capability, and CSP restrictions. CSP currently allows inline scripts and styles because Astro hydration and the initial theme script use them; it does not allow `unsafe-eval`, external scripts, frames, or objects. A future hash-based CSP must account for every generated route and Astro hydration script, rather than breaking interactive content silently.

## Final review

No state is shared across project demonstrations. Public claims are separated from pending project introductions. The registry does not leak private repository contents. Hosting, DNS, publication, and source push remain distinct operations. Automated checks cover the teaching invariant, locale routing, rendered pages, accessibility, navigation, and actual browser interactions; these tests do not validate the underlying products themselves.

## Neutral visual system and documented specifications

The presentation uses white/neutral gray or neutral black surfaces with a blue accent and system typography. The homepage hero is now the original procedural 3D city described below; the older software-tile SVG remains available as an unused component. It does not use Apple logos, product images, fonts or copied assets. The existing observer owns visibility: continuous graphic motion pauses offscreen and when the document is hidden; reveal movement runs once on entry. Reduced-motion preferences disable both ambient and scroll-linked effects. Core text never fades below accessible contrast.

| Problem                                              | Pattern decision                                                          | Reason                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Consistent factual numbers on cards and detail pages | Reuse the typed project registry and a shared `ProjectMetrics` projection | Each number includes bilingual meaning and a public source URL; views cannot invent values.            |
| Motion visibility and lifecycle                      | Reuse the document-owned IntersectionObserver and CSS timelines           | SVG motion retains its document observer; the city owns its separate render lifecycle described below. |
| Benchmark disclosure                                 | Separate public specifications from unpublished experiment results        | Package availability and feature counts do not establish throughput, latency or capacity.              |

Private HyperRaft experiment results are not included in the generated site or repository. They require explicit authorization and a report that states workload, source revision, machine, topology, measurement window and limitations. Existing product demos keep their original state owners and semantics.

## Digital city — 2026-10-31

The homepage now uses an isolated `CityExperience` React island. Its server-rendered title, poster and project links remain usable without JavaScript. `CityScene` is dynamically imported after hydration, so Three.js and GSAP are not dependencies of product or corporate routes. WebGL 2 failure or a lost context leaves the poster and HTML navigation available. There are no remote models, fonts, textures or runtime product APIs.

| Problem                             | Pattern decision                           | Owner and invariant                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview, focus, tour and expansion | Explicit reducer                           | `city/model.ts` resets expansion when changing buildings; a tour ends at overview.                                                                                        |
| Camera and animation                | Single rendering adapter                   | `CameraRig` exclusively controls camera position, target and zoom; GSAP timelines are killed on replacement/unmount. No React state updates per frame.                    |
| Model resources                     | Component composition                      | Procedural architecture merges box geometry by material, disposes generated geometry/textures on unmount, and uses instanced signal particles.                            |
| Visibility and motion               | Scoped browser adapter                     | The island owns media, visibility and intersection listeners; reduced motion skips camera/roof transitions, user pause stops ambient movement, offscreen rendering stops. |
| Product content                     | Existing registry plus bilingual narrative | Existing specifications and links remain in the project registry. City copy is a metaphor, not evidence of deployment or product dependencies.                            |
| Editing sample                      | Independent local component                | The library sample owns its draft and three layout modes. It is plain text, never injected HTML, and is not saved or transmitted.                                         |

The first implemented city includes five selectable buildings, a manually advanced guided tour, camera transitions, a library roof cutaway with three editor layouts, and an illustrative Memory context assembly. Existing Raft and other product demos keep their original scope. There is no free-flight camera, automatic scroll tour, new election simulator or live telemetry. The Memory district is an owner-supplied concept and links to Contact, without inventing a repository or verified integration count.

The renderer uses WebGLRenderer and React Three Fiber 9 for React 19. The DPR cap is 1.5, with a decrease to 1 after sustained slow frames while moving. Continuous particles invalidate demand frames only when visible and motion is enabled. Shadow maps update once for the static scene and are refreshed for library expansion. Physical-device performance targets are not acceptance results; browser emulation does not establish real phone frame rate. Public performance figures remain deferred.
