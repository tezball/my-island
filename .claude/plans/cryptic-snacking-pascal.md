# Plan: Content & Image Moderation for Admin Portal

## Context

The admin portal needs content moderation to ensure all public-facing text is family-friendly and images can be reviewed. Currently, only reviews have AI moderation (via `ReviewModerationService` + Ollama). This plan extends moderation to all user-generated public text (lots, offers, profiles) and adds admin image flagging.

**User choices:**
- Text: Async queue (like reviews) — content saves as PENDING, hidden from public until AI/admin approves
- Images: Auto-approve + admin flag — images visible immediately, admin can flag/remove
- Scope: Public content only — not private booking messages

## Architecture Decisions

1. **No dual/pending fields** — When content is created or text fields updated, the entity's `contentModerationStatus` goes to PENDING. PENDING entities are filtered from public queries. This is simpler than storing pending+approved versions. The brief invisibility window (~5 min until scheduler runs) is acceptable.

2. **Reuse `Review.ModerationStatus`** — Lot, Offer, Owner, Supplier all reference `Review.ModerationStatus` (PENDING/APPROVED/REJECTED), same as `SupplierReview` already does.

3. **New `ContentModerationService`** in `shared/moderation/` — Generalizes the `ReviewModerationService` pattern with a business-content prompt. Same `Optional<ChatClient>` graceful degradation.

4. **Separate `CONTENT_MODERATION` feature toggle** — Independent of `REVIEW_AI_MODERATION`. When disabled, all content auto-APPROVED (current behavior).

5. **Owner/Supplier profiles** — When PENDING, the entity itself stays visible in listings (so their lots/offers remain accessible), but the `description` field returns `null` in public DTOs. Owner dashboard shows the actual description with a "Pending" badge.

---

## Database Migrations

### V1065__add_content_moderation_fields.sql (migration/)
```sql
ALTER TABLE lots ADD COLUMN content_moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE lots ADD COLUMN content_moderation_reason TEXT;
ALTER TABLE lots ADD COLUMN content_moderated_at TIMESTAMP;

ALTER TABLE offers ADD COLUMN content_moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE offers ADD COLUMN content_moderation_reason TEXT;
ALTER TABLE offers ADD COLUMN content_moderated_at TIMESTAMP;

ALTER TABLE owners ADD COLUMN content_moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE owners ADD COLUMN content_moderation_reason TEXT;
ALTER TABLE owners ADD COLUMN content_moderated_at TIMESTAMP;

ALTER TABLE suppliers ADD COLUMN content_moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE suppliers ADD COLUMN content_moderation_reason TEXT;
ALTER TABLE suppliers ADD COLUMN content_moderated_at TIMESTAMP;
```

### V1066__add_image_flagging_fields.sql (migration/)
```sql
ALTER TABLE entity_images ADD COLUMN is_flagged BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE entity_images ADD COLUMN flagged_reason TEXT;
ALTER TABLE entity_images ADD COLUMN flagged_at TIMESTAMP;
ALTER TABLE entity_images ADD COLUMN flagged_by BIGINT REFERENCES users(id);
```

### V1067__add_content_moderation_toggle.sql (migration/)
```sql
INSERT INTO feature_toggles (name, enabled, description, category)
VALUES ('CONTENT_MODERATION', false, 'When enabled, public text content requires AI moderation before public visibility', 'moderation');
```

### V1102__seed_content_moderation_toggle.sql (seed/)
```sql
UPDATE feature_toggles SET enabled = true WHERE name = 'CONTENT_MODERATION';
```

---

## Backend Changes

### 1. Feature Toggle (modify existing)
**`FeatureToggleService.java`** — Add `isContentModerationEnabled()` method

### 2. ContentModerationService (new)
**`shared/moderation/ContentModerationService.java`**
- Pattern: Copy `ReviewModerationService` (same `Optional<ChatClient>`, same `parseResponse`, same graceful degradation)
- Prompt: Business content moderation (spam, offensive language, misleading claims, unrelated to camping/tourism)
- Method: `moderate(String textContent, String contextLabel)` → `ModerationResult(boolean approved, String reason)`

