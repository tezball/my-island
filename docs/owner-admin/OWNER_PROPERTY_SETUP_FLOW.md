# Owner Property Setup Flow

## Overview

A guided, conversational wizard that walks campsite owners through setting up their entire property. By the end of the flow, owners will have a fully configured listing with all accommodation types, pricing, facilities, and media ready to publish.

## Design Principles

1. **Conversational Tone** - Questions feel like a friendly conversation, not a form
2. **Progressive Disclosure** - Only show relevant follow-up questions based on answers
3. **Smart Defaults** - Pre-fill common options to speed up setup
4. **Visual Feedback** - Show a live preview of what's being created
5. **Save Progress** - Allow users to pause and resume later
6. **Mobile-First** - Optimized for phone usage on-site

---

## Flow Steps

### Step 1: Welcome & Property Basics

**Screen: "Let's set up your property"**

Questions:
1. "What's the name of your campsite?"
   - Text input
   - Example placeholder: "Sunset Bay Camping"

2. "Where is it located?"
   - Address input
   - County dropdown (Irish counties)
   - **"Use my location" button** (GPS)
   - Interactive map pin drop

3. "Describe your place in a few sentences"
   - Textarea with prompts:
     - "What makes it special?"
     - "What will guests love about staying here?"
   - Character count (min 50, max 2000)

**Progress: 15%**

---

### Step 2: Accommodation Types

**Screen: "What types of accommodation do you offer?"**

Visual card selection (multi-select):

| Type | Icon | Description |
|------|------|-------------|
| **Tent Pitches** | ⛺ | Grass or hardstanding for guests' own tents |
| **Campervan/Motorhome** | 🚐 | Pitches for campervans and motorhomes |
| **Glamping Pods** | 🏕️ | Pre-set glamping pods or yurts |
| **Cabins/Lodges** | 🏠 | Wooden cabins or lodges |
| **B&B Rooms** | 🛏️ | Bed & breakfast style rooms |
| **Static Caravans** | 🏘️ | Fixed caravans for hire |
| **Bell Tents** | 🎪 | Pre-pitched bell tents or tipis |
| **Shepherd's Huts** | 🚃 | Shepherd's huts or converted units |
| **Tree Houses** | 🌳 | Elevated tree house accommodation |
| **Other** | ➕ | Custom accommodation type |

*User selects all that apply*

**Progress: 25%**

---

### Step 3: Accommodation Details (Per Type)

*This step repeats for each accommodation type selected*

**Screen: "Tell us about your [Tent Pitches]"**

#### 3a. Quantity & Naming

"How many [tent pitches] do you have?"
- Number input (1-100)
- Stepper buttons for easy adjustment

