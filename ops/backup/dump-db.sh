#!/bin/sh
# Dump the island-mvp PostGIS database. The file stays out of git.
set -eu

project=island-mvp
service=db
db_user=island
db_name=island
compose_file="${ISLAND_COMPOSE_FILE:-/repo/compose.yml}"

if [ -n "${ISLAND_BACKUP_DIR:-}" ]; then
  dest=$ISLAND_BACKUP_DIR
elif [ -d /var/jenkins_home ]; then
  dest=/var/jenkins_home/island-mvp-backups
else
  dest=/var/backups/island-mvp
fi

case "$dest" in
  /repo|/repo/*|/tmp/mvp-seed|/tmp/mvp-seed/*|/tmp/fresh-island|/tmp/fresh-island/*|/workspace|/workspace/*)
    echo "refusing to write a dump inside a git checkout: $dest" >&2
    exit 1
    ;;
esac

if command -v git >/dev/null 2>&1; then
  if git -C "$dest" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "refusing to write a dump inside a git work tree: $dest" >&2
    exit 1
  fi
fi

umask 077
mkdir -p "$dest"
chmod 700 "$dest"

stamp=$(date -u +%Y%m%dT%H%M%SZ)
tmp="$dest/.island-$stamp.dump.partial"
out="$dest/island-$stamp.dump"

docker compose --project-name "$project" --file "$compose_file" exec -T "$service" \
  pg_dump -U "$db_user" --dbname="$db_name" --format=custom --no-owner --no-privileges > "$tmp"

size=$(wc -c < "$tmp" | tr -d ' ')
if [ "$size" -lt 64 ]; then
  rm -f "$tmp"
  echo "dump too small ($size bytes)" >&2
  exit 1
fi

# Custom-format archives start with PGDMP.
magic=$(dd if="$tmp" bs=5 count=1 2>/dev/null || true)
if [ "$magic" != "PGDMP" ]; then
  rm -f "$tmp"
  echo "dump is not a pg_dump custom archive" >&2
  exit 1
fi

mv "$tmp" "$out"
chmod 600 "$out"

keep=14
n=0
files=$(ls -1t "$dest"/island-*.dump 2>/dev/null || true)
# shellcheck disable=SC2039
printf '%s\n' "$files" | while IFS= read -r old; do
  [ -n "$old" ] || continue
  [ -f "$old" ] || continue
  n=$((n + 1))
  if [ "$n" -gt "$keep" ]; then
    rm -f "$old"
  fi
done

echo "wrote $out ($size bytes)"
