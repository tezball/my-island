import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureMobileHome() {
  return (
    <ConfigureAccommodation
      type="MOBILE_HOME"
      title="Configure Mobile Homes"
      description="Set up your mobile home pitches"
    />
  )
}

export default WizardStepConfigureMobileHome
