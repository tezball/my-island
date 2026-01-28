# Marketplace Domain Analysis Findings

Analysis comparing `Event Storm.canvas` (Marketplace Context) with `USER_STORIES.md`.

## Summary
The Event Storm largely covers the core "Push Notification" and "Claim" flow, but lacks the specific "View" (Pull) mechanism described in the user stories.

## Findings

### 1. Missing "View Local Offers" Command
- **User Story**: "As a Guest, I want to view local offers and experiences."
- **Event Storm**: The current model focuses on a **Push** model:
    - Policy: `Find users within 30km radius` -> Command: `Send Push Notification`.
- **Gap**: There is no command or query modeled for a user *actively browsing* or fetching offers (e.g., `View Offers`, `Search Marketplace`).

### 2. Supplier Profile Creation
- **User Story**: "As a Supplier, I want to create a profile for my business."
- **Event Storm**:
    - **Marketplace Context**: No profile management commands.
    - **Identity Context**: Includes `Register` and `Update Profile`.
- **Finding**: We need to clarify if "Supplier Profile" requires a distinct aggregate in the Marketplace context or if the Identity context's User/Profile is sufficient. The User Stories imply a specific business profile.

### 3. Radius Logic Alignment
- **User Story**: mentions "say 30 km radius".
- **Event Storm**: Explicitly models `Policy: Find users within 30km radius`.
- **Status**: **Aligned**.

## Recommendations
1. Add `View Offers` or `Browse Marketplace` command/query to the Event Storm.
2. Clarify Supplier Account vs User Account in Identity/Marketplace boundaries.
