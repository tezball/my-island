# Identity Context Notes

## Purpose
User authentication, profiles, and preferences.

## User Types

The system supports 3 user types: **Guest**, **Owner**, and **Supplier**. Users can hold multiple roles simultaneously using boolean flags.

### Multi-Role Capability

| Flag | Default | Description |
|------|---------|-------------|
| `isOwner` | `false` | Can manage campsites and lots |
| `isSupplier` | `false` | Can manage supplier offers |

### Role Combinations
- **Guest only**: Base user (default) - can browse, book, claim offers
- **Owner**: Guest + `isOwner=true` - can manage campsites and lots
- **Supplier**: Guest + `isSupplier=true` - can manage supplier offers
- **Owner + Supplier**: Both flags true - runs campsite AND local business

---

## Aggregates

### User Aggregate (Root)
```
User (Root)
├── NotificationPreferences (Value Object)
├── LinkedAccount[] (Entity)
└── Favorite[] (Entity)
```

#### Entities

**User**
- `id`: UUID
- `email`: String (Unique)
- `name`: String
- `avatar`: String
- `role`: UserRole (GUEST, OWNER, SUPPLIER)
- `isOwner`: Boolean
- `isSupplier`: Boolean
- `notificationPreferences`: NotificationPreferences

**LinkedAccount**
- `provider`: SocialProvider (GOOGLE, APPLE, FACEBOOK)
- `email`: String
- `connected`: Boolean

---

## User Account vs Supplier Account

### Clarification

The system uses a **single User entity** with role flags, not separate account types:

| Concept | Implementation | Description |
|---------|---------------|-------------|
| **User Account** | `User` entity | Base account for all users (guests, owners, suppliers) |
| **Supplier Account** | `User` with `isSupplier=true` | A user who has enabled supplier capabilities |

### How It Works

1. **All users start as Guests**: When a user registers, they get a base `User` account
2. **Supplier is a role, not a separate account**: Setting `isSupplier=true` grants access to the Supplier Dashboard
3. **Supplier profile lives in Marketplace Context**: The `Supplier` entity (business name, description, logo) is owned by the Marketplace bounded context, linked via `userId`

### Boundary Ownership

| Context | Owns | Responsibility |
|---------|------|----------------|
| **Identity** | `User`, `LinkedAccount`, `NotificationPreferences` | Authentication, profile, preferences |
| **Marketplace** | `Supplier`, `Offer` | Business profile, offers, redemptions |

### Cross-Context Relationship

```
Identity Context                    Marketplace Context
┌─────────────────┐                ┌─────────────────┐
│      User       │                │    Supplier     │
│  ─────────────  │    userId      │  ─────────────  │
│  isSupplier: T  │◄───────────────│  businessName   │
│                 │                │  description    │
└─────────────────┘                │  logo           │
                                   │  offers[]       │
                                   └─────────────────┘
```

- **Identity Context** determines *who can act as a supplier* (`isSupplier` flag)
- **Marketplace Context** stores *supplier business details* (`Supplier` entity)
- When `isSupplier=true`, the user can create/manage their `Supplier` profile in Marketplace

---

## Business Rules

### User Rules
1. **Unique Email**: No two users can share the same email
2. **Role Independence**: A user can be both Owner and Supplier simultaneously
3. **Linked Account Constraint**: One linked account per provider per user
4. **Supplier Activation**: Setting `isSupplier=true` enables Supplier Dashboard access but requires a `Supplier` profile in Marketplace to publish offers

## Invariants
- At most one `LinkedAccount` per `SocialProvider`
- `NotificationPreferences` must never be null
- A user with `isSupplier=false` cannot have an associated `Supplier` profile
