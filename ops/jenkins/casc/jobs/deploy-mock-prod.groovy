// Seeded by JCasC (WF-031 / WF-032). Stub until mock-prod VPS exists.
pipelineJob('deploy-mock-prod') {
  description('Deploy main → AWS mock-prod VPS. Blocked until WF-010 host exists. Not a GitHub production Environment.')
  definition {
    cps {
      sandbox(true)
      script("""
pipeline {
  agent any
  options { timestamps() }
  stages {
    stage('gate') {
      steps {
        echo 'WF-032: mock-prod VPS not provisioned yet (see docs/ops/tickets/WF-010.md).'
        echo 'When host exists: wire SSH deploy from main here; secrets via credentials, never git.'
        error('deploy-mock-prod blocked: no mock-prod host (WF-010)')
      }
    }
  }
}
""")
    }
  }
}