"Do you want to name them individually or use automatic numbering?"
- [ ] Auto-number (Pitch 1, Pitch 2, etc.)
- [ ] Custom names (I'll name each one)

*If custom names selected:*
- Grid of text inputs for each name

#### 3b. Amenities Per Pitch (Smart Questions)

"Do all your [tent pitches] have the same amenities?"
- [ ] Yes, they're all the same
- [ ] No, they vary

*If "Yes" - single set of amenities:*

**Power:**
- [ ] No power
- [ ] Electric hookup (Amps: 6A / 10A / 16A)
- [ ] Solar charging only

**Water:**
- [ ] No water nearby
- [ ] Shared water tap
- [ ] Individual water point

**Fire:**
- [ ] No fires allowed
- [ ] Fire pit provided
- [ ] Bring your own fire pit
- [ ] BBQ provided

**Size/Type:**
- [ ] Grass pitch
- [ ] Hardstanding
- [ ] Mixed surface

**Vehicle Access:**
- [ ] Car parking at pitch
- [ ] Car parking nearby
- [ ] No vehicle access

*If "No, they vary" - show a grid/table:*

| Pitch | Power | Water | Fire | Size |
|-------|-------|-------|------|------|
| Pitch 1 | ⚡ 10A | 💧 | 🔥 | Grass |
| Pitch 2 | ❌ | 💧 | 🔥 | Grass |
| ... | ... | ... | ... | ... |

*Bulk edit options: "Set all to..." for each column*

#### 3c. Capacity

"How many guests can stay at each pitch?"
- Adults: [2] (stepper)
- Children: [4] (stepper)
- "Allow pets?" Toggle

#### 3d. Pricing

"How much do you charge per night?"

**Base Price:** €[___] per night

**Seasonal Pricing (optional):**
- [ ] Same price year-round
- [ ] Different prices by season

*If seasonal:*
| Season | Dates | Price |
|--------|-------|-------|
| Low | Nov - Feb | €15 |
| Mid | Mar - May, Sep - Oct | €20 |
| High | Jun - Aug | €25 |
| Peak | Bank holidays | €30 |

**Additional Charges:**
- Extra adult: €[___]
- Extra child: €[___]
- Pet fee: €[___]
- Electric hookup: €[___] (if not included)

**Progress: 35% → 65%** (increases with each accommodation type)

---

### Step 4: Campsite Facilities

**Screen: "What facilities does your campsite have?"**

Category-based selection with icons:

#### Essentials
- [ ] 🚿 Showers (How many? ___)
- [ ] 🚽 Toilets (How many? ___)
- [ ] 🚰 Drinking water
- [ ] 🗑️ Waste disposal
- [ ] ♻️ Recycling

#### Comfort
- [ ] 🔌 Charging stations
- [ ] 📶 WiFi (Free / Paid €___)
- [ ] 🧺 Laundry facilities
- [ ] 🍳 Communal kitchen
- [ ] 🏠 Indoor common room
- [ ] 🔥 Communal fire pit

#### Activities
- [ ] 🎮 Games room
- [ ] 🏊 Swimming (Pool / Lake / Beach access)
- [ ] 🚴 Bike hire
- [ ] 🛶 Kayak/boat hire
- [ ] 🎣 Fishing
- [ ] 🥾 Walking trails
- [ ] 🐴 Horse riding
- [ ] 🧘 Yoga space

#### Family
- [ ] 👶 Baby changing
- [ ] 🛝 Playground
- [ ] 🐕 Dog walking area
- [ ] 🎪 Kids activities

#### Services
- [ ] 🛒 On-site shop
- [ ] ☕ Café/restaurant
- [ ] 🍺 Bar
- [ ] 🥖 Fresh bread delivery
- [ ] 🧊 Ice pack freezing

#### Accessibility
- [ ] ♿ Wheelchair accessible
- [ ] 🚻 Accessible toilets/showers
- [ ] 🅿️ Disabled parking

*For each selected facility, optional detail inputs appear*

**Progress: 75%**

---

### Step 5: Photos & Media

**Screen: "Show off your campsite"**

#### Main Photo
"Upload your best photo - this will be your listing cover"
- Drag & drop or tap to upload
- Cropping tool for 16:9 ratio
- Tips: "Bright, outdoor shots work best"

#### Gallery
"Add more photos (minimum 3, recommended 8-12)"

Suggested categories:
- 📍 Overall campsite views
- ⛺ Individual pitches/accommodations
- 🚿 Facilities (showers, toilets, kitchen)
- 🌄 Scenery and surroundings
- 🎯 Activities and features

*Drag to reorder*

#### Video (Optional)
"Add a short video tour"
- Upload or YouTube/Vimeo link
- Max 2 minutes recommended

**Progress: 85%**

---

### Step 6: Rules & Policies

**Screen: "Set your house rules"**

#### Check-in/out
- Check-in from: [14:00]
- Check-in until: [20:00]
- Check-out by: [11:00]
- "Late check-in available?" Toggle → Fee €[___]

#### Quiet Hours
- "Do you have quiet hours?" Toggle
- From: [22:00] To: [08:00]

#### Cancellation Policy
- [ ] Flexible (Full refund up to 24 hours before)
- [ ] Moderate (Full refund up to 7 days before)
- [ ] Strict (50% refund up to 14 days before)
- [ ] Custom (Define your own)

#### Rules Checklist
Quick toggles for common rules:
- [ ] No music after quiet hours
- [ ] No single-sex groups
- [ ] No under 18s without adult
- [ ] No disposable BBQs
- [ ] Dogs must be kept on leads
- [ ] Maximum 2 dogs per pitch
- [ ] No campfires in dry conditions

#### Additional Rules
"Anything else guests should know?"
- Textarea for custom rules

**Progress: 95%**

---

### Step 7: Review & Publish

**Screen: "Review your listing"**

Full preview of listing as guests will see it:

```
┌─────────────────────────────────────┐
│  [Cover Photo]                      │
│                                     │
│  Sunset Bay Camping ⭐ New          │
│  📍 Clifden, Galway                 │
│                                     │
│  From €20/night                     │
│                                     │
│  ⛺ 10 Tent Pitches                 │
│  🏕️ 4 Glamping Pods                │
│  🏠 2 Cabins                        │
│                                     │
│  🚿 Showers · 📶 WiFi · 🔥 Fire pits │
└─────────────────────────────────────┘
```

#### Summary Cards

**Accommodations Created:**
| Type | Quantity | Price Range |
|------|----------|-------------|
| Tent Pitches | 10 | €15 - €25 |
| Glamping Pods | 4 | €60 - €90 |
| Cabins | 2 | €100 - €150 |

**Facilities:** 12 selected
**Photos:** 8 uploaded
**Rules:** Configured ✓

#### Edit Options
Each section has an "Edit" button to go back

#### Publishing Options

- [ ] **Publish Now** - Go live immediately
- [ ] **Schedule** - Set a launch date
- [ ] **Save as Draft** - Finish later

**[Publish My Campsite]** (Primary CTA)

**Progress: 100%**

---

## Post-Setup

### Success Screen

**"Congratulations! Your campsite is live!"** 🎉

Quick actions:
- 📱 Share your listing
- 📅 Manage availability calendar
- 💰 View pricing settings
- 📊 Go to dashboard

### What's Next Tips
1. "Set your availability for the next 3 months"
2. "Connect a payment method to accept bookings"
3. "Enable instant booking for faster reservations"

---

## Technical Implementation

### Data Structure

```typescript
interface PropertySetup {
  // Step 1: Basics
  property: {
    name: string
    description: string
    address: string
    county: string
    lat: number
    lng: number
  }

  // Step 2-3: Accommodations
  accommodations: {
    type: AccommodationType
    quantity: number
    namingScheme: 'auto' | 'custom'
    names?: string[]
    amenitiesUniform: boolean
    defaultAmenities?: Amenities
    units: AccommodationUnit[]
    capacity: {
      adults: number
      children: number
      pets: boolean
    }
    pricing: {
      basePrice: number
      seasonal?: SeasonalPrice[]
      extras: {
        extraAdult?: number
        extraChild?: number
        petFee?: number
        electricHookup?: number
      }
    }
  }[]

  // Step 4: Facilities
  facilities: {
    id: string
    name: string
    quantity?: number
    details?: string
  }[]

  // Step 5: Media
  media: {
    coverPhoto: string
    gallery: string[]
    video?: string
  }

  // Step 6: Rules
  rules: {
    checkIn: { from: string, until: string }
    checkOut: string
    quietHours?: { from: string, to: string }
    cancellationPolicy: CancellationPolicy
    customRules: string[]
  }
}
```

### State Management

- Use React Context for wizard state
- Persist to localStorage on each step (auto-save)
- Sync to backend on step completion
- Allow resuming from any step

### API Endpoints

```
POST /api/owner/property/draft      # Create/update draft
GET  /api/owner/property/draft      # Resume draft
POST /api/owner/property/publish    # Publish listing
POST /api/owner/property/media      # Upload photos
```

### Validation Rules

| Field | Validation |
|-------|------------|
| Property name | 2-100 characters |
| Description | 50-2000 characters |
| Location | Lat/lng within Ireland |
| Accommodation quantity | 1-100 per type |
| Base price | €1 - €10,000 |
| Photos | Min 3, max 20, <10MB each |

---

## Mobile Considerations

1. **Large touch targets** - Minimum 48px for all interactive elements
2. **Single column layout** - No side-by-side inputs on mobile
3. **Sticky navigation** - Progress bar and Next button always visible
4. **Offline support** - Cache progress locally, sync when online
5. **Camera integration** - Direct photo capture for media step

---

## Analytics Events

Track these events for funnel analysis:

- `setup_started` - Wizard opened
- `step_completed` - Each step finished
- `step_skipped` - Optional step skipped
- `setup_abandoned` - User leaves mid-flow
- `setup_completed` - Full setup done
- `listing_published` - Went live

---

## Future Enhancements

1. **AI-assisted descriptions** - Generate description from photos
2. **Price suggestions** - Based on similar properties
3. **Competitor analysis** - Show nearby listings
4. **Bulk import** - CSV upload for large properties
5. **Template library** - Start from popular setups
