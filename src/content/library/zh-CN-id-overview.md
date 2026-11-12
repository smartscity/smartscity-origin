---
contentId: 'id-overview'
language: 'zh-CN'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'overview'
topic: 'product-practice'
title: '选择 ID 接入方式'
summary: '选择独立 SDK 或两种 Spring Boot 接入方式。'
version: '0.1.0-SNAPSHOT · 源码快照'
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

## 可用状态

下方公开源码修订已经实现分布式 ID。它仍是未发布的源码快照，`0.1.0-SNAPSHOT` 不代表 Maven Central 正式发布。使用本机构件前先构建固定源码。本指南对应公开提交 `6e60f06`，不是仓库较旧的默认分支。

## 选择一种接入方式

| 应用                  | 构件                          | 前提                           |
| --------------------- | ----------------------------- | ------------------------------ |
| Spring Boot 2.7 / 3.x | `smartscity-starter-id`       | 与应用匹配的 Java；JDBC 注册表 |
| Spring Boot 4.x       | `smartscity-starter-id-boot4` | 与应用匹配的 Java；JDBC 注册表 |
| 不依赖框架            | `smartscity-id`               | 调用方提供独占 worker 分配机制 |

使用 JDK 21 与 Maven wrapper 构建源码。不要同时引入两种 starter。保留应用自己的 Boot 依赖管理，Smartscity BOM 仅管理 Smartscity 生产构件。字节码目标与已测试的运行时兼容性不同，请核对固定版本兼容指南。

## 保持 ID 契约稳定

生成与解析必须使用相同 epoch 和位布局，数值 ID 本身不携带这些格式信息。共享格式的实例必须遵守 worker 所有权；固定 worker 数字不是分布式分配协议。仅修改 group 名称不能形成独立数值空间。

下一篇提供完整的数据库示例链路。已有应用的完整依赖和配置块见源使用指南；独立 SDK 用户应先理解 worker lease 生命周期，再构造生成器。
