# Switching to liquibase DB control

The `docker-liquibase.sh` script lets you run liquibase commands from a container without needing a local liquibase installation.

## If the database is already in use

- Ensure through manual inspection that the changeset (in liquibase-changeset.sql) is at the same state as the database. This may involve deleting some recent changesets from the file temporarily.
- Execute `liquibase changelogSync` on the database. This tells liquibase that all changelogs have been executed on the database.
- Restore the deleted changesets to the changelog

## Updating the database

- Execute `docker-liquibase.sh update` to apply any further changes
