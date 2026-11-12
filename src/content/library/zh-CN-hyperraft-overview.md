---
contentId: 'hyperraft-overview'
language: 'zh-CN'
status: 'published'
kind: 'docs'
product: 'hyperraft'
section: 'overview'
topic: 'product-practice'
title: 'HyperRaft：公开版本与评估路径'
summary: '核对公开构件元数据，明确接入与评估前提。'
version: '0.1.0 · 构件元数据'
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

## 公开范围

HyperRaft 聚焦共识与复制基础设施。Maven Central 可查看 `com.smartscity:hyperraft-client:0.1.0` 元数据，父 POM 声明 Java 21 编译目标。构件元数据不等同于可运行集群指南、生产拓扑支持或吞吐与延迟证明。

## 核对已发布元数据

打开下方来源，或直接读取 POM：

```sh
curl --fail --location 'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-client/0.1.0/hyperraft-client-0.1.0.pom'
```

核对 group、artifact 与版本是否对应计划评估的接入。这一步仅读取构件信息，不启动 Raft 节点，也不验证部署。

## 准备接入讨论

说明需要复制的业务状态、操作顺序和持久性要求、目标故障条件、运行环境与预期版本。在计划客户端接入或集群演练前，先确认适用的安装指南与访问条件。公共门户不转载私有源码或报告。

## 理解教学模型

现有项目页演示固定 leader、三个健康节点和一条日志，区分追加、多数复制与提交。它不执行真实集群、选举、持久化或恢复测试。本页仍不展示性能数字；正式报告可用后，应结合其负载与环境阅读。
