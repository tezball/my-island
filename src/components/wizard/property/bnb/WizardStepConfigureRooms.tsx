import { ConfigureAccommodation } from '../campsite/ConfigureAccommodation'

export function WizardStepConfigureRooms() {
  return (
    <ConfigureAccommodation
      type="BED_AND_BREAKFAST"
      title="Configure B&B Rooms"
      description="Set up your bed & breakfast rooms"
    />
  )
}

export default WizardStepConfigureRooms
