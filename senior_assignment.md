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


PS D:\Testing\nest js\nest-js-auth\nestjs-auth> ssh-keygen -t ed25519 -C "pavankumarkn715@gmail.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/c/Users/PAVAN KUMAR/.ssh/id_ed25519): github_ssh
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Passphrases do not match.  Try again.
Enter passphrase (empty for no passphrase):
Enter same passphrase again: 
Your identification has been saved in github_ssh
Your public key has been saved in github_ssh.pub
The key fingerprint is:
SHA256:B8Ow3UhxQPYCon5Ee8ttD9jlDw5bIri9kiXrd5Lm1SU pavankumarkn715@gmail.com
The key's randomart image is:
+--[ED25519 256]--+
|    o o.*o.      |
|   o o O =       |
|  . o o B +      | 
| . . + = *       |
|  . o = S E .    |
|   ..o.o @ =     |
|    .=..o + .    |
|    + =o.        |
|   ..=oo         |
+----[SHA256]-----+