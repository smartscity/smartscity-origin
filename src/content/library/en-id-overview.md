---
contentId: 'id-overview'
language: 'en'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'overview'
topic: 'product-practice'
title: 'Choose an ID integration'
summary: 'Choose between the standalone SDK and the two Spring Boot integrations.'
version: '0.1.0-SNAPSHOT · Source snapshot'
order: 10
updated: '2026-11-12'
author: 'Smartscity'
sourceRevision: '6e60f068d7f5c12e51ad77512384323e517dcb5d'
sources:
  [
    {
      'title': 'Smartscity Starter — ID user guide',
      'url': 'https://github.com/smartscity/smartscity-starter/blob/6e60f068d7f5c12e51ad77512384323e517dcb5d/docs/id/USER_GUIDE.md',
    },
    {
      'title': 'Smartscity Starter — Executable examples',
      'url': 'https://github.com/smartscity/smartscity-starter/blob/6e60f068d7f5c12e51ad77512384323e517dcb5d/samples/README.md',
    },
    {
      'title': 'Smartscity Starter — Compatibility',
      'url': 'https://github.com/smartscity/smartscity-starter/blob/6e60f068d7f5c12e51ad77512384323e517dcb5d/docs/id/compatibility.md',
    },
  ]
related: ['id-start']
---

## Availability

The public source revision linked below implements distributed IDs. It is an unreleased source snapshot: `0.1.0-SNAPSHOT` is not a claimed Maven Central release. Build the pinned source before using its local artifacts. This guide follows public commit `6e60f06`, not the repository's older default branch.

## Choose one integration

| Application           | Artifact                      | Prerequisites                               |
| --------------------- | ----------------------------- | ------------------------------------------- |
| Spring Boot 2.7 / 3.x | `smartscity-starter-id`       | Application-compatible Java; JDBC registry  |
| Spring Boot 4.x       | `smartscity-starter-id-boot4` | Application-compatible Java; JDBC registry  |
| Framework-independent | `smartscity-id`               | Caller-provided exclusive worker allocation |

Build the source with JDK 21 and the Maven wrapper. Do not combine the two starters. Keep the application's Boot dependency management; the Smartscity BOM manages Smartscity production artifacts only. Bytecode targets and tested runtime compatibility are different: consult the pinned compatibility guide for your exact environment.

## Keep the ID contract stable

Generation and decoding use the same epoch and bit layout. The numeric ID does not carry that format metadata. All instances sharing a format must honor worker ownership; a constant worker number is not a distributed allocation protocol. A different group name alone does not create a separate numeric namespace.

Start with the complete database-backed example in the next guide. For an existing application, the source user guide provides the full dependency and configuration blocks. For standalone use, read the worker-lease lifecycle contract before creating a generator.
