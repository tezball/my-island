# Product Roadmap

**Last Updated:** 2026-01-06

---

## Overview

This roadmap outlines the development phases for my-island, a camping/glamping booking platform for Ireland.

```
Current Status: MVP ~75% Complete
Target Launch: Q1 2026
```

---

## MVP (Current Phase)

**Goal:** Launch a functional booking platform with core features for guests and campsite owners.

### Completed Features

#### Guest Experience
- [x] Onboarding flow with benefits showcase
- [x] User registration & login (email, Google, Apple SSO)
- [x] Campsite discovery (list & map views)
- [x] Advanced search with filters (location, facilities, price)
- [x] Campsite detail pages with photo gallery
- [x] Booking wizard (dates → lot type → guests → extras → payment)
- [x] Booking management (view, modify dates/guests, cancel)
- [x] Favorites system
- [x] Review submission
- [x] Notification center
- [x] User profile management

#### Owner Portal
- [x] Dashboard with key metrics
- [x] Statistics & analytics page
- [x] Campsite management (CRUD)
- [x] Lot management (CRUD with pricing, capacity, images)
- [x] Extras management (firewood, bike rental, etc.)
- [x] Booking calendar view
- [x] Owner bookings list
- [x] Revenue dashboard
- [x] Offer/promotion management
- [x] Property creation wizard (Campsite & B&B types)

#### Supplier Portal
- [x] Supplier dashboard
- [x] Business profile management
- [x] Offers/deals management

#### Backend
- [x] 12 REST controllers with 55+ endpoints
- [x] JWT authentication with refresh tokens
- [x] PostgreSQL database with Flyway migrations
- [x] Kafka event streaming
- [x] LocalStack for S3 (images) and SES (emails)
- [x] Testcontainers for integration testing

### Remaining MVP Work

#### Critical
- [ ] Fix authentication flow (login API issues)
- [ ] Complete Stripe payment integration
- [ ] Fix image loading (S3/LocalStack configuration)
- [ ] End-to-end booking flow testing

#### High Priority
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Booking modification API (`PATCH /api/bookings/{id}`)

#### Medium Priority
- [ ] Map marker popup interactions
- [ ] Owner portal re-testing post auth fix
- [ ] Supplier portal verification

---

## Post-MVP Phase 1: Polish & Scale

**Timeline:** Q2 2026
**Goal:** Production hardening, performance, and user feedback integration.

### User Experience
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode for bookings/favorites
- [ ] Push notifications (mobile web)
- [ ] Dark mode refinements
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Multi-language support (Irish, German, French)

### Search & Discovery
- [ ] Elasticsearch integration for advanced search
- [ ] "Near me" with geolocation
- [ ] Search history & suggestions
- [ ] Recently viewed campsites
- [ ] Similar campsites recommendations

### Booking Enhancements
- [ ] Group bookings (multiple lots)
- [ ] Waitlist for fully booked dates
- [ ] Flexible date search ("cheapest in May")
- [ ] Last-minute deals section
- [ ] Gift vouchers

### Owner Tools
- [ ] Bulk pricing updates
- [ ] Seasonal pricing rules
- [ ] Automated pricing suggestions
- [ ] Occupancy forecasting
- [ ] Guest messaging system
- [ ] Check-in/check-out management

### Infrastructure
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Database read replicas
- [ ] API rate limiting
- [ ] Enhanced monitoring (Prometheus/Grafana)

---

## Post-MVP Phase 2: Growth Features

**Timeline:** Q3-Q4 2026
**Goal:** Expand platform capabilities and revenue streams.

### Mobile Apps
- [ ] React Native iOS app
- [ ] React Native Android app
- [ ] Shared component library
- [ ] Native push notifications
- [ ] Apple/Google Pay integration

### Social Features
- [ ] User profiles (public)
- [ ] Photo uploads in reviews
- [ ] "Helpful" voting on reviews
- [ ] Share campsite to social media
- [ ] Referral program

### Advanced Booking
- [ ] Multi-campsite trip planning
- [ ] Package deals (accommodation + activities)
- [ ] Equipment rental marketplace
- [ ] Experience/activity bookings
- [ ] Transportation add-ons

### Owner Growth
- [ ] Multi-property dashboard
- [ ] Staff accounts with permissions
- [ ] Channel manager (sync with Booking.com, Airbnb)
- [ ] Automated review responses (AI-assisted)
- [ ] Dynamic pricing engine

### Analytics & Insights
- [ ] Guest behavior analytics
- [ ] Revenue optimization suggestions
- [ ] Market comparison reports
- [ ] Demand forecasting

---

## Post-MVP Phase 3: Platform Expansion

**Timeline:** 2027
**Goal:** Become the definitive Irish outdoor accommodation platform.

### New Accommodation Types
- [ ] Holiday homes
- [ ] Caravan parks
- [ ] Hostels
- [ ] Farm stays
- [ ] Unique stays (treehouses, yurts, shepherds huts)

### B2B Features
- [ ] Corporate booking portal
- [ ] Travel agent partnerships
- [ ] Event/group booking system
- [ ] API for third-party integrations

### Community
- [ ] Campsite owner forum
- [ ] Guest community/blog
- [ ] User-generated content (tips, guides)
- [ ] Sustainability badges & certifications

### Advanced Infrastructure
- [ ] Kubernetes deployment
- [ ] Multi-region failover
- [ ] Real-time availability sync
- [ ] Machine learning recommendations

---

## Technical Debt & Maintenance

Ongoing items not tied to specific phases:

### Code Quality
- [ ] Increase test coverage to 80%+
- [ ] Component library documentation (Storybook)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Performance profiling & optimization

### Security
- [ ] Regular security audits
- [ ] GDPR compliance review
- [ ] PCI DSS compliance (payments)
- [ ] Penetration testing

### DevOps
- [ ] CI/CD pipeline improvements
- [ ] Blue-green deployments
- [ ] Automated database backups
- [ ] Disaster recovery testing

---

## Success Metrics

| Phase | Key Metrics |
|-------|-------------|
| MVP | 50 campsites listed, 100 bookings/month |
| Phase 1 | 200 campsites, 500 bookings/month, <2s page load |
| Phase 2 | 500 campsites, 2000 bookings/month, mobile app 10k downloads |
| Phase 3 | 1000+ properties, 5000 bookings/month, break-even |

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Payment provider issues | Multiple provider support (Stripe + backup) |
| Campsite owner adoption | Direct outreach, competitive commission rates |
| Seasonal demand fluctuation | Year-round marketing, winter glamping focus |
| Competition from Airbnb/Booking.com | Niche focus on Irish camping, local partnerships |

---

## How to Contribute

1. Check [[OUTSTANDING_WORK]] for current tasks
2. Review [[SNAG_LIST]] for bugs to fix
3. Discuss new features in GitHub Issues
4. Follow the [[02-Architecture/README|Architecture Guide]]
