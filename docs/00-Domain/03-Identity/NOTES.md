# Identity Context Notes

## Purpose
User authentication, profiles, and preferences.

## Aggregates

### User Aggregate (Root)
```
User (Root)
├── NotificationPreferences (Value Object)
├── LinkedAccount[] (Entity)
├── Supplier (Entity, optional)
└── Favorite[] (Entity)
```

#### Entities

**User**
- `id`: UUID
- `email`: String (Unique)
- `name`: String
- `avatar`: String
- `isOwner`: Boolean
- `isSupplier`: Boolean
- `notificationPreferences`: NotificationPreferences

**LinkedAccount**
- `provider`: SocialProvider (GOOGLE, APPLE, FACEBOOK)
- `email`: String
- `connected`: Boolean

## Business Rules

### User Rules
1. **Unique Email**: No two users can share the same email
2. **Role Independence**: A user can be both Owner and Supplier simultaneously
3. **Linked Account Constraint**: One linked account per provider per user

## Invariants
- At most one `LinkedAccount` per `SocialProvider`
- `NotificationPreferences` must never be null
