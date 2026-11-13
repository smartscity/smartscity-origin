---
contentId: 'ai-agent-cross-system-investigation'
language: 'en'
status: 'published'
kind: 'blog'
cover: '/images/blog/ai-agent-cross-system-investigation.svg'
coverInArticle: false
coverAlt: 'Three connected evidence layers: configuration, execution and business effects.'
product: 'agent-reliability'
section: 'guides'
topic: 'ai-engineering'
title: 'How AI agents investigate cross-system retry risks: from anomalies to engineering evidence'
summary: 'Follow an illustrative retry investigation through evidence correlation, tool queries, hypothesis testing and reporting, with explicit responsibilities for experts.'
version: '2026-11'
order: 99
updated: '2026-11-13'
author: 'Smartscity'
sourceRevision: 'C2 agent articles · 2026-11-13 · 50173d7e06a1'
sources:
  [
    {
      'title': 'AWS Builders’ Library — Timeouts, retries, and backoff with jitter',
      'url': 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    },
    {
      'title': 'Prometheus — HTTP API',
      'url': 'https://prometheus.io/docs/prometheus/latest/querying/api/',
    },
    {
      'title': 'OpenTelemetry — Traces',
      'url': 'https://opentelemetry.io/docs/concepts/signals/traces/',
    },
  ]
related:
  [
    'ai-agent-reliability-assessment',
    'retry-budget',
    'rollback-state',
    'assessment-start',
    'assessment-evidence',
  ]
---

“Downstream requests suddenly increased, but incoming traffic barely changed.” Faced with this signal, teams may investigate traffic, releases, retries, queues and resources separately. The value of an AI agent depends on whether it can organize these investigations into testable questions and revise its judgment as new evidence arrives.

The following illustrative task explains Smartscity's assessment method. It is not a customer case study, and it does not imply that all described checks and tool connections are already available. The objective is to determine whether layered retries caused the extra requests and whether business outcomes were affected.

## Establish the phenomenon to explain

The customer first provides the definition of a business operation, the environments and versions involved, the anomaly's time window, call relationships, and accessible configuration, metrics, traces and business records. Original data can be queried through agreed read-only interfaces, or supplied as exports with clear provenance.

The agent first checks whether these materials can be compared: do entry-point and downstream metrics cover the same time window? Does a request count represent business operations, call attempts or message deliveries? Does the configuration correspond to the version running during the anomaly, or to a later fix?

Comparisons become meaningful only after these definitions align. An entry rate of 100 business operations per second and a downstream rate of 300 calls per second do not, on their own, establish threefold retry amplification: one operation might normally make three downstream calls.

## One anomaly requires three layers of evidence

<figure class="reading-figure">
  <a href="/images/blog/agent-articles/agent-investigation-evidence-en.svg">
    <img src="/images/blog/agent-articles/agent-investigation-evidence-en.svg" width="1200" height="800" alt="Configuration evidence supports a risk hypothesis, execution evidence supports observed behavior, and business evidence supports business impact. Fan-out, backlog and metric definitions remain alternative explanations." loading="lazy" decoding="async" />
  </a>
  <figcaption>Illustrative investigation model · The diagram maps judgments to evidence; it does not represent actual detection results.<br /><a href="/images/blog/agent-articles/agent-investigation-evidence-en.svg">View the full-size diagram ↗</a></figcaption>
</figure>

The agent keeps several explanations in play: retries, changes in normal fan-out, backlog release and changes in metric definitions. A suspicious retry policy calls for further checks of actual execution. An observed increase in calls still needs to be assessed against the agreed budget. Establishing duplicate business effects requires authoritative business records.

If the additional calls belong to different business operations, the retry explanation needs revision. If historical tasks were released in a burst, the investigation should continue into queue and scheduling records. Multiple mechanisms may also contribute at the same time.

## Every tool call should answer a specific question

Each query should be tied to an investigation question and record its target, version, time range and result. Depending on the integrations actually available, an agent can use the tools below. A tool's publicly documented capabilities do not establish that Smartscity has integrated it.

| Investigation question                    | Tools and materials                                     | Evidence to retain                                                                                      |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Which layer changed retry behavior?       | Code search, version diffs and configuration snapshots  | Relevant commits, effective configuration, call boundaries and the meaning of attempt counts            |
| When did extra calls appear?              | Prometheus range queries and monitoring dashboards      | Query expressions, labels, time ranges, raw series and screenshots                                      |
| Which calls belong to the same operation? | Trace-backend queries and call logs                     | The basis for operation correlation, spans or request records, and the sequence of failures and retries |
| Did duplicate business effects occur?     | Authoritative business records and verification queries | Operation identifiers, state changes, deduplication criteria and verification results                   |

