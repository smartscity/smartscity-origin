---
contentId: 'hyperraft-overview'
language: 'en'
status: 'published'
kind: 'docs'
product: 'hyperraft'
section: 'overview'
topic: 'product-practice'
title: 'HyperRaft: public version and evaluation path'
summary: 'Inspect public package metadata and clarify integration prerequisites.'
version: '0.1.0 · Package metadata'
order: 20
updated: '2026-11-12'
author: 'Smartscity'
sourceRevision: 'Public POM metadata · portal evidence model'
sources:
  [
    {
      'title': 'HyperRaft client 0.1.0 POM',
      'url': 'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-client/0.1.0/hyperraft-client-0.1.0.pom',
    },
    {
      'title': 'HyperRaft parent 0.1.0 POM',
      'url': 'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-parent/0.1.0/hyperraft-parent-0.1.0.pom',
    },
  ]
related: ['retry-budget']
---

## Public scope

HyperRaft focuses on consensus and replication infrastructure. Public Maven Central metadata is available for `com.smartscity:hyperraft-client:0.1.0`; the parent POM declares a Java 21 compilation target. Package metadata does not establish a runnable cluster guide, supported production topology, throughput, or latency.

## Inspect the published metadata

Open the source links below, or retrieve the POM directly:

```sh
curl --fail --location 'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-client/0.1.0/hyperraft-client-0.1.0.pom'
```

Check the group, artifact, and version against the integration you intend to evaluate. This action reads package metadata; it does not start a Raft node or validate a deployment.

## Prepare an integration discussion

Describe the business state to replicate, operation ordering and durability requirements, expected failure conditions, runtime environment, and the version you intend to use. Request the applicable setup instructions and access conditions before planning a client integration or a cluster exercise. The public portal does not reproduce private source or reports.

## Understand the teaching model

The existing project page illustrates one entry, a fixed leader, and three healthy nodes. It separates append, majority replication, and commit. It does not execute a real cluster, election, persistence, or recovery test. Published performance figures remain unavailable here; consult an approved report with its workload and environment when one is provided.
