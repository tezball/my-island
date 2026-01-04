import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureApartments() {
  return (
    <ConfigureAccommodation
      type="APARTMENT"
      title="Configure Apartments"
      description="Set up your apartment units"
    />
  )
}

export default WizardStepConfigureApartments
