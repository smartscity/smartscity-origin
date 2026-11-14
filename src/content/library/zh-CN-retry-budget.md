---
contentId: 'retry-budget'
language: 'zh-CN'
status: 'published'
cover: /images/blog/retry-budget.svg
coverAlt: '请求分支与重试回路，示意重试次数的组合放大。'
kind: blog
product: 'agent-reliability'
section: 'guides'
topic: 'architecture-reliability'
title: '重试应该按整条链路预算'
summary: '跨调用链核对重试放大、在途工作与业务效果。'
version: '2026-11'
order: 100
updated: '2026-11-12'
author: 'Smartscity'
sourceRevision: 'C2 editorial source · 2026-11-12'
sources:
  [
    {
      'title': 'AWS Builders’ Library — Timeouts, retries, and backoff with jitter',
      'url': 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    },
  ]
related:
  [
    'governable-agent-expertise',
    'assessment-start',
    'assessment-evidence',
    'ai-agent-cross-system-investigation',
    'ai-agent-reliability-assessment',
  ]
---

重试设计需要回答两个不同问题：一次调用是否值得再次尝试，以及系统是否承受得起所有调用同时重试。评估只看单个客户端的重试次数，很难回答第二个问题。

## 从局部配置走到端到端约束

设一条嵌套调用链有三个会重试的边界，每层最多尝试三次。如果每个外层尝试都会重新触发完整内层过程，且失败满足各层的重试条件，最深处一次业务请求最多可能触发 `3 × 3 × 3 = 27` 次尝试。这是说明性上界模型，不是实际系统流量预测。熔断、截止时间、错误分类和取消传播都可能使实际执行提前终止。

因此需要同时查看网关、调用方、客户端库和下游服务的策略。一个团队配置的“三次以内”可能满足局部要求，整条链路仍然超出下游承受能力。超时也不证明远端没有完成业务效果；这一点在 [AWS 关于超时与重试的讨论](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)中有明确说明。

## 建立一张可核对的预算表

先选一条关键业务操作，记录每个边界的最大尝试次数、单次超时、退避、总截止时间、可重试错误、取消传播和幂等依据。再回答三件事：

1. 上游已经放弃时，下游是否还在执行或继续重试？
2. 调用结果未知时，重复请求由谁识别，去重信息能保存多久？
3. 当下游开始拥塞，重试是否会继续增加在途工作，还是受到总预算约束？

预算评估应绑定同一版本和调用路径。把不同环境的配置拼在一起，会得到一条现实中不存在的调用链。代理层和 SDK 的默认行为也必须纳入清单。

## 如何验证风险真正存在

在受控环境中分别引入延迟、部分失败和“已执行但响应丢失”。为同一业务操作关联入口请求、各层尝试和最终业务状态，记录实际次数、结束时间、在途工作及重复效果。单看错误日志数量不足以还原调用放大。

结果应区分配置推导的风险和实验观察到的事实。实验没有触发最坏路径，不代表所有组合都安全；出现额外尝试也不自动说明发生重复业务效果，仍需核对业务状态。

## 方案选择与验收

可选择在明确的边界统一重试，向下传递剩余时间，区分临时错误与业务拒绝，并在资源紧张时限制额外尝试。方案要兼顾可用性：一律关闭重试可能损失对短暂故障的恢复能力。

验收至少包含正常流量不退化、约定失败下尝试次数受控、超时后的在途工作有边界、业务效果符合约束。把预算与验证条件保存下来，下一次修改重试策略时才能比较变化。

## Agent 可以怎样参与

Agent 可以整理各边界配置、发现预算冲突、生成验证任务并关联执行证据。专家确认调用语义、验证条件与业务影响。需要评估跨团队组合风险时，Smartscity 首次体检可围绕这一工作链组织专业评估；具体检查范围在任务开始时确认。
