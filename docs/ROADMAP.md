# Owner Portal Roadmap

## Current State

After a full review of every owner portal page and the supporting codebase, here is what exists today:

| Page | What It Does |
|------|-------------|
| **Dashboard** | 4 stat cards (lots, bookings, revenue, occupancy) with drill-down modals, quick actions, upcoming check-ins/outs, recent bookings table |
| **My Lots** | Card grid of all lots with type/availability filters, add/edit lot modal with images, amenities, pricing |
| **Bookings** | Flat list of all bookings with status filter tabs (All/Confirmed/Pending/Cancelled), confirm/cancel actions |
| **Calendar** | Monthly grid with booking dots, lot filter dropdown, day detail panel with confirm/reject |
| **Property Details** | Read-only view of property name, location, description, contact info, with edit button |
| **Settings** | Notification toggles, featured promotion purchase, billing/subscription, booking preferences (instant booking, same-day, guest verification), Stripe Connect payout onboarding |

The portal handles online guest bookings and basic lot management, but lacks the tools a large campsite (50-100+ lots, multiple staff) needs to run day-to-day operations.

---

## Discovery Interview

**Simulated PO interview with Seamus, owner of "Atlantic Ridge Park" (80 lots, 5 types)**

**PO: Walk me through a typical Monday morning for you.**

> *Seamus: I come in, check the phone bookings my night staff took, look at who's arriving today, and figure out which pitches are free. Right now I'm switching between a paper diary, a WhatsApp group with my team, and your app. The app shows me bookings that came through the website, but I've no way to put in the phone bookings. So I'm running two systems.*

**PO: When someone rings you directly, what happens?**

> *Seamus: My receptionist answers, checks availability on the paper diary, takes the name and dates, and pencils them in. Then I have to remember to block those dates on the app so I don't get double-booked. Half the time I forget, and we end up with two families turning up for the same pitch.*

**PO: What about pricing -- is it the same all year?**

> *Seamus: Not at all. We charge 25 for a tent pitch in shoulder season, but 40 in July/August. Bank holiday weekends are 50. Glamping pods are 85 normally but 120 in summer. Right now the app only lets me set one price per lot, so I'm stuck putting in the low season price and losing money in peak, or the high price and scaring people off in winter.*

**PO: How do you manage your staff?**

> *Seamus: I have 3 reception staff and 2 groundskeepers. The reception girls need to see the bookings and check people in. The groundskeeper needs to know which lots need cleaning after checkout. Right now only I can log into the owner portal -- there's no way to give them access without giving them my password.*

**PO: What about when guests arrive?**

> *Seamus: We walk them to their pitch, give them a map, tell them about the farm shop and playground. There's no check-in button on the app, so I've no way to track who's actually on-site versus who just has a booking. Same for checkout -- I don't know they've left until the groundskeeper tells me the pitch is empty.*

**PO: Do you ever need to block dates?**

> *Seamus: All the time. We close the lower field for maintenance in March. We hold 5 pitches for a scout group every June. Sometimes I need to block a single pitch because there's a broken water hookup. Can't do any of that on the app.*

**PO: What about guest communication after booking?**

> *Seamus: I email them manually with directions, check-in time, what to bring. Would be great if the system sent that automatically. And when they leave, I'd love to ask for a review -- word of mouth is everything in this business.*

**PO: Anything else on your wish list?**

> *Seamus: Minimum stay rules -- I don't want 1-night bookings on glamping pods, it's not worth the turnover. Group discounts for large bookings. And honestly, a simple way to see "what's free this weekend" at a glance -- the calendar dots are OK but I need a grid showing all lots across the week.*

---

## Feature List

### 1. Staff & Direct Bookings

| # | Feature | Description |
|---|---------|-------------|
| 1.1 | **Manual booking creation** | Owner/staff can create a booking directly -- select lot, dates, guest name, phone/email, number of guests, payment method (cash/card/invoice). Marks lot as occupied without online payment flow. |
| 1.2 | **Walk-in / phone booking flag** | Tag bookings as "direct" vs "online" so reporting separates channel sources. |
| 1.3 | **Staff accounts** | Invite team members by email with role-based permissions: *Manager* (full access), *Receptionist* (view/create bookings, check-in/out), *Groundskeeper* (view-only: lot status, cleaning tasks). |
| 1.4 | **Activity log** | Track who did what -- "Sarah confirmed booking #234", "Mike created walk-in for Pitch 5". |

### 2. Check-in / Check-out Workflow

| # | Feature | Description |
|---|---------|-------------|
| 2.1 | **Check-in action** | Button on booking card to mark guest as arrived. Updates lot status to "occupied". Timestamp recorded. |
| 2.2 | **Check-out action** | Mark guest as departed. Triggers lot status change to "needs cleaning" or "available". |
| 2.3 | **Lot status lifecycle** | Available -> Booked -> Checked-in -> Checked-out -> Cleaning -> Available. Visual on calendar/lot grid. |
| 2.4 | **Today's arrivals/departures view** | Dedicated list showing just today's movements, sorted by time, with one-tap check-in/out buttons. |

