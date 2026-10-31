# Database backup

A timer dumps the island-mvp Postgres database. Nobody has to click Build. The dump file is not committed to git.

## Approach

The database runs in the Compose project `island-mvp`. The service is `db`. Its image is `postgis/postgis`. The database user and the database name are both `island`.

`ops/backup/dump-db.sh` runs `pg_dump` in that container through Docker Compose. The archive is custom format. The script writes it on the Jenkins volume at `/var/jenkins_home/island-mvp-backups`, which is outside every git checkout. On a machine without that volume it writes `/var/backups/island-mvp` instead. `ISLAND_BACKUP_DIR` overrides the directory. The script refuses a destination inside a git work tree. It keeps the newest fourteen dumps.

The script does not take a database password. `pg_dump` uses the database container's local socket.

Jenkins job `island-mvp-backup` is a freestyle job. Its trigger is `H * * * *`, so it runs once an hour without a click. The job shell is `ops/jenkins/island-mvp-backup.xml`. It runs `/repo/ops/backup/dump-db.sh` when that file is on the checkout, and otherwise the copy at `/var/jenkins_home/backup/dump-db.sh`.

`ops/jenkins/backup-init.groovy` runs when Jenkins starts. If the job was not already in memory, it loads `jobs/island-mvp-backup/config.xml` and arms the timer. If the job has never succeeded, it queues one build so the first dump does not wait for the hour. Later dumps are the timer. There is no GitHub Actions workflow for this.

## Tools

- Docker Compose, project `island-mvp`, service `db`, file `/repo/compose.yml`
- `pg_dump` in the PostGIS image (`--format=custom`, user `island`, database `island`)
- Jenkins freestyle job `island-mvp-backup` with `hudson.triggers.TimerTrigger`

## Confirm a dump

```sh
docker exec island-jenkins ls -l /var/jenkins_home/island-mvp-backups
```

A dump is named `island-YYYYMMDDTHHMMSSZ.dump`. The first five bytes are `PGDMP`. The Jenkins build log for `island-mvp-backup` prints `wrote` and that path.
