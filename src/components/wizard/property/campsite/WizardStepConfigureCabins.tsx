import { ConfigureAccommodation } from './ConfigureAccommodation'

export function WizardStepConfigureCabins() {
  return (
    <ConfigureAccommodation
      type="CABIN"
      title="Configure Cabins"
      description="Set up your cabins and cottages"
    />
  )
}

export default WizardStepConfigureCabins
