# Authentication System Assignment

## Token Management

### What You Need to Do:

1. Add refresh token functionality.
2. Instead of creating a new table for access and refresh tokens, add these fields to the user schema.
3. Update the user table to include login and logout timestamps.

### Updated Database Schema

```prisma
model User {
    id              Int           @id @default(autoincrement())
    email           String        @unique
    password        String
    createdAt       DateTime      @default(now()) @map("created_at")
    updatedAt       DateTime      @updatedAt @map("updated_at")
    lastLoggedIn    DateTime?     
    lastLoggedOut   DateTime?
    refreshToken    String
    accessToken     String

    @@map("users")
}
```

### Logout Steps

- When a user logs out, delete both the access token and refresh token from the database.

## Role-Based Access Control

### User Roles:

1. **ADMIN** - Full access to the system.
2. **EMPLOYEE/STAFF** - Access depends on their department.
3. **CUSTOMER** - Limited access.

### Employee Access Rules:

- Access depends on the department (e.g., Sales, Engineering).
- Can only view data from other departments.
- Can access specific content for their own department.
