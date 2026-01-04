import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureTents() {
  return (
    <ConfigureAccommodation
      type="TENT"
      title="Configure Tent Pitches"
      description="Set up your tent camping pitches"
    />
  )
}

export default WizardStepConfigureTents
