// Seeded by JCasC (WF-031). Polls GitHub for PRs when JENKINS_GITHUB_TOKEN is a real PAT.
// Placeholder token "changeme" until .env is set — Scan Repository will fail until then (expected).
multibranchPipelineJob('my-island') {
  description('GitHub multibranch (PRs + main). Set JENKINS_GITHUB_TOKEN (repo + checks:write). Laptop polls every 5m; no public webhook required.')
  branchSources {
    github {
      id('my-island-gh')
      repoOwner('tezball')
      repository('my-island')
      scanCredentialsId('github-token')
    }
  }
  orphanedItemStrategy {
    discardOldItems {
      numToKeep(30)
      daysToKeep(14)
    }
  }
  factory {
    workflowBranchProjectFactory {
      scriptPath('Jenkinsfile')
    }
  }
  triggers {
    periodicFolderTrigger {
      interval('5m')
    }
  }
}
