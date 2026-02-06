---
description: Verify Marketplace features (Supplier Offer -> Guest Claim -> Supplier Redeem)
---

1. Open Browser
   - Action: `open_browser`
   - URL: `http://localhost:5173/signin`

2. Login as Supplier
   - Action: Check credentials in `SignInPage.tsx` if needed.
   - Email: `info@aillweefarmshop.ie`
   - Password: `password`
   - Click "Sign In"
   - Verify URL is `http://localhost:5173/` (Home) or `http://localhost:5173/supplier`

3. Navigate to Supplier Dashboard
   - Action: Click "Switch to Supplier" (or navigate to `/supplier` if already in supplier mode)
   - Verify header says "Supplier Dashboard" or similar.

4. Create New Offer
   - Action: Click "New Offer" or "Create Offer"
   - Fill Title: "Test Offer [TIMESTAMP]"
   - Fill Description: "Automated test offer"
   - Fill Category: "Food & Drink"
   - Fill Discount: "20"
   - Click "Create" or "Publish"
   - Verify Offer appears in list.

5. Sign Out
   - Action: Click Profile -> Sign Out
   - Verify redirected to Home or Sign In.

6. Login as Guest
   - URL: `http://localhost:5173/signin`
   - Email: `family@example.com`
   - Password: `password`
   - Click "Sign In"

7. Browse Marketplace
   - Action: Navigate to `/marketplace`
   - Search/Find "Test Offer [TIMESTAMP]"
   - Click "View Deal"

8. Claim Offer
   - Action: Click "Claim Voucher" or "Get Deal"
   - Verify "Voucher Claimed" modal or toast appears.
   - Note the Claim Code if visible.

9. Sign Out Guest
   - Action: Click Profile -> Sign Out

10. Login as Supplier (Again)
    - URL: `http://localhost:5173/signin`
    - Email: `info@aillweefarmshop.ie`
    - Password: `password`
    - Click "Sign In"

11. Redeem Claim
    - Action: Navigate to `/supplier`
    - Find the Offer "Test Offer [TIMESTAMP]"
    - Click to view details
    - Find the claim from "Murphy Family"
    - Click "Redeem"
    - Confirm action
    - Verify status changes to "Redeemed"
