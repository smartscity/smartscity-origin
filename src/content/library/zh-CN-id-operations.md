---
contentId: 'id-operations'
language: 'zh-CN'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'operations'
topic: 'product-practice'
title: 'ID 接入的运行维护与故障处理'
summary: '使用就绪状态、类型化错误和 worker 生命周期边界排障。'
version: '0.1.0-SNAPSHOT · 源码快照'
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

## 观察就绪与所有权

使用 `snapshot().isReady()`；使用 Actuator 时，可将 `smartscityId` 加入 readiness health group。Spring 拥有 starter 创建的生成器并在关闭时释放，不要按请求关闭。并发调用完成顺序不是 ID 顺序；解析需要原始格式。

## 保留生命周期容量

每次已提交的启动注册永久消耗一个 worker，包括激活失败。标准 18 位 worker 在一个 group 内允许 262,144 次生命周期注册，这是格式边界，不是吞吐测量。重启不会重置容量。备份与切换时保留历史预留、约束和分配游标。ACTIVE 或 STOPPED 记录不构成复用许可。

## 按类型化错误排查

| 错误码               | 排查方向                                         |
| -------------------- | ------------------------------------------------ |
| ID-001 CONFIGURATION | 类型、完整位宽、数据库 URL/DataSource 选择       |
| ID-002 STARTUP       | 驱动、schema、凭证、数据库可达性、group 格式     |
| ID-003 CLOCK         | 时间同步；终止性失败后安全重新初始化             |
| ID-004 CAPACITY      | epoch 范围与 worker 生命周期耗尽，禁止重置或绕回 |
| ID-005 TIMEOUT       | 生产者调度、缓存占用、消费者竞争                 |
| ID-006 INTERRUPTED   | 尊重调用方取消                                   |
| ID-007 COORDINATION  | 适用时检查 ZooKeeper 会话和所有权                |
| ID-008 CLOSED        | 停止使用已关闭生成器                             |

依据 `IdException.getReason()` 或 `getCode()` 分支，不解析显示文本。保留诊断时避免将驱动异常中的秘密写入日志。不要盲目重试结果未知的注册提交。完整错误与参数参考见源使用指南。

## 规划格式与存储变更

将 epoch 和布局纳入持久数据契约。可选 Roaring 编码是独立的版本化存储表示，须保存其版本并明确迁移。它不替代 worker 分配，不自动迁移应用快照，也不保证所有负载都节省内存。修改运行中的应用前，核对源迁移与兼容文档。
