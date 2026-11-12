---
contentId: 'id-start'
language: 'zh-CN'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'getting-started'
topic: 'product-practice'
title: '运行数据库支持的 ID 示例'
summary: '构建公开快照、初始化隔离注册表并生成和解析 ID。'
version: '0.1.0-SNAPSHOT · 源码快照'
order: 11
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
related: ['id-operations']
---

## 准备源码与运行环境

准备 JDK 21、Git、Maven wrapper 和你拥有的 MySQL 服务。使用新的隔离数据库完成本例；已有注册表需要遵循源迁移流程。下列命令依据公开可执行示例，本次门户交付没有运行该产品示例。

```sh
git clone https://github.com/smartscity/smartscity-starter.git
cd smartscity-starter
git checkout 6e60f068d7f5c12e51ad77512384323e517dcb5d
./mvnw install
```

## 初始化注册表

按你的数据库管理流程创建空数据库 `id_registry`。在仓库根目录使用管理员账号应用 schema，按需替换账号：

```sh
mysql -h 127.0.0.1 -u registry_admin -p id_registry \
  < starter/smartscity-starter-id/boot2-3/src/main/resources/db/mysql.sql
```

创建具备这些表 SELECT、INSERT、UPDATE 权限的运行账号。starter 不自动建表或迁移。确保数据库与主机时间满足配置容差。在终端设置以下变量，按需修改 URL 与用户。执行到 `read` 时输入密码并按回车，输入不会回显。不要提交凭证。

```sh
export ID_DATABASE_URL='jdbc:mysql://127.0.0.1:3306/id_registry'
export ID_DATABASE_USER='id_runtime'
read -s ID_DATABASE_PASSWORD
export ID_DATABASE_PASSWORD
```

## 完成一次任务

Boot 2.7 示例已包含完整 `application.yml`：group 为 `orders`、standard profile、epoch 为 `2026-01-01T00:00:00Z`、位宽 30/18/15。本例不需要补充 YAML。

```sh
./mvnw -f samples/id/id-example/pom.xml package
java -jar samples/id/id-example/target/smartscity-id-example-0.1.0-SNAPSHOT.jar
```

应用获取 `IdGenerator`，生成一个 ID、解析 worker 并读取就绪状态。输出行形式为 `ID=<正整数> worker=<worker 数字> ready=true`，具体数值取决于注册表与时间。这是从源码确认的预期输出形式，不是实际测试日志。随后应用关闭 Spring context 与生成器。

## 核对结果

确认启动成功，输出含正数 ID、解析后的 worker 与就绪状态。启动或生成失败应按失败处理，不能替换为固定 worker 绕过问题。本例不证明所有故障下的分布式唯一性，也不证明生产容量。每次已提交的启动注册永久消耗一个 worker，不要用循环重启充当吞吐测试。

Boot 4 使用 `samples/id/id-example-boot4/pom.xml` 及其 `smartscity-id-example-boot4-0.1.0-SNAPSHOT.jar`。已有 Boot 应用按源使用指南完成依赖、配置与 API 接入。超出隔离示例前，继续阅读运行维护。
