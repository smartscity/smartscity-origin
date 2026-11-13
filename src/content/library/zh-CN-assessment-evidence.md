---
contentId: 'assessment-evidence'
language: 'zh-CN'
status: 'published'
kind: 'docs'
product: 'agent-reliability'
section: 'guides'
topic: 'ai-engineering'
title: '阅读发现与使用评估基线'
summary: '区分观察事实、解释、覆盖缺口与后续行动。'
version: 'Service guide · 2026-11'
order: 3
updated: '2026-11-12'
author: 'Smartscity'
sourceRevision: 'C2 editorial source · 2026-11-12'
sources: []
related:
  [
    'rollback-state',
    'failover-dependencies',
    'ai-agent-cross-system-investigation',
  ]
---

## 从证据读到业务影响

有效发现应说明受影响操作、版本与环境、证据、原因解释、业务影响及建议行动。检查证据能否支持结论，还是仅提示一个假设。由配置推导的风险与实际观察到的故障是不同证据。

## 理解覆盖范围

确认检查了哪些路径和失败条件，哪些没有检查及原因。成功测试只支持其实际条件。未经演练的恢复时间目标不是测量值；没有观察到失败不代表所有组合都安全。

## 将建议变为行动

结合业务影响、证据强度和整改依赖安排优先级。为行动指定负责人、验证条件和预期完成状态。保留反对证据与开放问题。专家复核关键结论，客户通过自己的变更流程决定实际操作。

## 提出澄清

引用发现编号，说明对哪一份证据或哪一种解释有疑问。如果配置或版本不同，请提供修订信息，确认原结论是否仍然适用。敏感证据仅通过约定渠道分享。

## 保存可复查基线

将限定范围的系统与版本清单、验证任务、条件、结果和证据引用随报告保存。它们可以支持后续对比，不自动证明新版本安全。复验或持续服务需要另行约定范围。
