import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureRV() {
  return (
    <ConfigureAccommodation
      type="RV"
      title="Configure RV Pitches"
      description="Set up your RV and motorhome pitches"
    />
  )
}

export default WizardStepConfigureRV
