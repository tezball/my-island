# Jenkins checkout

Job `island-mvp` fast-forwards its own checkout at `/tmp/island-mvp-jenkins`. It does not merge inside `/tmp/mvp-seed`. Agents edit that shared worktree, and a dirty `server/build.gradle.kts` there made build 61 abort `git merge --ff-only`.

The directory is a host path, bind-mounted into the `island-jenkins` container at the same path. Compose files in that checkout therefore send host paths for bind mounts. The freestyle shell is `ops/jenkins/checkout.sh`, copied to `/var/jenkins_home/island-mvp-checkout.sh` so a replace of the checkout cannot delete the script that is running. If that checkout is missing, dirty, or not a fast-forward, the script deletes only `/tmp/island-mvp-jenkins` and clones `origin/main` again.

`ops/jenkins/deploy.sh` runs from that checkout. A red `:server:test` exits before the app container is recreated. A red Gatling run fails the job after the new app is up. The compose project name stays `island-mvp`.

Tools: Jenkins freestyle, git, Docker Compose on the host socket.