### 3. ContentModerationScheduler (new)
**`shared/moderation/ContentModerationScheduler.java`**
- Pattern: Copy `ReviewModerationScheduler`
- `@Scheduled(fixedRate = 300000)` + `@SchedulerLock(name = "contentModeration")`
- Check `featureToggleService.isContentModerationEnabled()` at start, early return if disabled
- Query PENDING lots, offers, owners, suppliers from their repositories
- For each: concatenate text fields → call `ContentModerationService.moderate()` → update status
- Process max ~50 items per run to avoid timeouts

### 4. Entity Modifications (add 3 fields + getters/setters to each)

| Entity | File | Fields Added |
|--------|------|-------------|
| `Lot.java` | `modules/accommodation/entity/` | `contentModerationStatus`, `contentModerationReason`, `contentModeratedAt` |
| `Offer.java` | `modules/marketplace/entity/` | Same 3 fields |
| `Owner.java` | `modules/accommodation/entity/` | Same 3 fields |
| `Supplier.java` | `modules/marketplace/entity/` | Same 3 fields |
| `EntityImage.java` | `shared/storage/` | `isFlagged`, `flaggedReason`, `flaggedAt`, `flaggedBy` |

All use `@Enumerated(EnumType.STRING)` referencing `Review.ModerationStatus` and default to `APPROVED`.

### 5. Repository Additions

| Repository | Addition |
|-----------|----------|
| `LotRepository` | `findByContentModerationStatus(status)`, modify public queries to filter APPROVED |
| `OfferRepository` | `findByContentModerationStatus(status)`, add `AND o.contentModerationStatus = 'APPROVED'` to `findAvailableOffers` |
| `OwnerRepository` | `findByContentModerationStatus(status)` |
| `SupplierRepository` | `findByContentModerationStatus(status)` |
| `EntityImageRepository` | `findByIsFlaggedTrue()`, `countByIsFlaggedTrue()`, public query variant excluding flagged |

### 6. Service Layer Changes

**`OwnerService.java`** (lots + profile):
- `createLot()`: If content moderation enabled → set `PENDING`
- `updateLot()`: If text fields changed and content moderation enabled → set `PENDING`
- `updateOwnerProfile()`: If description/propertyName changed → set `PENDING`

**`SupplierService.java`** (offers + profile):
- `createOffer()`: If content moderation enabled → set `PENDING`
- `updateOffer()`: If text fields changed → set `PENDING`
- `updateSupplierProfile()`: If description/businessName changed → set `PENDING`

**`CampsiteService.java`** (public queries):
- `getCampsiteLots()`: Filter to APPROVED lots only (when toggle enabled)
- `getAvailableLots()`: Same filter
- `getAllCampsites()` / `getCampsiteById()`: Owner entities stay visible; DTO mapping hides description when PENDING

**`EntityImageService.java`**:
- Add `getPublicImages()` method that excludes flagged images
- Public-facing callers use this; admin/owner callers use existing `getImages()`

### 7. DTO Changes

**`LotDto`**: Add `String contentModerationStatus` field. `from()` method includes it.
**`OfferDto`**: Add `String contentModerationStatus` field.
**`OwnerDto`**: Add `String contentModerationStatus` field. Public variant sets `description=null` when PENDING.
**`SupplierDto`**: Add `String contentModerationStatus` field. Public variant sets `description=null` when PENDING.

### 8. Admin Content Moderation Backend (new)

**`AdminContentModerationService.java`** (`modules/admin/service/`)
- Pattern: Copy `AdminReviewService`
- `listPendingContent(page, size)` → unified list of PENDING lots/offers/owners/suppliers as `List<Map<String, Object>>`
- `moderateContent(adminUserId, entityType, entityId, status, reason)` → manual approve/reject + audit log
- `aiModerateContent(adminUserId, entityType, entityId)` → rerun AI + audit log

**`AdminContentModerationController.java`** (`modules/admin/controller/`)
- `GET /admin/content-moderation` — list pending content (paginated, optional entityType filter)
- `PUT /admin/content-moderation/{entityType}/{id}/moderate` — manual approve/reject
- `POST /admin/content-moderation/{entityType}/{id}/ai-moderate` — rerun AI moderation

### 9. Admin Image Moderation Backend (new)