The [Prometheus HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/) provides range queries for retrieving metrics over a specified window. [OpenTelemetry's trace and span model](https://opentelemetry.io/docs/concepts/signals/traces/) provides a basis for correlation across calls. An investigation still needs to check sampling, correlation fields and context propagation; a missing span does not prove that an execution never occurred.

For evidence accessed through Grafana, Kibana or similar tools, the report preserves links pinned to a fixed time range, query conditions, screenshots and raw exports. Screenshots show what was observed at that point; original records support further review. A dynamic dashboard URL alone is not a stable basis for a conclusion.

## Use experiments to distinguish possibility from observation

After static analysis identifies nested retries, it can propose a conditional model: if three boundaries each permit at most three attempts, every outer attempt restarts the complete inner sequence, and failures meet the retry conditions at every layer, the deepest boundary can receive up to 27 attempts. Overall deadlines, circuit breakers and cancellation propagation may reduce the actual count.

This model describes a testable risk. Verification should use an authorized, controlled environment with normal operation, downstream delay and response-loss conditions, keeping business load and versions comparable. Execution tools send requests carrying business operation identifiers; fault-injection tools apply the agreed conditions; observation tools record attempts at every layer, completion times and resource changes; business verification checks the final effects.

An agent can orchestrate an approved task, check evidence completeness and organize differences. Experts must confirm the injection point, business semantics, stop conditions and whether the experiment represents the path under assessment. If only existing records are available, the report should reach conclusions within that evidence boundary rather than invent experimental results.

## Turn a finding into a reviewable report

When evidence is sufficient, the report needs a statement that can be independently checked. For example, establishing that actual attempts on a path exceeded the agreed budget requires the budget's basis, the running version, fault conditions and original attempt records. Establishing duplicate business effects separately requires authoritative business state.

Overall results appear on the common report overview; the mechanism and evidence for each finding belong in the detailed report.

<figure class="reading-figure">
  <a href="/images/blog/agent-articles/report-overview-en.html">
    <img src="/images/blog/agent-articles/report-summary-en.png" srcset="/images/blog/agent-articles/report-summary-en-720.webp 720w, /images/blog/agent-articles/report-summary-en-1440.webp 1440w" sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 65vw, 740px" width="1716" height="581" alt="Executive opinion and coverage from an English reliability report. Fictional sample data, not results from this retry investigation." loading="lazy" decoding="async" />
  </a>
  <figcaption>Illustrative sample · An excerpt from the common assessment report overview shows the delivery format. Its statistics are fictional and are not the results of the retry task described above.<br /><a href="/images/blog/agent-articles/report-overview-en.html">Read the report in English (HTML) ↗</a> · <a href="/images/blog/agent-articles/report-summary-en.png">View the full-resolution image</a></figcaption>
</figure>

A detailed finding should state the violated constraint, applicable version and fault conditions, evidence supporting the mechanism, causes already ruled out and those still unresolved, business impact, and acceptance criteria after remediation. Observations and remaining hypotheses should be expressed separately.

Remediation priority depends on business importance, triggering conditions and impact together, not merely on the number of suspicious settings. For the mechanisms by which retries increase load and business effects may already have occurred after a timeout, see the [AWS Builders' Library](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/).

## Apply the method to broader reliability analysis

The same investigation structure applies to shared disaster-recovery dependencies, gaps in canary coverage and state incompatibility after rollback: define constraints, correlate materials, propose multiple explanations, use tools to collect evidence that distinguishes them, and then form remediation and acceptance judgments. Each class of problem requires its own checks and verification methods.

This is the engineering work AI Agent Reliability is intended to support: turning the important questions raised by experts into analysis tasks that can be executed, traced and reviewed. Its value should be visible in assessment coverage and useful conclusions, and demonstrated through actual delivery.

If you are investigating cross-system call amplification, or want to review retry and timeout boundaries before your next release, [contact Smartscity](/en/contact/) with the business path, observed symptoms and types of evidence already available. The assessment will identify missing materials, feasible verification activities and the final report scope.

Further reading: [How AI agents assess system reliability](/en/blog/ai-agent-reliability-assessment/) · [Budget retries across the entire call chain](/en/blog/retry-budget/) · [What to verify after a rollback completes](/en/blog/rollback-state/).
