---
contentId: 'ai-agent-cross-system-investigation'
language: 'zh-CN'
status: 'published'
kind: 'blog'
cover: '/images/blog/ai-agent-cross-system-investigation.svg'
coverInArticle: false
coverAlt: '配置、执行与业务效果三层证据，分别支持不同判断。'
product: 'agent-reliability'
section: 'guides'
topic: 'ai-engineering'
title: 'AI Agent 如何调查跨系统重试风险：从异常线索到工程证据'
summary: '以跨系统重试风险为例，展开 Agent 的材料关联、工具查询、假设验证和报告交付，说明哪些判断需要专家介入。'
version: '2026-11'
order: 99
updated: '2026-11-13'
author: 'Smartscity'
sourceRevision: 'C2 agent articles · 2026-11-13 · 50173d7e06a1'
sources:
  [
    {
      'title': 'AWS Builders’ Library — 超时、重试与抖动退避',
      'url': 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    },
    {
      'title': 'Prometheus — HTTP API 文档',
      'url': 'https://prometheus.io/docs/prometheus/latest/querying/api/',
    },
    {
      'title': 'OpenTelemetry — 链路追踪',
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

“下游请求突然增加，但入口流量没有明显变化。”面对这样的线索，团队可能分别检查流量、发布、重试、队列和资源。AI Agent 能否带来价值，要看它能否把这些调查组织成一组可验证的问题，并随着新证据调整判断。

下面使用一个说明性任务展开 Smartscity 的评估方法。它不是客户案例，也不表示相关检测和工具连接均已上线。任务的目标是判断额外请求是否由多层重试产生，以及是否影响业务结果。

## 先确定要解释的现象

客户首先提供业务操作定义、涉及环境与版本、异常时间范围、调用关系，以及可访问的配置、指标、链路和业务记录。原始数据可以通过约定的只读接口查询，也可以使用有明确来源的导出材料。

Agent 先检查这些材料能否放在一起使用：入口和下游指标是否采用同一时间范围？请求数统计的是业务操作、调用尝试还是消息投递？配置对应的是发生异常时的版本，还是修复后的版本？

只有口径对齐，比较才有意义。入口每秒一百个业务操作、下游每秒三百次调用，并不能直接说明存在三倍重试；一次操作也可能正常调用下游三次。

## 一个异常线索，需要三层证据

<figure class="reading-figure">
  <a href="/images/blog/agent-articles/agent-investigation-evidence-en.svg">
    <img src="/images/blog/agent-articles/agent-investigation-evidence-en.svg" width="1200" height="800" alt="Agent 调查重试风险：配置证据支持风险假设，执行证据支持实际行为，业务证据支持业务影响；同时保留扇出、积压和指标口径等替代解释" loading="lazy" decoding="async" />
  </a>
  <figcaption>说明性调查模型，展示判断与证据的对应关系，不代表实际检测结果。<br /><a href="/images/blog/agent-articles/agent-investigation-evidence-en.svg">放大查看完整图示 ↗</a></figcaption>
</figure>

Agent 同时保留重试、正常扇出变化、积压释放和指标口径变化等解释。重试策略可疑，需要继续核对实际调用；调用确实增加，还要判断是否突破约定预算；是否产生重复业务效果，则需要权威业务记录。

如果额外调用属于不同业务操作，重试解释就需要修正；如果发现历史任务集中释放，调查就应继续检查队列与调度记录。不同机制也可能共同作用。

## 工具调用要回答具体问题

每次查询都应绑定一个调查问题，记录对象、版本、时间范围和结果。Agent 可根据实际接入情况调用下列工具；工具的公开能力不等于 Smartscity 已完成对应集成。

| 调查问题               | 工具与材料                        | 要保留的结果                                  |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| 哪一层改变了重试行为   | 代码检索、版本差异、配置快照      | 对应提交与生效配置、调用边界、尝试次数语义    |
| 额外调用何时出现       | Prometheus 时间范围查询及监控面板 | 查询表达式、标签、时间范围、原始序列和截图    |
| 同一操作经过了哪些调用 | 链路后端查询、调用日志            | 操作关联依据、Span 或请求记录、失败与重试时序 |
| 是否产生重复业务效果   | 权威业务记录与核验查询            | 操作标识、状态变化、去重依据及核验结果        |

[Prometheus HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/)提供时间范围查询接口，适合提取指定窗口的指标数据。[OpenTelemetry 的 Trace 与 Span 模型](https://opentelemetry.io/docs/concepts/signals/traces/)提供跨调用关联的基础。实际调查仍需检查采样、关联字段和上下文传播；缺失的 Span 不能直接证明某次执行没有发生。

对于 Grafana、Kibana 等证据入口，报告保存固定时间的链接、查询条件、截图和原始导出。截图说明当时观察到什么，原始记录支持进一步复核；只有一个动态看板地址无法稳定支撑结论。

## 用实验区分“可能发生”与“已经观察到”

静态分析发现嵌套重试后，可以提出一个条件模型：三个边界各最多尝试三次，若每次外层尝试重新触发完整内层过程，并且各层失败都满足重试条件，末端尝试上界为 27。总截止时间、熔断和取消传播都可能使实际次数更少。

这一模型只负责说明可检验的风险。验证应在获准的受控环境里设置正常、下游延迟、响应丢失等条件，并保持业务负载与版本可比。执行工具发送带有业务操作标识的请求，故障模拟工具施加指定条件，观察工具记录各层尝试、结束时间和资源变化，业务核验检查最终效果。

Agent 可以按审定任务编排执行、检查材料完整性和整理差异。专家需要确认注入位置、业务语义、停止条件以及实验是否代表待评估路径。若只能访问已有记录，报告就在该证据范围内形成判断，不补写实验结果。

## 一项发现应当怎样落到报告

证据充分时，报告需要给出可复核的表述。例如，确认某条路径的实际尝试超过双方约定预算，需要同时列出预算依据、运行版本、故障条件和原始尝试记录。是否发生重复业务效果，则另需权威业务状态支持。

总体结果进入统一报告首页，单项机制与证据进入详细报告。

<figure class="reading-figure">
  <a href="/images/blog/agent-articles/report-overview-en.html">
    <img src="/images/blog/agent-articles/report-summary-en.png" srcset="/images/blog/agent-articles/report-summary-en-720.webp 720w, /images/blog/agent-articles/report-summary-en-1440.webp 1440w" sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 65vw, 740px" width="1716" height="581" alt="英文报告评估意见与覆盖摘要；虚构样稿，非本次重试调查的结果" loading="lazy" decoding="async" />
  </a>
  <figcaption>虚构样稿 · 交付形式示意：沿用整体评估报告的英文首页节选。图中统计为虚构数据，不代表上述重试任务的结果。<br /><a href="/images/blog/agent-articles/report-overview-en.html">查看英文 HTML 报告 ↗</a> · <a href="/images/blog/agent-articles/report-summary-en.png">查看高清原图</a></figcaption>
</figure>

详细发现应写明：违反哪项约束、适用版本和故障条件、支持机制的证据、已经排除和仍未排除的原因、业务影响，以及整改后的验收条件。将实际观察和剩余假设分开表达。

整改优先级由业务重要性、触发条件和影响共同决定，不能仅由可疑配置数量决定。重试增加负载以及超时后可能已产生业务效果的机制，可参考 [AWS Builders’ Library](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)。

## 这项方法如何用于更广的稳定性分析

同一种调查结构也适用于灾备共享依赖、灰度覆盖缺口和回滚后的状态不兼容：明确约束，关联材料，提出多种解释，用工具收集能够区分解释的证据，再形成整改和验收判断。每类问题需要不同的检查规则和验证方法。

这正是 AI Agent Reliability 要承担的工程工作：把专家提出的关键问题变成能够执行、追溯和复核的分析任务。其价值应体现在评估覆盖和有效结论上，并由实际交付证明。

如果你正在排查跨系统调用放大，或希望在下一次发布前检查重试与超时边界，可以联系 [Smartscity](/zh-CN/contact/)，提供业务路径、现象和已有证据类型。评估将明确需要补齐的材料、能够开展的验证及最终报告范围。

延伸阅读：[AI Agent 如何做系统稳定性分析](/zh-CN/blog/ai-agent-reliability-assessment/) · [重试应该按整条链路预算](/zh-CN/blog/retry-budget/) · [回滚完成之后，还需要验证什么](/zh-CN/blog/rollback-state/)。