**`AdminImageModerationService.java`** (`modules/admin/service/`)
- `listImages(page, size, flaggedOnly, entityType)` → all images with entity context
- `flagImage(adminUserId, imageId, reason)` → set flagged + audit log
- `unflagImage(adminUserId, imageId)` → remove flag + audit log
- `deleteImage(adminUserId, imageId)` → delete file + record + audit log

**`AdminImageModerationController.java`** (`modules/admin/controller/`)
- `GET /admin/images` — list images (params: page, size, flaggedOnly, entityType)
- `PUT /admin/images/{id}/flag` — flag with reason
- `PUT /admin/images/{id}/unflag` — unflag
- `DELETE /admin/images/{id}` — delete image

---

## Frontend Changes

### 1. Types (`src/types/admin.ts`)
```typescript
export interface AdminContentItem {
  id: number;
  entityType: 'LOT' | 'OFFER' | 'OWNER' | 'SUPPLIER';
  entityId: number;
  entityName: string;
  ownerOrSupplierName: string;
  contentText: string; // concatenated text fields
  contentModerationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  contentModerationReason: string | null;
  createdAt: string;
}

export interface AdminImage {
  id: number;
  entityType: string;
  entityId: number;
  entityName: string;
  url: string;
  filename: string;
  isFlagged: boolean;
  flaggedReason: string | null;
  flaggedAt: string | null;
  createdAt: string;
}
```

### 2. Admin Service (`src/services/adminService.ts`)
Add `adminContentModerationService` and `adminImageModerationService` objects following the existing `adminReviewService` pattern (uses `apiRequest<T>()`).

### 3. Admin Content Moderation Page (new)
**`src/pages/admin/AdminContentModerationPage.tsx`**
- Pattern: Copy `AdminReviewsPage` structure
- Uses `AdminTable<AdminContentItem>` with columns: Entity Type badge, Entity Name, Content (truncated), Status badge, Reason, Actions (Approve/Reject/AI moderate)
- Tabs or filter pills for LOT/OFFER/OWNER/SUPPLIER
- `AdminConfirmModal` for approve/reject actions

### 4. Admin Image Moderation Page (new)
**`src/pages/admin/AdminImageModerationPage.tsx`**
- Grid layout of image cards (thumbnail + entity info + flag status)
- Filter toggle: "Flagged Only"
- Entity type filter pills
- Actions: Flag (with reason input), Unflag, Delete (with `AdminConfirmModal`)

### 5. Admin Layout & Routing
**`AdminLayout.tsx`**: Add nav links after "Reviews":
- `<AdminNavLink to="/admin/content-moderation" icon="verified_user" label="Content" />`
- `<AdminNavLink to="/admin/images" icon="image_search" label="Images" />`

**`AdminLayout.tsx` PAGE_TITLES**: Add entries for both new paths.

**`App.tsx`**: Add routes inside `/admin`:
```tsx
<Route path="content-moderation" element={<AdminContentModerationPage />} />
<Route path="images" element={<AdminImageModerationPage />} />
```

### 6. Owner/Supplier Dashboard Indicators
- Lot list: Show yellow "Pending Review" or red "Rejected" badge when `contentModerationStatus !== 'APPROVED'`
- Offer list: Same badges
- Profile page: Info banner "Your profile description is being reviewed" when owner/supplier status is PENDING

### 7. Frontend Lot/Offer Types
Add `contentModerationStatus?: string` to existing `Lot` and `Offer` types (optional since only present when toggle enabled).

---

## Files Summary

### New Files (12)
| File | Purpose |
|------|---------|
| `db/migration/V1065__add_content_moderation_fields.sql` | Moderation columns on lots/offers/owners/suppliers |
| `db/migration/V1066__add_image_flagging_fields.sql` | Flagging columns on entity_images |
| `db/migration/V1067__add_content_moderation_toggle.sql` | CONTENT_MODERATION feature toggle |
| `db/seed/V1102__seed_content_moderation_toggle.sql` | Enable toggle in dev |
| `shared/moderation/ContentModerationService.java` | AI text moderation (generalized) |
| `shared/moderation/ContentModerationScheduler.java` | Scheduled processor for PENDING content |
| `admin/service/AdminContentModerationService.java` | Admin content queue service |
| `admin/controller/AdminContentModerationController.java` | Admin content REST endpoints |
| `admin/service/AdminImageModerationService.java` | Admin image review service |
| `admin/controller/AdminImageModerationController.java` | Admin image REST endpoints |
| `pages/admin/AdminContentModerationPage.tsx` | Admin content moderation UI |
| `pages/admin/AdminImageModerationPage.tsx` | Admin image review UI |

