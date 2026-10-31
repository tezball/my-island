#!/bin/sh
# Fast-forward the island-mvp job checkout, then deploy.
# This script is the freestyle shell for job island-mvp. It never touches
# /tmp/mvp-seed. Agents edit that shared worktree, and a dirty file there
# used to abort git merge --ff-only (build 61).
set -eu
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-/var/jenkins_home/gradle}"
CHECKOUT=/tmp/island-mvp-jenkins
case "$CHECKOUT" in
  /tmp/island-mvp-jenkins) ;;
  *)
    echo "refusing to replace an unexpected checkout"
    exit 1
    ;;
esac
ensure_safe() {
  if ! git config --global --get-all safe.directory 2>/dev/null | grep -qx "$1"; then
    git config --global --add safe.directory "$1"
  fi
}
ensure_safe "$CHECKOUT"
ensure_safe /tmp/fresh-island
origin=$(git -C /tmp/fresh-island remote get-url origin)
replace_checkout() {
  cd /tmp
  # The checkout is a bind mount, so remove its contents and keep the mount point.
  if [ -d "$CHECKOUT" ]; then
    find "$CHECKOUT" -mindepth 1 -delete
  else
    mkdir -p "$CHECKOUT"
  fi
  git clone --quiet --branch main "$origin" "$CHECKOUT"
  cd "$CHECKOUT"
  git fetch --quiet origin main
  git merge --ff-only origin/main
}
if [ ! -d "$CHECKOUT/.git" ]; then
  replace_checkout
else
  cd "$CHECKOUT"
  git remote set-url origin "$origin"
  git fetch --quiet origin main
  if ! git diff --quiet || ! git diff --cached --quiet; then
    replace_checkout
  elif ! git merge --ff-only origin/main; then
    replace_checkout
  fi
fi
cd "$CHECKOUT"
exec sh ops/jenkins/deploy.sh