### 3. Date Blocking & Availability Control

| # | Feature | Description |
|---|---------|-------------|
| 3.1 | **Block dates on a lot** | Owner selects a lot and date range to mark as unavailable, with a reason (maintenance, private hold, seasonal closure). |
| 3.2 | **Bulk block** | Select multiple lots at once (e.g., "all tent pitches") and block a date range. |
| 3.3 | **Recurring blocks** | Set annual recurring blocks (e.g., "lower field closed every March"). |
| 3.4 | **Hold/reserve** | Tentatively hold a lot for a phone enquiry with auto-release after 24/48 hours if not confirmed. |

### 4. Seasonal & Dynamic Pricing

| # | Feature | Description |
|---|---------|-------------|
| 4.1 | **Seasonal pricing rules** | Define date ranges with multiplied or fixed prices per lot type (e.g., "July 1 - Aug 31: tent = 40/night"). |
| 4.2 | **Weekend/bank holiday surcharge** | Automatic price uplift for Fri/Sat nights or specified dates. |
| 4.3 | **Minimum stay rules** | Per lot type or per season (e.g., "glamping pods: 2-night minimum in summer, 3-night min bank holidays"). |
| 4.4 | **Last-minute discounts** | Auto-discount lots not booked within X days of the date. |
| 4.5 | **Long-stay discounts** | Percentage off for bookings over 7/14/28 nights. |

### 5. Guest Communication

| # | Feature | Description |
|---|---------|-------------|
| 5.1 | **Automated pre-arrival email** | Configurable template sent X days before check-in with directions, rules, what to bring. |
| 5.2 | **Post-stay review request** | Auto-email after checkout asking for a review/rating. |
| 5.3 | **In-app messaging** | Simple thread between owner/staff and guest, tied to a booking. |
| 5.4 | **SMS notifications** | Optional SMS alerts for booking confirmations and day-of-arrival reminders. |

### 6. Reviews & Ratings

| # | Feature | Description |
|---|---------|-------------|
| 6.1 | **Guest reviews** | Guests can leave a star rating (1-5) + text review after their stay. |
| 6.2 | **Owner response** | Owner can reply publicly to reviews. |
| 6.3 | **Review moderation** | Flag/report inappropriate reviews. |
| 6.4 | **Aggregate rating display** | Show average rating on public campsite profile page. |

### 7. Enhanced Calendar & Availability View

| # | Feature | Description |
|---|---------|-------------|
| 7.1 | **Multi-lot timeline view** | Gantt-style horizontal timeline with lots as rows, bookings as bars. At-a-glance view of "what's free this weekend" across all 80 lots. |
| 7.2 | **Drag-to-block** | Click and drag on the timeline to create a block or booking directly. |
| 7.3 | **Color coding by status** | Booked (green), checked-in (blue), blocked (gray), needs-cleaning (orange), available (white). |
| 7.4 | **Week/month toggle** | Switch between week view (detailed) and month view (overview). |

### 8. Operational Extras

| # | Feature | Description |
|---|---------|-------------|
| 8.1 | **Cleaning task list** | Auto-generated list of lots that checked out today and need turnover. Groundskeeper marks as "cleaned". |
| 8.2 | **Guest notes** | Internal notes on a booking visible only to staff (e.g., "guest requested quiet pitch", "late arrival after 9pm"). |
| 8.3 | **Booking modifications** | Change dates or move a guest to a different lot without cancelling and rebooking. |
| 8.4 | **Group bookings** | Book multiple lots under one reservation (e.g., scout group booking 5 tent pitches). |
| 8.5 | **Waitlist** | When a lot type is fully booked, guests can join a waitlist and get notified on cancellation. |
| 8.6 | **Export/reports** | Download bookings as CSV for accounting. Monthly revenue report PDF. |

---

## Implementation Phases

### Phase 1 -- Eliminate the Paper Diary

Core features that remove the need for a parallel paper system. Highest operational impact.

| # | Feature | Category |
|---|---------|----------|
| 1.1 | Manual booking creation | Staff & Direct Bookings |
| 3.1 | Block dates on a lot | Date Blocking |
| 2.1 | Check-in action | Check-in/Check-out |
| 2.2 | Check-out action | Check-in/Check-out |
| 4.1 | Seasonal pricing rules | Pricing |

### Phase 2 -- Empower the Team

Multi-user access and operational views that let staff work independently.

| # | Feature | Category |
|---|---------|----------|
| 1.3 | Staff accounts with roles | Staff & Direct Bookings |
| 2.4 | Today's arrivals/departures view | Check-in/Check-out |
| 8.1 | Cleaning task list | Operational Extras |
| 7.1 | Multi-lot timeline view | Calendar |

### Phase 3 -- Grow the Business

Guest engagement, advanced rules, and features that drive more bookings.

| # | Feature | Category |
|---|---------|----------|
| 5.1 | Automated pre-arrival email | Guest Communication |
| 6.1 | Guest reviews | Reviews & Ratings |
| 4.3 | Minimum stay rules | Pricing |
| 8.4 | Group bookings | Operational Extras |