### Modified Files (~20)
| File | Change |
|------|--------|
| `FeatureToggleService.java` | Add `isContentModerationEnabled()` |
| `Lot.java` | Add 3 moderation fields |
| `Offer.java` | Add 3 moderation fields |
| `Owner.java` | Add 3 moderation fields |
| `Supplier.java` | Add 3 moderation fields |
| `EntityImage.java` | Add 4 flagging fields |
| `LotRepository.java` | Add moderation queries |
| `OfferRepository.java` | Add moderation filter + queries |
| `OwnerRepository.java` | Add moderation query |
| `SupplierRepository.java` | Add moderation query |
| `EntityImageRepository.java` | Add flagging queries |
| `OwnerService.java` | Set PENDING on create/update lot & profile |
| `SupplierService.java` | Set PENDING on create/update offer & profile |
| `CampsiteService.java` | Filter PENDING lots from public queries |
| `EntityImageService.java` | Add `getPublicImages()` |
| `LotDto.java` | Add `contentModerationStatus` |
| `OwnerDto.java` | Add `contentModerationStatus`, hide description when PENDING |
| `OfferDto.java` | Add `contentModerationStatus` |
| `SupplierDto.java` | Add `contentModerationStatus`, hide description when PENDING |
| `AdminLayout.tsx` | Add nav links + page titles |
| `App.tsx` | Add admin routes |
| `adminService.ts` | Add content/image moderation services |
| `admin.ts` (types) | Add `AdminContentItem`, `AdminImage` |

### Documentation Updates
| File | Change |
|------|--------|
| `CLAUDE.md` | Add CONTENT_MODERATION toggle, new admin endpoints |
| `docs/domain/admin/README.md` | Document content + image moderation features |
| `docs/domain/accommodation/README.md` | Document content moderation on lots/owners |
| `docs/domain/marketplace/README.md` | Document content moderation on offers/suppliers |
| `docs/domain/DOMAIN_MODEL.md` | Add moderation status to entity diagrams |

---

## Implementation Order

1. **Migrations** (V1065, V1066, V1067) + seed (V1102)
2. **Feature toggle** method on `FeatureToggleService`
3. **Entity modifications** (Lot, Offer, Owner, Supplier, EntityImage)
4. **Repository queries**
5. **`ContentModerationService`** (new, in `shared/moderation/`)
6. **Service layer** (OwnerService, SupplierService, CampsiteService, EntityImageService)
7. **`ContentModerationScheduler`** (new)
8. **Admin backend** (content + image moderation services + controllers)
9. **DTO changes** (LotDto, OfferDto, OwnerDto, SupplierDto)
10. **Frontend types + admin services**
11. **Admin pages** (ContentModerationPage, ImageModerationPage)
12. **Admin layout + routing**
13. **Owner/Supplier dashboard badges**
14. **Documentation**

---

## Verification

1. **DB wipe**: `docker compose down -v && docker compose up -d` (new migrations + seed)
2. **Backend build**: `cd my-island-api && ./mvnw package -DskipTests`
3. **Frontend build**: `cd my-island-web && npm run build` (TypeScript checks pass)
4. **Test content moderation flow**:
   - Login as owner (norevalley@myisland.com) → create a new lot → see "Pending Review" badge
   - Visit campsite page as guest → new lot NOT visible
   - Wait 5 min (or trigger scheduler) → lot becomes APPROVED → visible publicly
   - Login as admin → see lot in Content Moderation queue → can approve/reject manually
5. **Test image flagging**:
   - Login as admin → navigate to Images page → see all uploaded images
   - Flag an image → it disappears from public campsite page
   - Unflag → it reappears
   - Delete → permanently removed
6. **Test feature toggle**:
   - Disable CONTENT_MODERATION toggle via admin → all new content auto-APPROVED
   - Re-enable → new content goes PENDING
7. **Test AI moderation** (requires Ollama running):
   - Create lot with profanity in description → scheduler should REJECT it
   - Create lot with normal text → scheduler should APPROVE it
