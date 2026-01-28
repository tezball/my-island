# PM/Owner Review: Nore Valley Park

**Reviewer Role:** Product Manager & Campsite Owner (Nore Valley Park)
**Date:** January 2026
**App Version:** Development (localhost:5173)

---

## Executive Summary

Reviewed the My Island app from the perspective of a campsite owner (Nore Valley Park). The app has solid foundations for both guest-facing booking and owner management, but several key features are missing that would make it production-ready for campsite owners.

---

## Feature Requests (Owner Wishlist)

### High Priority

1. **Calendar/Availability View**
   - Need a visual calendar showing all lots and their bookings
   - See at a glance which spots are booked, available, or blocked
   - Ability to block dates for maintenance or personal use

2. **Check-in/Check-out Management**
   - Mark guests as "checked in" when they arrive
   - Mark bookings as "completed" when guests leave
   - Currently only see confirmed/cancelled - no workflow for actual stay

3. **Booking Modification by Owner**
   - Ability to extend a guest's stay
   - Move guest to different lot if needed
   - Add extras (electric hookup) after booking

4. **Financial Reporting**
   - Revenue by date range (weekly, monthly, yearly)
   - Revenue by accommodation type
   - Export to CSV/Excel for accountant
   - Breakdown of extras revenue vs base rate

5. **Guest Communication**
   - Send pre-arrival information (directions, rules, check-in time)
   - In-app messaging with guests
   - Automated reminders before check-in/check-out

### Medium Priority

6. **Seasonal Pricing**
   - Set different prices for peak/off-peak seasons
   - Weekend vs weekday pricing
   - Special event pricing (bank holidays, festivals)

7. **Discount Codes/Promotions**
   - Create promotional codes for marketing
   - Returning guest discounts
   - Long-stay discounts (e.g., 7+ nights = 10% off)

8. **Multi-image Gallery per Lot**
   - Currently only one image URL per lot
   - Need gallery of 5-10 images to showcase each accommodation

9. **Reviews Management**
   - View and respond to guest reviews
   - Flag inappropriate reviews
   - Showcase best reviews on campsite page

10. **Notification Center**
    - Real-time alerts for new bookings
    - Cancellation notifications
    - Low availability warnings

### Low Priority (Nice to Have)

11. **Staff Accounts**
    - Create sub-accounts for employees
    - Different permission levels (view-only, check-in only, full access)

12. **Maintenance Tracking**
    - Log maintenance issues per lot
    - Schedule recurring maintenance

13. **Analytics Dashboard**
    - Booking trends over time
    - Popular accommodation types
    - Guest demographics

14. **Integration with Channel Managers**
    - Sync availability with Booking.com, Airbnb, etc.
    - Prevent double bookings

15. **Mobile App for Owners**
    - Quick check-in from phone
    - Push notifications for bookings

---

## Bugs to Fix (16 total)

### Critical

1. **Hero Image Shows "NV" Placeholder**
   - Location: Campsite details page (`/campsite/nore-valley-owner`)
   - The hero background shows "NV" letters instead of actual campsite photo
   - Owner should be able to upload a proper banner image

2. **No Check-in/Check-out Actions on Bookings**
   - Location: Admin > Bookings page
   - Only shows "cancel" action - no way to mark guests as arrived or departed
   - This is essential for day-to-day operations

### High

3. **Booking Page Shows Individual Lot Name, Not Type**
   - Location: Booking modal
   - When clicking "Book Now" on Tent Spots, modal shows "Book Scenic Tent Spot"
   - Should show "Book Tent Spot" since user doesn't choose specific lot
   - Confusing UX - guest thinks they're booking that exact spot

4. **"1 spots available" Grammar**
   - Location: Campsite details page, Search results
   - Should be "1 spot available" (singular)
   - Shows "1 spots available" for Caravan/RV Pitches

5. **No Pagination on Bookings List**
   - Location: Admin > Bookings page
   - All bookings shown in one long list
   - Will become unusable as bookings grow

6. **No Search/Filter on Bookings Page**
   - Location: Admin > Bookings page
   - Can't search by guest name or filter by date range
   - Makes finding specific bookings difficult

### Medium

7. **Campsite Settings Missing Key Fields**
   - Location: Admin > Settings
   - Missing: campsite address, GPS coordinates, check-in/check-out times
   - Missing: cancellation policy settings
   - Missing: banner/hero image upload

8. **No Bulk Actions for Lots**
   - Location: Admin > Lots & Campsites
   - Checkboxes exist but no bulk action buttons
   - Should be able to: bulk enable/disable, bulk price change

9. **Price Shown as "From €25" but Booking Says €30**
   - Location: Search results vs Booking modal
   - Search shows "From €25/night" for Tent Spots
   - Clicking Book on campsite page shows "€30 per night"
   - Price inconsistency confuses guests

10. **Saved Items Don't Show Price Correctly**
    - Location: Saved page
    - Shows €30/night for "Scenic Tent Spot"
    - But this is showing individual lot, not grouped type

### High

11. **Test User Dropdown Doesn't Auto-Fill**
    - Location: Sign-in page (`/signin`)
    - The "TEST USERS (AUTO-FILL)" dropdown doesn't actually fill in credentials
    - User must manually type email and password after selecting
    - Defeats the purpose of having a quick-select dropdown

### Low

12. **Admin Portal Label Inconsistency**
    - Profile page says "Admin Portal - Manage bookings & lots"
    - Actual sidebar says "Lots & Campsites"
    - Should be consistent terminology

13. **No Loading State on Lot Edit Save**
    - Location: Admin > Lots > Edit modal
    - "Save Changes" button doesn't show loading state
    - User doesn't know if save is in progress

14. **Date Format Inconsistency**
    - Admin bookings: DD/MM/YYYY format
    - Settings joined date: D/M/YYYY format
    - Should be consistent throughout

15. **No Confirmation Before Delete**
    - Location: Admin > Lots (delete icon)
    - Clicking delete icon should confirm before deleting
    - Accidental deletion risk

16. **Sidebar "Overview" Text in Header**
    - Location: Admin portal header
    - Shows "Overview" on all pages, not current page name
    - Should show "Bookings", "Settings", etc. based on current page

---

## UX Improvements

1. **Quick Stats on Dashboard**
   - Add "Today's Check-ins" and "Today's Check-outs" counts
   - Show "Pending" bookings that need confirmation

2. **Owner View of Own Campsite**
   - Quick link to see how campsite appears to guests
   - "Preview as Guest" button

3. **Booking Details Expansion**
   - Click on booking row to expand and see full details
   - Don't require navigation to separate page

4. **Search from Header**
   - Owner should be able to search bookings from any admin page
   - Global search in header

5. **Recent Activity Feed**
   - Show recent bookings, cancellations, reviews
   - Chronological activity log

---

## What's Working Well

- Clean, modern UI design
- Good grouping of lots by accommodation type
- Booking modal is simple and clear
- Admin sidebar navigation is intuitive
- KPI cards on dashboard are helpful
- Lot editing modal has all basic fields needed
- Search filters and sorting work correctly
- Saved functionality works across sessions

---

## Recommended Priority Order

1. Add check-in/check-out workflow (Critical for operations)
2. Fix hero image upload for campsite
3. Add calendar/availability view
4. Fix "1 spots" grammar issue
5. Add booking search and filters
6. Add financial reporting basics
7. Implement seasonal pricing
8. Add guest messaging

---

*This review represents the perspective of a campsite owner managing Nore Valley Park with 34 lots across 4 accommodation types.*
