# My Island - Complete User Stories

This document contains all user stories for the My Island camping/glamping booking platform. Stories are organized by user role and feature area.

---

## Table of Contents

1. [Guest User Stories](#1-guest-user-stories)
2. [Registered User Stories](#2-registered-user-stories)
3. [Property Owner Stories](#3-property-owner-stories)
4. [Supplier Stories](#4-supplier-stories)
5. [System/Technical Stories](#5-systemtechnical-stories)

---

## 1. Guest User Stories

Guest users are visitors who browse the platform without creating an account.

### 1.1 Discovery & Search

#### US-G-001: Browse Featured Campsites
**As a** guest user
**I want to** see featured campsites on the home page
**So that** I can discover popular and recommended accommodations in Ireland

**Acceptance Criteria:**
- Home page displays a curated list of featured campsites
- Each campsite card shows: name, main image, location (county), rating, price per night
- Featured campsites are visually distinguished
- Guest can tap a campsite to view full details

---

#### US-G-002: Search Campsites by Location
**As a** guest user
**I want to** search for campsites by county or location
**So that** I can find accommodations in my desired area of Ireland

**Acceptance Criteria:**
- Search field accepts county names or general location terms
- Results display campsites matching the search criteria
- Results show distance from searched location when coordinates are available
- Empty search shows all available campsites
- Search is case-insensitive

---

#### US-G-003: Filter Campsites by Facilities
**As a** guest user
**I want to** filter campsites by available facilities
**So that** I can find accommodations with amenities I need

**Acceptance Criteria:**
- Filter options include: WiFi, Electric, Water, Toilet, Shower, Laundry, Shop, Restaurant, Playground, Beach, Fishing, Hiking, Cycling, Pets
- Multiple facilities can be selected simultaneously
- Results update dynamically as filters are applied
- Clear filters option resets all selections
- Active filters are visually indicated

---

#### US-G-004: View Campsite on Map
**As a** guest user
**I want to** view campsites on an interactive map
**So that** I can visualize locations and find campsites in specific areas

**Acceptance Criteria:**
- Map displays all campsites as markers with clustering for dense areas
- Clicking a marker shows campsite preview (name, image, price)
- Map supports zoom and pan interactions
- Bounding box query loads campsites visible on current map viewport
- User can navigate to full campsite details from map preview

---

#### US-G-005: View Campsite Details
**As a** guest user
**I want to** view complete details of a campsite
**So that** I can make an informed decision about booking

**Acceptance Criteria:**
- Detail page shows: name, full description, all images, location with map
- Displays average rating and total review count
- Lists all facilities with icons
- Shows available lot types with pricing
- Displays check-in/check-out times
- Shows cancellation policy
- Includes host information

---

#### US-G-006: View Campsite Photo Gallery
**As a** guest user
**I want to** browse all photos of a campsite in a gallery view
**So that** I can see comprehensive visual details of the property

**Acceptance Criteria:**
- Gallery displays all campsite images in a grid or carousel
- Full-screen viewing mode available
- Swipe/arrow navigation between photos
- Photo count indicator (e.g., "3 of 12")
- Tap outside or close button to exit gallery

---

#### US-G-007: View Campsite Reviews
**As a** guest user
**I want to** read reviews from previous guests
**So that** I can understand the quality and experience at the campsite

**Acceptance Criteria:**
- Reviews display: reviewer name, avatar, rating, date, title, content
- Category ratings shown: cleanliness, location, value, facilities
- Photos attached to reviews are displayed
- Reviews are paginated or infinite scroll
- Overall average rating prominently displayed
- "Helpful" count shown for each review

---

#### US-G-008: View Available Lot Types
**As a** guest user
**I want to** see all accommodation types available at a campsite
**So that** I can choose the right type for my trip

**Acceptance Criteria:**
- Lot types displayed: Tent, Caravan, Campervan, RV, Glamping, Cabin, Treehouse, Yurt, Pod, Apartment, Cottage, Safari Tent, B&B Room, Mobile Home
- Each lot type shows: name, capacity, price per night, images, amenities
- Availability status indicated
- Description for each lot type

---

#### US-G-009: Check Lot Availability Calendar
**As a** guest user
**I want to** view availability calendar for specific lots
**So that** I can find dates that work for my trip

**Acceptance Criteria:**
- Calendar displays availability status for each date
- Color coding: available (green), booked (red), blocked (gray)
- Date range selection supported
- Current date highlighted
- Navigation between months
- Minimum/maximum stay restrictions shown if applicable

---

### 1.2 Offers & Local Businesses

#### US-G-010: Browse Local Offers
**As a** guest user
**I want to** browse special offers from local businesses
**So that** I can discover deals during my camping trip

**Acceptance Criteria:**
- Offers page displays all active offers
- Filter by category: Food, Activities, Gear, Attractions, Transport
- Each offer shows: supplier name, logo, title, discount, valid until date
- Featured offers highlighted at top
- Expired offers not displayed

---

#### US-G-011: View Offer Details
**As a** guest user
**I want to** view complete details of an offer
**So that** I understand how to redeem the deal

**Acceptance Criteria:**
- Detail page shows: full description, discount amount/percentage
- Supplier information with logo and location
- Validity period clearly displayed
- Location shown on map
- Terms and conditions if applicable

---

#### US-G-012: View Local Businesses on Map
**As a** guest user
**I want to** see local businesses near campsites on a map
**So that** I can find nearby amenities and services

**Acceptance Criteria:**
- Map displays business markers with category icons
- Filter by category: Restaurant, Pub, Farm Shop, Grocery, Outdoor Gear, Kayak Rental, Bike Rental, Fishing, Convenience
- Clicking marker shows business preview
- Distance from current location or campsite shown
- List view alternative available

---

#### US-G-013: View Local Business Details
**As a** guest user
**I want to** view details of a local business
**So that** I can plan visits during my trip

**Acceptance Criteria:**
- Shows: business name, description, category, location
- Contact information: phone, email, website
- Operating hours if available
- Location on map with directions link
- Related offers from this business

---

### 1.3 Support & Information

#### US-G-014: Browse FAQ
**As a** guest user
**I want to** browse frequently asked questions
**So that** I can find answers to common questions without contacting support

**Acceptance Criteria:**
- FAQs organized by category
- Expandable/collapsible question sections
- Search functionality within FAQs
- Clear and comprehensive answers
- Links to relevant pages where applicable

---

#### US-G-015: View About Page
**As a** guest user
**I want to** learn about the My Island platform
**So that** I can understand the company and its mission

**Acceptance Criteria:**
- Company description and mission statement
- Team information (optional)
- Contact information
- Links to social media
- Company history or background

---

#### US-G-016: View Privacy Policy
**As a** guest user
**I want to** read the privacy policy
**So that** I understand how my data is handled

**Acceptance Criteria:**
- Complete privacy policy text
- Easy to read formatting
- Last updated date displayed
- Sections for different data types
- Contact for privacy inquiries

---

#### US-G-017: View Terms of Service
**As a** guest user
**I want to** read the terms of service
**So that** I understand the rules and conditions of using the platform

**Acceptance Criteria:**
- Complete terms and conditions
- Clear section headings
- Last updated date
- Cancellation and refund policies
- User obligations and rights

---

### 1.4 Authentication

#### US-G-018: Create Account
**As a** guest user
**I want to** create a new account
**So that** I can make bookings and save my preferences

**Acceptance Criteria:**
- Registration form with: name, email, password, confirm password
- Password requirements clearly stated (minimum length, complexity)
- Email validation
- Terms acceptance checkbox required
- Success confirmation and email verification sent
- Redirect to welcome/onboarding flow

---

#### US-G-019: Sign Up with Social Provider
**As a** guest user
**I want to** create an account using Google, Apple, or Facebook
**So that** I can quickly register without creating a new password

**Acceptance Criteria:**
- Google, Apple, and Facebook sign-up buttons available
- OAuth flow opens in new window/browser
- Account created from social provider data (name, email)
- Terms acceptance still required
- Handles existing email conflicts appropriately

---

#### US-G-020: Login to Account
**As a** guest user
**I want to** log into my existing account
**So that** I can access my bookings and saved preferences

**Acceptance Criteria:**
- Login form with email and password fields
- Remember me option
- Show/hide password toggle
- Clear error messages for invalid credentials
- Account locked after multiple failed attempts
- Redirect to requested page after login

---

#### US-G-021: Login with Social Provider
**As a** guest user
**I want to** login using my linked social account
**So that** I can quickly access my account without typing credentials

**Acceptance Criteria:**
- Google, Apple, and Facebook login buttons
- Only works if account was created with or linked to that provider
- Appropriate error if no account exists
- Session created on successful authentication

---

#### US-G-022: Reset Forgotten Password
**As a** guest user
**I want to** reset my password if I've forgotten it
**So that** I can regain access to my account

**Acceptance Criteria:**
- Forgot password link on login page
- Enter email to receive reset link
- Confirmation page after submission
- Email with secure reset link sent
- Reset link expires after time limit
- New password must meet requirements
- Success confirmation after reset

---

#### US-G-023: Verify Email Address
**As a** guest user
**I want to** verify my email address after registration
**So that** I can activate my account

**Acceptance Criteria:**
- Verification email sent on registration
- Click link to verify email
- Success page shown on verification
- Account activated after verification
- Resend verification option available
- Expired link shows appropriate message

---

---

## 2. Registered User Stories

Registered users have an account and can make bookings, save favorites, and manage their profile.

### 2.1 Booking Flow

#### US-U-001: Start Booking Process
**As a** registered user
**I want to** initiate a booking for a campsite
**So that** I can reserve accommodation for my trip

**Acceptance Criteria:**
- "Book Now" button visible on campsite detail page
- Must be logged in to proceed (redirect to login if not)
- Booking wizard opens with campsite preselected
- Can select lot type if multiple available

---

#### US-U-002: Select Booking Dates
**As a** registered user
**I want to** select my check-in and check-out dates
**So that** I can specify when I want to stay

**Acceptance Criteria:**
- Calendar interface for date selection
- Unavailable dates clearly marked and unselectable
- Minimum stay requirements enforced
- Shows number of nights calculated
- Dynamic pricing updates if rates vary by date
- Validation prevents check-out before check-in

---

#### US-U-003: Select Number of Guests
**As a** registered user
**I want to** specify the number of guests
**So that** the booking reflects my party size

**Acceptance Criteria:**
- Adults and children count selectors
- Maximum capacity enforced based on lot type
- Pet count option if property allows pets
- Guest count affects pricing if per-person rates apply
- Validation prevents exceeding lot capacity

---

#### US-U-004: Add Booking Extras
**As a** registered user
**I want to** add optional extras to my booking
**So that** I can enhance my stay with additional services

**Acceptance Criteria:**
- Display available extras for the campsite (e.g., firewood, breakfast, equipment rental)
- Each extra shows: name, description, price, per-unit or per-stay
- Quantity selector for applicable extras
- Subtotal updates as extras are added
- Can proceed without selecting any extras

---

#### US-U-005: Review Booking Summary
**As a** registered user
**I want to** review my booking details before payment
**So that** I can confirm everything is correct

**Acceptance Criteria:**
- Summary shows: campsite name, lot type, dates, guests, extras
- Price breakdown: base rate, extras, taxes, total
- Cancellation policy displayed
- Edit buttons to modify any section
- Terms acceptance checkbox required
- Proceed to payment button

---

#### US-U-006: Select Payment Method
**As a** registered user
**I want to** choose how to pay for my booking
**So that** I can use my preferred payment method

**Acceptance Criteria:**
- Saved payment methods shown if any exist
- Option to add new payment method
- Support for: Credit/Debit Card, Apple Pay, Google Pay
- Selected method highlighted
- Add new card form with validation

---

#### US-U-007: Complete Payment
**As a** registered user
**I want to** submit payment for my booking
**So that** my reservation is confirmed

**Acceptance Criteria:**
- Processing indicator during payment
- Secure payment handling (no card details stored in app)
- Success page with booking confirmation number
- Failure handling with clear error message
- Option to retry with different payment method on failure
- Email confirmation sent on success

---

#### US-U-008: View Booking Confirmation
**As a** registered user
**I want to** see my booking confirmation after payment
**So that** I have proof of my reservation

**Acceptance Criteria:**
- Confirmation page shows: booking ID, campsite details, dates, total paid
- QR code or booking reference for easy check-in
- Add to calendar option (iCal/Google Calendar)
- Share booking details option
- View full booking details link
- Download receipt option

---

### 2.2 Managing Bookings

#### US-U-009: View My Bookings
**As a** registered user
**I want to** see all my bookings
**So that** I can manage my trips

**Acceptance Criteria:**
- List of all bookings organized by status
- Tabs/filters: Upcoming, Past, Cancelled
- Each booking shows: campsite name, image, dates, status
- Sorted by date (upcoming first)
- Pagination for long lists

---

#### US-U-010: View Booking Details
**As a** registered user
**I want to** view complete details of a specific booking
**So that** I can see all information about my reservation

**Acceptance Criteria:**
- Full booking information: campsite, lot, dates, guests, extras
- Price breakdown and payment details
- Booking status: Pending, Confirmed, Checked In, Completed, Cancelled
- Host contact information
- Action buttons based on status (modify, cancel, contact host)

---

#### US-U-011: Modify Booking Dates
**As a** registered user
**I want to** change my booking dates
**So that** I can adjust my travel plans

**Acceptance Criteria:**
- Only available for confirmed bookings before check-in
- Calendar shows available alternative dates
- Price difference calculated and displayed
- Additional payment required if new dates cost more
- Refund issued if new dates cost less (per policy)
- Confirmation required before changes are saved

---

#### US-U-012: Modify Guest Count
**As a** registered user
**I want to** change the number of guests on my booking
**So that** I can adjust for party changes

**Acceptance Criteria:**
- Update adults, children, or pets count
- Cannot exceed lot capacity
- Price adjustment if per-person rates apply
- Confirmation before saving changes

---

#### US-U-013: Cancel Booking
**As a** registered user
**I want to** cancel my booking
**So that** I can free up the reservation if plans change

**Acceptance Criteria:**
- Cancel option available for confirmed bookings
- Cancellation policy displayed with refund amount
- Optional cancellation reason field
- Confirmation modal before final cancellation
- Refund processed according to policy
- Cancellation confirmation email sent
- Booking status updated to "Cancelled"

---

#### US-U-014: View Booking Receipt
**As a** registered user
**I want to** download or view my booking receipt
**So that** I have documentation for my records

**Acceptance Criteria:**
- Receipt shows: booking details, payment breakdown, transaction ID
- My Island branding and contact info
- PDF download option
- Email receipt option
- Suitable for expense reporting

---

#### US-U-015: View Check-In Instructions
**As a** registered user
**I want to** view check-in instructions for my confirmed booking
**So that** I know how to arrive and access the property

**Acceptance Criteria:**
- Available only after booking is confirmed
- Shows: check-in time, check-out time
- Access codes (gate code, WiFi password) if applicable
- Directions to property with map link
- Parking information
- House rules/property rules
- Host contact details
- Emergency contacts

---

#### US-U-016: Contact Host
**As a** registered user
**I want to** send a message to the property host
**So that** I can ask questions or communicate about my booking

**Acceptance Criteria:**
- Messaging interface within booking details
- Message history displayed
- Text input for new messages
- Messages linked to specific booking
- Notification sent to host on new message
- Host response appears in same thread

---

### 2.3 Favorites

#### US-U-017: Add Campsite to Favorites
**As a** registered user
**I want to** save a campsite to my favorites
**So that** I can easily find it later

**Acceptance Criteria:**
- Heart/favorite icon on campsite cards and detail pages
- Clicking adds to favorites (instant, no confirmation needed)
- Visual feedback confirms addition
- Icon state changes to filled/active

---

#### US-U-018: View Favorites List
**As a** registered user
**I want to** view all my favorite campsites
**So that** I can browse properties I've saved

**Acceptance Criteria:**
- Dedicated favorites page
- Grid/list view of saved campsites
- Same card format as search results
- Empty state message if no favorites
- Navigate to campsite detail on click

---

#### US-U-019: Remove Campsite from Favorites
**As a** registered user
**I want to** remove a campsite from my favorites
**So that** I can keep my list current

**Acceptance Criteria:**
- Click heart icon to toggle off
- Can remove from favorites page or campsite detail
- Instant removal without confirmation
- Visual feedback confirms removal

---

### 2.4 Reviews

#### US-U-020: Write Campsite Review
**As a** registered user
**I want to** write a review for a campsite I've stayed at
**So that** I can share my experience with others

**Acceptance Criteria:**
- Can only review campsites with completed bookings
- Review form includes: overall rating (1-5 stars), title, written review
- Category ratings: cleanliness, location, value, facilities
- Photo upload option (multiple photos allowed)
- Minimum content requirements (e.g., 50 characters)
- Preview before submission
- Review appears after submission (may have moderation delay)

---

#### US-U-021: View My Reviews
**As a** registered user
**I want to** see all reviews I've written
**So that** I can track my contributions

**Acceptance Criteria:**
- List of all submitted reviews
- Shows: campsite name, date, rating, review snippet
- Link to full review and campsite
- Helpful count received

---

#### US-U-022: Mark Review as Helpful
**As a** registered user
**I want to** mark other users' reviews as helpful
**So that** I can highlight useful reviews

**Acceptance Criteria:**
- "Helpful" button on each review
- Click increments helpful count
- Can only mark once per review
- Visual indication if already marked

---

### 2.5 Profile & Settings

#### US-U-023: View My Profile
**As a** registered user
**I want to** view my profile information
**So that** I can see my account details

**Acceptance Criteria:**
- Profile page shows: name, email, avatar, phone, bio
- Member since date displayed
- Account type indicated (Guest, Owner, Supplier)
- Links to edit profile and settings

---

#### US-U-024: Edit Profile Information
**As a** registered user
**I want to** update my profile information
**So that** I can keep my details current

**Acceptance Criteria:**
- Edit: name, phone, bio, avatar
- Avatar upload with image cropping
- Validation on all fields
- Save confirmation
- Email requires verification if changed

---

#### US-U-025: Manage Linked Accounts
**As a** registered user
**I want to** link or unlink social accounts
**So that** I can manage my login options

**Acceptance Criteria:**
- View linked accounts: Google, Apple, Facebook
- Link additional accounts via OAuth flow
- Unlink accounts (must keep at least one login method)
- Shows email associated with each linked account

---

#### US-U-026: Manage Payment Methods
**As a** registered user
**I want to** add, view, or remove saved payment methods
**So that** I can manage how I pay for bookings

**Acceptance Criteria:**
- List saved payment methods (showing last 4 digits, expiry)
- Add new card with validation
- Set default payment method
- Remove saved payment method
- Secure handling of payment data

---

#### US-U-027: Configure Notification Preferences
**As a** registered user
**I want to** control what notifications I receive
**So that** I only get relevant communications

**Acceptance Criteria:**
- Toggle settings for: email, push, SMS notifications
- Marketing communications opt-in/out
- Notification types: booking updates, promotions, system alerts
- Save preferences with confirmation

---

#### US-U-028: View Notifications
**As a** registered user
**I want to** view my notifications
**So that** I can see important updates about my account and bookings

**Acceptance Criteria:**
- Notification list with: type icon, title, message, timestamp
- Unread count badge on navigation
- Mark as read on view
- Notification types: booking, review, offer, system, reminder
- Action link to relevant content
- Delete/dismiss notifications

---

#### US-U-029: View Notification Detail
**As a** registered user
**I want to** see full details of a notification
**So that** I can understand and act on the message

**Acceptance Criteria:**
- Full notification content displayed
- Related booking/campsite information if applicable
- Action button to navigate to relevant page
- Mark as read automatically

---

#### US-U-030: Access Settings
**As a** registered user
**I want to** access app settings
**So that** I can customize my experience

**Acceptance Criteria:**
- Settings menu with organized sections
- Links to: profile, notifications, payment methods, linked accounts
- Privacy settings
- Help and support links
- Log out option
- Delete account option

---

#### US-U-031: Delete Account
**As a** registered user
**I want to** delete my account
**So that** I can remove my data from the platform

**Acceptance Criteria:**
- Delete account option in settings
- Warning about data loss and active bookings
- Confirmation required (type email or password)
- Account deactivated and data scheduled for deletion
- Confirmation email sent
- Cannot have active future bookings

---

### 2.6 Support

#### US-U-032: Contact Support
**As a** registered user
**I want to** contact customer support
**So that** I can get help with issues

**Acceptance Criteria:**
- Contact support form with subject and message
- Category selection (booking, payment, technical, other)
- Attachment option for screenshots
- Confirmation of ticket creation
- Ticket ID provided for reference

---

#### US-U-033: View Support Tickets
**As a** registered user
**I want to** view my support tickets
**So that** I can track my support requests

**Acceptance Criteria:**
- List of all submitted tickets
- Status shown: Open, In Progress, Resolved, Closed
- Created and updated timestamps
- Click to view full thread

---

#### US-U-034: View Support Ticket Details
**As a** registered user
**I want to** see full details of a support ticket
**So that** I can follow the conversation

**Acceptance Criteria:**
- Full message thread displayed
- My messages and support responses differentiated
- Reply option for open tickets
- Status visible
- Attachments viewable

---

#### US-U-035: Reply to Support Ticket
**As a** registered user
**I want to** reply to a support ticket
**So that** I can provide additional information

**Acceptance Criteria:**
- Text input for reply
- Attachment option
- Submit sends message to support team
- Message appears in thread
- Notification sent to support

---

### 2.7 Role Upgrade

#### US-U-036: Become Property Owner
**As a** registered user
**I want to** upgrade my account to owner status
**So that** I can list my property on the platform

**Acceptance Criteria:**
- "Become an Owner" page accessible from profile
- Information about owner benefits and requirements
- Agreement to owner terms and conditions
- Account upgraded to include Owner role
- Access to owner dashboard granted
- Can retain regular user functionality

---

#### US-U-037: Become Supplier
**As a** registered user
**I want to** register as a local business supplier
**So that** I can list my business and offers on the platform

**Acceptance Criteria:**
- "Become a Supplier" page accessible from profile
- Initial business profile form: business name, description, category, location
- Select category: Restaurant, Pub, Farm Shop, Grocery, Outdoor Gear, Kayak Rental, Bike Rental, Fishing, Convenience
- Agreement to supplier terms
- Account upgraded to include Supplier role
- Access to supplier dashboard granted

---

---

## 3. Property Owner Stories

Property owners can list campsites, manage bookings, and track revenue.

### 3.1 Dashboard & Analytics

#### US-O-001: View Owner Dashboard
**As a** property owner
**I want to** see an overview dashboard
**So that** I can quickly understand my business performance

**Acceptance Criteria:**
- Dashboard shows: total bookings, upcoming bookings, revenue, occupancy rate, average rating
- Revenue change percentage vs previous period
- Quick links to manage bookings, properties, calendar
- Recent activity feed
- Alerts for pending actions

---

#### US-O-002: View Revenue Statistics
**As a** property owner
**I want to** see detailed revenue analytics
**So that** I can track my earnings over time

**Acceptance Criteria:**
- Revenue chart showing monthly/weekly trends
- Total revenue by time period
- Booking count by time period
- Compare to previous periods
- Filter by property if multiple owned
- Export data option

---

#### US-O-003: View Occupancy Statistics
**As a** property owner
**I want to** see occupancy rates
**So that** I can understand utilization of my properties

**Acceptance Criteria:**
- Occupancy percentage by property
- Calendar heat map showing busy periods
- Average length of stay
- Booking lead time statistics
- Peak season identification

---

### 3.2 Property Management

#### US-O-004: View My Properties
**As a** property owner
**I want to** see all my listed properties
**So that** I can manage my portfolio

**Acceptance Criteria:**
- List/grid of all owned properties
- Each shows: name, image, location, status, rating
- Status indicators: Active, Inactive, Pending
- Total revenue and bookings per property
- Links to edit and manage each property

---

#### US-O-005: Create New Property - Wizard Start
**As a** property owner
**I want to** start the property listing process
**So that** I can add a new property to the platform

**Acceptance Criteria:**
- "Add New Property" button on properties page
- Property type selection: Campsite, B&B
- Wizard navigation with clear step indicators
- Progress saved as draft automatically
- Can exit and resume later

---

#### US-O-006: Create Property - Basic Information
**As a** property owner
**I want to** enter basic property information
**So that** guests can identify my property

**Acceptance Criteria:**
- Form fields: property name, description
- Character limits and minimum requirements
- Rich text description with formatting
- Preview of how listing will appear
- Validation with helpful error messages

---

#### US-O-007: Create Property - Location
**As a** property owner
**I want to** specify my property location
**So that** guests can find it

**Acceptance Criteria:**
- Address input with auto-complete
- County selection from dropdown
- Map pin placement for exact coordinates
- Eircode lookup integration
- Latitude/longitude auto-populated
- Location preview on map

---

#### US-O-008: Create Property - Upload Photos
**As a** property owner
**I want to** upload photos of my property
**So that** guests can see what to expect

**Acceptance Criteria:**
- Multi-image upload (drag and drop or file picker)
- Minimum and maximum photo requirements
- Reorder photos to set primary image
- Image preview with delete option
- Automatic image optimization
- Photo guidelines displayed

---

#### US-O-009: Create Property - Facilities
**As a** property owner
**I want to** specify available facilities
**So that** guests can filter and find my property

**Acceptance Criteria:**
- Checkbox list of all facilities: WiFi, Electric, Water, Toilet, Shower, Laundry, Shop, Restaurant, Playground, Beach, Fishing, Hiking, Cycling, Pets
- Multiple selections allowed
- Icons for visual recognition
- Optional notes per facility

---

#### US-O-010: Create Property - Accommodation Types (Campsite)
**As a** property owner
**I want to** specify what accommodation types I offer
**So that** I can set up different lot categories

**Acceptance Criteria:**
- Select accommodation types: Tent, RV/Motorhome, Mobile Home, Glamping, Cabin
- Quantity of each type
- Default capacity per type (editable)
- Base price per night per type
- Amenities per type (pre-populated, customizable)

---

#### US-O-011: Create Property - Room Configuration (B&B)
**As a** property owner
**I want to** configure room types for my B&B
**So that** I can set up bookable units

**Acceptance Criteria:**
- Add room types with names
- Capacity per room
- Amenities per room (Private Bathroom, Breakfast, WiFi, TV)
- Price per night
- Room photos

---

#### US-O-012: Publish Property Listing
**As a** property owner
**I want to** publish my property listing
**So that** it becomes visible to guests

**Acceptance Criteria:**
- Review all entered information before publishing
- Validation ensures all required fields complete
- Publish button finalizes listing
- Success page with property link
- Property appears in search results
- Notification of successful publication

---

#### US-O-013: Edit Property Details
**As a** property owner
**I want to** edit my property information
**So that** I can keep listing details current

**Acceptance Criteria:**
- Edit button on property management page
- All fields editable (name, description, location, photos, facilities)
- Save changes with confirmation
- Changes reflected immediately on public listing

---

#### US-O-014: Delete Property
**As a** property owner
**I want to** delete a property listing
**So that** I can remove it from the platform

**Acceptance Criteria:**
- Delete option in property settings
- Warning about canceling any active bookings
- Cannot delete with future confirmed bookings
- Confirmation required
- Property removed from search results

---

### 3.3 Lot/Unit Management

#### US-O-015: View Lots for Property
**As a** property owner
**I want to** see all lots/units for a property
**So that** I can manage individual bookable units

**Acceptance Criteria:**
- List of all lots for selected property
- Each shows: name, type, capacity, price, availability status
- Filter by lot type
- Quick edit access

---

#### US-O-016: Create New Lot
**As a** property owner
**I want to** add a new lot to my property
**So that** I can increase available inventory

**Acceptance Criteria:**
- Add lot form with: name, type, capacity, price, description
- Select lot type from enum
- Upload lot-specific photos
- Specify lot amenities
- Set as available/unavailable
- Assign to parent campsite

---

#### US-O-017: Edit Lot Details
**As a** property owner
**I want to** edit lot information
**So that** I can update pricing or details

**Acceptance Criteria:**
- Edit all lot fields
- Price changes apply to future bookings only
- Save with confirmation
- Update reflected immediately

---

#### US-O-018: Delete Lot
**As a** property owner
**I want to** delete a lot
**So that** I can remove unavailable units

**Acceptance Criteria:**
- Cannot delete lots with active bookings
- Warning about future availability impact
- Confirmation required
- Lot removed from property

---

### 3.4 Extras Management

#### US-O-019: View Extras for Property
**As a** property owner
**I want to** see all extras/add-ons I offer
**So that** I can manage additional services

**Acceptance Criteria:**
- List of all extras for property
- Shows: name, description, price, availability
- Filter by campsite

---

#### US-O-020: Create Extra/Add-on
**As a** property owner
**I want to** create a new extra service
**So that** guests can enhance their booking

**Acceptance Criteria:**
- Form: name, description, price
- Per-stay or per-night pricing option
- Quantity limits if applicable
- Assign to campsite
- Set availability (active/inactive)

---

#### US-O-021: Edit Extra Details
**As a** property owner
**I want to** update extra information
**So that** I can adjust pricing or availability

**Acceptance Criteria:**
- Edit all extra fields
- Changes apply to future bookings
- Save confirmation

---

#### US-O-022: Delete Extra
**As a** property owner
**I want to** remove an extra
**So that** it's no longer offered to guests

**Acceptance Criteria:**
- Soft delete (marks as unavailable)
- No longer appears in booking flow
- Historical booking data preserved

---

### 3.5 Booking Management

#### US-O-023: View All Bookings
**As a** property owner
**I want to** see all bookings across my properties
**So that** I can manage reservations

**Acceptance Criteria:**
- List of all bookings with filtering
- Filter by: property, status, date range
- Status tabs: All, Pending, Confirmed, Checked In, Completed, Cancelled
- Shows: guest name, property, lot, dates, status, total
- Pagination for long lists

---

#### US-O-024: View Booking Details (Owner)
**As a** property owner
**I want to** see full details of a booking
**So that** I can manage the reservation

**Acceptance Criteria:**
- Guest information: name, email, phone, avatar
- Booking details: dates, lot, guests, extras
- Payment status and amount
- Messages from guest
- Action buttons based on status

---

#### US-O-025: Confirm Booking
**As a** property owner
**I want to** confirm a pending booking
**So that** the guest's reservation is secured

**Acceptance Criteria:**
- Confirm button on pending bookings
- Confirmation triggers guest notification
- Booking status updates to Confirmed
- Payment captured if applicable

---

#### US-O-026: Cancel Booking (Owner)
**As a** property owner
**I want to** cancel a booking
**So that** I can handle unavailable situations

**Acceptance Criteria:**
- Cancel option with mandatory reason
- Refund processed automatically
- Guest notified of cancellation
- Dates become available again
- Cancellation logged for records

---

### 3.6 Calendar Management

#### US-O-027: View Availability Calendar
**As a** property owner
**I want to** see a calendar view of all my lots
**So that** I can visualize availability and bookings

**Acceptance Criteria:**
- Calendar grid with lots as rows, dates as columns
- Color coding: available, booked, blocked
- Click booking to view details
- Navigation between months
- Filter by property

---

#### US-O-028: Block Dates
**As a** property owner
**I want to** block dates on my calendar
**So that** I can mark periods unavailable for booking

**Acceptance Criteria:**
- Select date range and lot
- Add reason for blocking (maintenance, personal use, etc.)
- Blocked dates shown on calendar
- Prevents new bookings for those dates
- Can unblock dates

---

#### US-O-029: Set Custom Pricing by Date
**As a** property owner
**I want to** set different prices for specific dates
**So that** I can adjust for peak seasons or events

**Acceptance Criteria:**
- Select date range and lot
- Enter custom price per night
- Preview of affected dates
- Save pricing override
- Displays on calendar
- Reverts to default when override expires

---

### 3.7 Reviews Management

#### US-O-030: View Property Reviews
**As a** property owner
**I want to** see all reviews for my properties
**So that** I can monitor guest feedback

**Acceptance Criteria:**
- List of all reviews across properties
- Filter by property, rating, date
- Overall rating statistics
- Category rating breakdown

---

#### US-O-031: Respond to Review
**As a** property owner
**I want to** respond to a guest review
**So that** I can address feedback publicly

**Acceptance Criteria:**
- Reply option on each review
- Text input for response
- One response per review
- Response visible on public listing
- Professional tone guidelines shown
- Cannot edit response after posting

---

### 3.8 Offers Management (Owner)

#### US-O-032: View My Offers
**As a** property owner
**I want to** see all offers I've created
**So that** I can manage my promotions

**Acceptance Criteria:**
- List of owner's offers
- Shows: title, discount, category, validity, status
- Filter by active/expired

---

#### US-O-033: Create Offer
**As a** property owner
**I want to** create a promotional offer
**So that** I can attract more bookings

**Acceptance Criteria:**
- Form: title, description, discount amount/percentage
- Category selection
- Valid from/to dates
- Upload offer image
- Assign to properties
- Save as draft or publish

---

#### US-O-034: Edit Offer
**As a** property owner
**I want to** edit an existing offer
**So that** I can update promotion details

**Acceptance Criteria:**
- Edit all offer fields
- Cannot edit if offer has been redeemed (some restrictions)
- Save changes

---

#### US-O-035: Delete Offer
**As a** property owner
**I want to** delete an offer
**So that** I can remove expired or unwanted promotions

**Acceptance Criteria:**
- Delete option
- Warning confirmation
- Offer removed from public listings

---

### 3.9 Settings (Owner)

#### US-O-036: Configure Calendar Settings
**As a** property owner
**I want to** set up default calendar preferences
**So that** availability is managed consistently

**Acceptance Criteria:**
- Default check-in/check-out times
- Minimum advance booking requirement
- Maximum advance booking window
- Minimum/maximum stay lengths
- Instant booking vs. request to book

---

#### US-O-037: Configure Pricing Settings
**As a** property owner
**I want to** set pricing rules
**So that** rates are calculated correctly

**Acceptance Criteria:**
- Base pricing per lot type
- Weekend rate adjustments
- Seasonal rate multipliers
- Last-minute discount options
- Long-stay discounts

---

#### US-O-038: Configure Bank/Payout Settings
**As a** property owner
**I want to** set up my payout information
**So that** I receive earnings from bookings

**Acceptance Criteria:**
- Bank account details entry
- Account verification process
- Tax information entry
- Payout currency selection

---

#### US-O-039: Configure Payout Schedule
**As a** property owner
**I want to** choose my payout frequency
**So that** I receive payments on my preferred schedule

**Acceptance Criteria:**
- Options: weekly, bi-weekly, monthly
- Minimum payout threshold
- View upcoming payouts
- Payout history

---

#### US-O-040: Configure Tax Settings
**As a** property owner
**I want to** set up tax collection
**So that** appropriate taxes are collected from guests

**Acceptance Criteria:**
- VAT/tax registration status
- Tax rate configuration
- Tax included vs. added to price
- Tax reporting requirements info

---

#### US-O-041: Manage Team Access
**As a** property owner
**I want to** add team members to help manage properties
**So that** I can delegate tasks

**Acceptance Criteria:**
- Invite team members by email
- Assign roles/permissions
- View team member list
- Remove team members
- Activity log per team member

---

---

## 4. Supplier Stories

Suppliers are local businesses that can create offers and display on the map.

### 4.1 Dashboard

#### US-S-001: View Supplier Dashboard
**As a** supplier
**I want to** see my business dashboard
**So that** I can monitor my presence on the platform

**Acceptance Criteria:**
- Overview statistics: offer views, redemptions
- Active offers count
- Profile completion status
- Quick links to manage offers and profile

---

### 4.2 Business Profile

#### US-S-002: View Business Profile
**As a** supplier
**I want to** see my business profile
**So that** I can review how my business appears to users

**Acceptance Criteria:**
- View all profile information
- Preview as public listing
- Completion percentage indicator

---

#### US-S-003: Edit Business Profile
**As a** supplier
**I want to** update my business profile
**So that** information stays current

**Acceptance Criteria:**
- Edit: business name, description, category, location, contact info
- Upload/change logo
- Update operating hours
- Set Eircode and coordinates
- Save with confirmation

---

#### US-S-004: Upload Business Logo
**As a** supplier
**I want to** upload my business logo
**So that** my brand is visible on listings

**Acceptance Criteria:**
- Image upload interface
- Format requirements (JPEG, PNG)
- Size/dimension requirements
- Crop/resize tool
- Preview before save

---

### 4.3 Offer Management

#### US-S-005: View My Offers (Supplier)
**As a** supplier
**I want to** see all my offers
**So that** I can manage my promotions

**Acceptance Criteria:**
- List of all supplier's offers
- Status: Active, Expired, Draft
- Performance metrics if available
- Filter and sort options

---

#### US-S-006: Create Offer (Supplier)
**As a** supplier
**I want to** create a new offer
**So that** I can attract camping guests to my business

**Acceptance Criteria:**
- Form: title, description, discount
- Category: Food, Activities, Gear, Attractions, Transport
- Validity period
- Upload offer image
- Location (defaults to business location)
- Redemption instructions

---

#### US-S-007: Edit Offer (Supplier)
**As a** supplier
**I want to** edit an offer
**So that** I can update promotion details

**Acceptance Criteria:**
- Edit all offer fields
- Extend validity dates
- Update discount amount
- Change category

---

#### US-S-008: Delete Offer (Supplier)
**As a** supplier
**I want to** delete an offer
**So that** I can remove old promotions

**Acceptance Criteria:**
- Delete confirmation
- Offer removed from public view
- Historical data preserved for analytics

---

---

## 5. System/Technical Stories

These stories cover cross-cutting concerns, infrastructure, and system features.

### 5.1 Authentication & Security

#### US-T-001: JWT Token Management
**As the** system
**I want to** manage JWT tokens for authentication
**So that** users have secure, stateless sessions

**Acceptance Criteria:**
- Access token issued on login with short expiry
- Refresh token issued for extended sessions
- Token refresh endpoint for expired access tokens
- Tokens invalidated on logout
- Secure token storage recommendations in app

---

#### US-T-002: Role-Based Access Control
**As the** system
**I want to** enforce role-based permissions
**So that** users only access appropriate features

**Acceptance Criteria:**
- Roles: GUEST (unauthenticated), USER, OWNER, SUPPLIER
- Protected routes require authentication
- Owner routes require OWNER role
- Supplier routes require SUPPLIER role
- API endpoints enforce role checks

---

#### US-T-003: Account Security - Lockout
**As the** system
**I want to** lock accounts after failed login attempts
**So that** brute force attacks are prevented

**Acceptance Criteria:**
- Account locked after 5 failed attempts
- Lockout period of 30 minutes
- Account locked page shown
- Unlock via password reset
- Admin override available

---

#### US-T-004: Session Management
**As the** system
**I want to** manage user sessions appropriately
**So that** security and user experience are balanced

**Acceptance Criteria:**
- Session timeout after inactivity period
- Session expired page with re-login option
- Remember me extends session duration
- Single session or multi-session support configurable

---

### 5.2 Email Notifications

#### US-T-005: Booking Confirmation Email
**As the** system
**I want to** send booking confirmation emails
**So that** guests have written confirmation

**Acceptance Criteria:**
- Email sent on successful booking
- Contains: booking ID, property details, dates, total, check-in info
- Formatted email template
- Calendar attachment option

---

#### US-T-006: Booking Cancellation Email
**As the** system
**I want to** send cancellation emails
**So that** guests and hosts are notified of cancellations

**Acceptance Criteria:**
- Email to guest on cancellation
- Email to host on cancellation
- Contains: cancellation reason, refund amount, booking reference

---

#### US-T-007: Review Request Email
**As the** system
**I want to** send review request emails after checkout
**So that** guests are reminded to leave reviews

**Acceptance Criteria:**
- Email sent 1 day after checkout
- Contains link to review form
- Only sent for completed bookings
- Unsubscribe option

---

#### US-T-008: Password Reset Email
**As the** system
**I want to** send secure password reset emails
**So that** users can recover their accounts

**Acceptance Criteria:**
- Email contains secure, time-limited reset link
- Link expires after 24 hours
- Clear instructions in email
- Security warning about legitimate emails

---

### 5.3 Real-time Features

#### US-T-009: Push Notifications
**As the** system
**I want to** send push notifications to users
**So that** they receive timely updates

**Acceptance Criteria:**
- Push notifications for: new bookings, booking updates, messages, offers
- Respect user notification preferences
- Badge count updates
- Deep links to relevant content

---

#### US-T-010: Notification Events via Kafka
**As the** system
**I want to** process notification events asynchronously
**So that** notifications are delivered reliably

**Acceptance Criteria:**
- Events published to Kafka on triggering actions
- Notification listener processes events
- Email notifications triggered by events
- Push notifications triggered by events
- Retry logic for failed deliveries

---

### 5.4 File & Image Management

#### US-T-011: Image Upload to S3
**As the** system
**I want to** store images in S3
**So that** images are reliably stored and served

**Acceptance Criteria:**
- Images uploaded to LocalStack S3 (dev) or AWS S3 (prod)
- Automatic image optimization
- CDN integration for delivery
- Unique file naming to prevent conflicts
- Presigned URLs for uploads

---

#### US-T-012: Image Processing
**As the** system
**I want to** process uploaded images
**So that** they are optimized for web delivery

**Acceptance Criteria:**
- Resize to standard dimensions
- Generate thumbnails
- Compress for file size
- Maintain aspect ratio
- Support JPEG, PNG formats

---

### 5.5 Search & Discovery

#### US-T-013: Campsite Search Indexing
**As the** system
**I want to** efficiently index campsites for search
**So that** search results are fast and relevant

**Acceptance Criteria:**
- Full-text search on name, description, location
- Filter by facilities efficiently
- Sort by price, rating, distance
- Pagination support
- Relevance scoring

---

#### US-T-014: Map Bounding Box Queries
**As the** system
**I want to** query locations within map bounds
**So that** map views are populated efficiently

**Acceptance Criteria:**
- Query campsites within lat/lng bounds
- Query local businesses within bounds
- Efficient spatial indexing
- Marker clustering data for dense areas

---

### 5.6 Error Handling

#### US-T-015: Graceful Error Pages
**As the** system
**I want to** display friendly error pages
**So that** users understand and can recover from errors

**Acceptance Criteria:**
- 404 Not Found page with navigation options
- 500 Server Error page with support contact
- Network Error page with retry option
- Maintenance page with status information
- Consistent branding on all error pages

---

#### US-T-016: API Error Responses
**As the** system
**I want to** return consistent error responses
**So that** clients can handle errors appropriately

**Acceptance Criteria:**
- Consistent error response format (status, message, errors)
- Appropriate HTTP status codes
- Validation errors with field-level details
- No sensitive information in errors
- Localized error messages

---

### 5.7 Data Management

#### US-T-017: Database Migrations
**As the** system
**I want to** manage database schema via migrations
**So that** schema changes are version controlled

**Acceptance Criteria:**
- Flyway migrations for all schema changes
- Migrations run automatically on startup
- Rollback support where possible
- Migration versioning follows conventions
- Test data seeding via migrations

---

#### US-T-018: Soft Delete for Critical Data
**As the** system
**I want to** soft delete important records
**So that** data can be recovered if needed

**Acceptance Criteria:**
- Bookings, users, reviews use soft delete
- Deleted records excluded from normal queries
- Admin can restore soft-deleted records
- Hard delete available for compliance

---

### 5.8 Testing & Quality

#### US-T-019: Integration Testing
**As a** developer
**I want to** run integration tests
**So that** I can verify system behavior

**Acceptance Criteria:**
- Testcontainers for database tests
- API endpoint tests
- Authentication flow tests
- Booking flow tests
- Test coverage reporting

---

#### US-T-020: Test Data Seeding
**As a** developer
**I want to** seed test data reliably
**So that** I can test with consistent data

**Acceptance Criteria:**
- Demo accounts with known credentials
- Sample campsites across Ireland
- Sample bookings, reviews, offers
- Test data fixture classes
- Reset data between test runs

---

---

## Appendix: Priority Matrix

### P0 - Critical (Must Have for MVP)
- US-G-001 through US-G-009 (Discovery)
- US-G-018 through US-G-022 (Auth)
- US-U-001 through US-U-008 (Booking Flow)
- US-U-009 through US-U-015 (Booking Management)
- US-O-001 through US-O-012 (Property Management)
- US-O-023 through US-O-025 (Booking Management)

### P1 - High Priority
- US-G-010 through US-G-013 (Offers & Local Businesses)
- US-U-017 through US-U-019 (Favorites)
- US-U-020 through US-U-022 (Reviews)
- US-O-015 through US-O-022 (Lot & Extras Management)
- US-O-027 through US-O-029 (Calendar)
- US-S-001 through US-S-008 (Supplier Features)

### P2 - Medium Priority
- US-G-014 through US-G-017 (Support & Information)
- US-U-023 through US-U-031 (Profile & Settings)
- US-U-032 through US-U-035 (Support)
- US-O-030 through US-O-035 (Reviews & Offers)
- US-O-036 through US-O-041 (Owner Settings)

### P3 - Low Priority (Future Enhancements)
- US-U-036, US-U-037 (Role Upgrades)
- US-T-* (Technical stories - ongoing)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | Claude Code | Initial comprehensive user stories |

