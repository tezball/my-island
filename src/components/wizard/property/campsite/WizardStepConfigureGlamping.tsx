import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureGlamping() {
  return (
    <ConfigureAccommodation
      type="GLAMPING"
      title="Configure Glamping Pods"
      description="Set up your glamping accommodations"
    />
  )
}

export default WizardStepConfigureGlamping
