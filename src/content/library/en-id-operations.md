---
contentId: 'id-operations'
language: 'en'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'operations'
topic: 'product-practice'
title: 'Operate and troubleshoot the ID integration'
summary: 'Use readiness, typed failures, and lifetime worker limits without weakening allocation.'
version: '0.1.0-SNAPSHOT · Source snapshot'
order: 12
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

## Observe readiness and ownership

Use `snapshot().isReady()` or include `smartscityId` in the Actuator readiness group when using Actuator. Spring owns the starter-created generator and closes it during shutdown; do not close it per request. Concurrent completion order is not ID order. Decode with the original format.

## Preserve lifetime capacity

Every committed startup registration permanently consumes a worker, including failed activation. Standard 18-bit worker allocation allows 262,144 lifetime registrations in a group; that is a format limit, not a throughput measurement. Restarts do not reset it. Preserve historical reservations, constraints, and allocation cursors across backup and failover. ACTIVE or STOPPED records do not authorize reuse.

## Diagnose typed failures

| Code                 | Investigation                                                        |
| -------------------- | -------------------------------------------------------------------- |
| ID-001 CONFIGURATION | Types, complete bit widths, database URL/DataSource selection        |
| ID-002 STARTUP       | Driver, schema, credentials, database reachability, group format     |
| ID-003 CLOCK         | Time synchronization; safe reinitialization after a terminal failure |
| ID-004 CAPACITY      | Epoch range and lifetime worker exhaustion; never reset or wrap      |
| ID-005 TIMEOUT       | Producer scheduling, cache occupancy, consumer contention            |
| ID-006 INTERRUPTED   | Respect caller cancellation                                          |
| ID-007 COORDINATION  | ZooKeeper session and ownership when applicable                      |
| ID-008 CLOSED        | Stop using the closed generator                                      |

Branch on `IdException.getReason()` or `getCode()`, not human-readable text. Retain useful diagnostics without logging secrets from driver exceptions. Do not blindly retry an unknown registration commit. Consult the source guide for the full error and configuration reference.

## Plan format and storage changes

Persist the epoch and layout with your data contract. The optional Roaring encoding is a separate, versioned storage representation; preserve its version and migrate explicitly. It does not replace worker allocation, automatically migrate application snapshots, or guarantee memory improvement for every workload. Refer to the source migration and compatibility documents before changing a running application.
