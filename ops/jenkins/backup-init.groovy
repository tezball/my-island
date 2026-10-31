// Arms island-mvp-backup on startup and queues the first dump if none has succeeded.
// The hourly timer is the job's TimerTrigger. No password here.
import hudson.model.Items
import jenkins.model.Jenkins

def jenkins = Jenkins.instance
def name = "island-mvp-backup"
def dir = new File(jenkins.getRootDir(), "jobs/" + name)
def job = jenkins.getItem(name)

if (job == null) {
  if (!new File(dir, "config.xml").isFile()) {
    println(name + " config.xml missing at " + dir)
    return
  }
  try {
    def item = Items.load(jenkins, dir)
    jenkins.putItem(item)
    job = jenkins.getItem(name)
    println("loaded " + name + " from " + dir)
  } catch (Throwable t) {
    println("failed to load " + name + ": " + t)
    t.printStackTrace(System.out)
    return
  }
}

if (job == null) {
  println(name + " still missing after load")
  return
}

if (job.getLastSuccessfulBuild() == null && !job.isBuilding()) {
  job.scheduleBuild2(0)
  println("scheduled first " + name + " build")
}
