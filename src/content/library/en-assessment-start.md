---
contentId: 'assessment-start'
language: 'en'
status: 'published'
kind: 'docs'
product: 'agent-reliability'
section: 'getting-started'
topic: 'ai-engineering'
title: 'Prepare and request an initial assessment'
summary: 'Agree the question, inputs, access boundaries, and verification scope.'
version: 'Service guide · 2026-11'
order: 2
updated: '2026-11-12'
author: 'Smartscity'
sourceRevision: 'C2 editorial source · 2026-11-12'
sources: []
related: ['assessment-evidence']
---

## Define one business question

Describe the business operation, systems involved, recent or planned changes, and the decision you need to make. Name the person who can clarify business semantics and the people responsible for affected systems. Define the environment and version window so evidence from incompatible snapshots is not mixed.

## Prepare a material inventory

| Input                            | Useful detail                                                         |
| -------------------------------- | --------------------------------------------------------------------- |
| Business constraints             | Expected final state, unacceptable duplicates or omissions            |
| Architecture                     | Call path, dependencies, ownership, failure domains                   |
| Configuration and change records | Versions, retry/timeout settings, migrations, rollout plan            |
| Operating evidence               | Redacted traces, incident timeline, relevant metrics and logs         |
| Verification conditions          | Available isolated environment, permitted faults, stopping conditions |

Start with an inventory, not unrestricted access. Do not put credentials, personal data, or confidential logs in an initial email. Agree a suitable exchange method and access scope before sharing sensitive material.

## Send a scoped request

Use the email action below. It opens your email application with this guide's title and URL; you can edit the message before sending. The website does not submit a form or store the request. Include a short description, preferred contact details, and any scheduling constraints. For example:

```text
Business question: Can the previous version process orders after rollback?
Scope: Order service and its message consumers; staging environment.
Available materials: Release diff, migration plan, redacted traces.
Verification boundaries: To be agreed with the system owners.
Contact and preferred timing: [Your details]
```

## Confirm the engagement before verification

Agree covered systems, versions, customer and expert responsibilities, access rights, permitted actions, and acceptance criteria. Fault injection or production access requires a specifically agreed scope; sending an inquiry grants neither. Missing inputs become explicit evidence requests. The next guide explains how to review the resulting findings.
