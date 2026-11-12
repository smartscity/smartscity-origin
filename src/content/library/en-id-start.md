---
contentId: 'id-start'
language: 'en'
status: 'published'
kind: 'docs'
product: 'starter-id'
section: 'getting-started'
topic: 'product-practice'
title: 'Run the database-backed ID example'
summary: 'Build the public snapshot, initialize an isolated registry, generate and decode an ID.'
version: '0.1.0-SNAPSHOT · Source snapshot'
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

## Prepare the source and runtime

Use JDK 21, Git, the Maven wrapper, and a MySQL server you control. Use a fresh isolated database for this walkthrough; existing registries require the source migration procedure. The commands below follow the public executable example. They have not been executed as part of this portal delivery.

```sh
git clone https://github.com/smartscity/smartscity-starter.git
cd smartscity-starter
git checkout 6e60f068d7f5c12e51ad77512384323e517dcb5d
./mvnw install
```

## Initialize the registry

Create an empty database named `id_registry` using your database administration process. From the repository root, apply the schema with an administrative account; substitute your own account name if necessary:

```sh
mysql -h 127.0.0.1 -u registry_admin -p id_registry \
  < starter/smartscity-starter-id/boot2-3/src/main/resources/db/mysql.sql
```

Provision a runtime account with SELECT, INSERT, and UPDATE permissions on these tables. The starter does not create or migrate them automatically. Ensure database and host time meet the configured tolerance. Set the following in your terminal, replacing the URL and user as needed. The shell prompts silently for the password on the `read` line; type it and press Enter. Do not commit credentials.

```sh
export ID_DATABASE_URL='jdbc:mysql://127.0.0.1:3306/id_registry'
export ID_DATABASE_USER='id_runtime'
read -s ID_DATABASE_PASSWORD
export ID_DATABASE_PASSWORD
```

## Run one complete task

The Boot 2.7 sample includes its complete `application.yml`: group `orders`, standard profile, epoch `2026-01-01T00:00:00Z`, and 30/18/15 bit widths. No additional YAML is required for this sample.

```sh
./mvnw -f samples/id/id-example/pom.xml package
java -jar samples/id/id-example/target/smartscity-id-example-0.1.0-SNAPSHOT.jar
```

The application obtains `IdGenerator`, generates one ID, decodes the worker, and reads readiness. Its output line has the shape `ID=<positive number> worker=<worker number> ready=true`; values depend on your registry and time. This is an expected output shape from source, not captured test output. The application then closes its Spring context and generator.

## Check the result

Confirm startup succeeds and the output includes a positive ID, decoded worker, and readiness. Treat startup or generation failures as failures, not as a reason to substitute a fixed worker. Running this example does not prove distributed uniqueness under every failure or production capacity. Each committed startup registration permanently consumes a worker; do not loop restarts as a throughput test.

For Boot 4, use `samples/id/id-example-boot4/pom.xml` and its `smartscity-id-example-boot4-0.1.0-SNAPSHOT.jar` instead. For existing Boot applications, follow the complete dependency/configuration/API sequence in the source user guide. Continue to operations before using the integration beyond an isolated example.
