# NestJS Authentication System

A secure authentication system built with NestJS, Prisma, PostgreSQL, JWT, and bcrypt following clean architecture principles with proper TypeScript typing and validation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Database Configuration](#database-configuration)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Refresh Token Flow](#refresh-token-flow)
- [User Management](#user-management)
- [Security Measures](#security-measures)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Features

- User registration with email and password
- Login with JWT token generation
- Access and Refresh token system for enhanced security
- Logout functionality (JWT blacklisting and refresh token revocation)
- Protected routes with JWT authentication
- User profile management
- Password update with current password verification
- Password hashing with bcrypt
- Input validation with class-validator
- PostgreSQL database with Prisma ORM
- Clean architecture with proper separation of concerns

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Open-source relational database
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Library for password hashing
- **class-validator**: Decorator-based validation for classes
- **TypeScript**: Typed superset of JavaScript

## Project Structure

```
nestjs-auth/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-blacklist.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── token-blacklist.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── shared/
│   │   └── shared.module.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .gitignore
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env`:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nestjs_auth?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev --name init
```

6. Start the application:

```bash
npm run start:dev
```

## Database Configuration

The database schema is defined in `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at") 
  updatedAt DateTime @updatedAt @map("updated_at")
  refreshTokens RefreshToken[]
  accessTokens AccessToken[]

  @@map("users")
}

model BlacklistedToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("blacklisted_tokens")
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  revoked   Boolean  @default(false)

  @@map("refresh_tokens")
}

model AccessToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("access_tokens")
}
```

## Authentication Flow

1. **Registration**:
   - User submits email and password
   - Password is hashed using bcrypt
   - User is created in the database
   - User information (without password) is returned

2. **Login**:
   - User submits email and password
   - System verifies credentials
   - Access and refresh tokens are generated and stored in the database
   - Tokens and user information are returned

3. **Accessing Protected Routes**:
   - Client includes JWT token in Authorization header
   - JWT strategy validates the token and checks if it's blacklisted
   - If valid and not blacklisted, user information is attached to the request
   - If invalid or blacklisted, 401 Unauthorized response is returned

4. **Token Refresh**:
   - When access token expires, client sends refresh token
   - System validates refresh token and checks if it's revoked
   - If valid, old refresh token is revoked and new access/refresh tokens are issued
   - New tokens are returned to the client

5. **Logout**:
   - Client sends a request with the JWT token in the Authorization header
   - Access token is added to the blacklist in the database
   - Related refresh tokens are revoked
   - Subsequent requests with the same tokens are rejected

## API Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Refresh tokens

```
POST /auth/refresh
```

Request body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

#### Logout

```
POST /auth/logout
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "message": "Logout successful"
}
```

#### Get user profile (protected)

```
GET /auth/profile
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

### User Management

#### Get current user profile

```
GET /users/me
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update user profile

```
PATCH /users/me
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body (update email):
```json
{
  "email": "newemail@example.com"
}
```

Request body (update password):
```json
{
  "password": "newSecurePassword123",
  "currentPassword": "oldPassword123"
}
```

Response:
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Refresh Token Flow

This system implements a secure token refresh mechanism that follows best practices:

### How Refresh Tokens Work

1. **Token Issuance**:
   - When a user logs in, they receive both an access token and a refresh token
   - Access tokens are short-lived (default: 15 minutes) for security
   - Refresh tokens are long-lived (default: 7 days)
   - Both tokens are stored in the database for tracking and revocation

2. **Token Usage**:
   - Access tokens are used to authenticate API requests
   - When an access token expires, the client uses the refresh token to get new tokens

3. **Token Refresh Process**:
   - Client sends the refresh token to the `/auth/refresh` endpoint
   - Server validates the refresh token (checks if it exists and isn't revoked)
   - Old refresh token is revoked (marked as used)
   - New access and refresh tokens are generated and returned

4. **Token Rotation**:
   - The system implements token rotation for security
   - Each refresh token can only be used once
   - When a refresh token is used, it's revoked and a new one is issued
   - This prevents refresh token reuse attacks

5. **Token Revocation**:
   - On logout, both access tokens (via blacklisting) and refresh tokens are revoked
   - Access tokens are added to a blacklist
   - Refresh tokens are marked as revoked in the database

### Testing the Refresh Flow

1. Log in to get both tokens
2. Wait for access token to expire (set to 1 minute for testing)
3. Try to access a protected route - should return 401 Unauthorized
4. Call the refresh endpoint with the refresh token
5. Get new tokens and continue using the API

### Sample Flow with Short-Lived Tokens (for Testing)

```javascript
// 1. Login to get tokens
POST /auth/login
// Response contains:
// - accessToken (expires in 1 minute)
// - refreshToken

// 2. Use access token to access protected routes
GET /users/me
// Works for 1 minute

// 3. After 1 minute, access token expires
GET /users/me
// Returns 401 Unauthorized

// 4. Use refresh token to get new tokens
POST /auth/refresh
{
  "refreshToken": "your-refresh-token"
}
// Returns new accessToken and refreshToken

// 5. Use new access token to access protected routes
GET /users/me
// Works again
```

### Implementation Notes

- For production, set access token expiration to a reasonable value (e.g., 15 minutes)
- The refresh token mechanism allows maintaining session security while minimizing user disruption
- Implement proper error handling on the client side to handle token expiration gracefully

## User Management

The system includes comprehensive user management features:

1. **User Profile Retrieval**:
   - Users can fetch their profile information
   - User data is protected and only accessible with valid tokens

2. **User Profile Updates**:
   - Users can update their email address
   - Password updates require current password verification for security

3. **Secure Password Changes**:
   - When changing passwords, current password must be provided
   - New passwords are hashed before storage
   - Passwords are never returned in API responses

### User Controller Features

- **GET /users/me** - Retrieve the current user's profile
- **GET /users/:id** - Retrieve a specific user's profile (admin functionality)
- **PATCH /users/me** - Update the current user's profile

## Security Measures

1. **Password Security**:
   - Passwords are hashed using bcrypt with a salt factor of 10
   - Original passwords are never stored in the database
   - Password changes require current password verification

2. **Token Security**:
   - Short-lived access tokens (default: 15 minutes)
   - Token refresh with rotation (single-use refresh tokens)
   - Token blacklisting for logout functionality
   - Token storage in database for management and revocation

3. **Input Validation**:
   - All input data is validated using class-validator
   - Email format is validated
   - Password minimum length is enforced

4. **Error Handling**:
   - Proper HTTP status codes are returned
   - Descriptive error messages are provided
   - Sensitive information is not exposed in error messages

## Testing

### Example Curl Commands (PowerShell)

1. Register a new user:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
```

2. Login:
```powershell
$loginResponse = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$accessToken = $loginResponse.accessToken
$refreshToken = $loginResponse.refreshToken
```

3. Access protected route:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/me -Method Get -Headers @{Authorization = "Bearer $accessToken"}
```

4. Refresh tokens after expiration:
```powershell
$refreshResponse = Invoke-RestMethod -Uri http://localhost:3000/auth/refresh -Method Post -ContentType "application/json" -Body "{`"refreshToken`":`"$refreshToken`"}"
$newAccessToken = $refreshResponse.accessToken
$newRefreshToken = $refreshResponse.refreshToken
```

5. Use new access token to access protected routes:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/me -Method Get -Headers @{Authorization = "Bearer $newAccessToken"}
```

6. Update user profile:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/me -Method Patch -ContentType "application/json" -Headers @{Authorization = "Bearer $newAccessToken"} -Body '{"email":"updated@example.com"}'
```

7. Change password:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/me -Method Patch -ContentType "application/json" -Headers @{Authorization = "Bearer $newAccessToken"} -Body '{"password":"newPassword123","currentPassword":"password123"}'
```

8. Logout:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/auth/logout -Method Post -Headers @{Authorization = "Bearer $newAccessToken"}
```

## Best Practices

1. **Clean Architecture**:
   - Separation of concerns with modules
   - Repository pattern with Prisma service
   - DTOs for data validation

2. **Token Management**:
   - Short-lived access tokens
   - Refresh token rotation
   - Token blacklisting
   - Database tracking of tokens

3. **Security**:
   - Password hashing with bcrypt
   - JWT for authentication
   - Environment variables for secrets
   - Input validation with class-validator
   - Current password verification for sensitive operations

4. **Error Handling**:
   - Proper HTTP status codes
   - Descriptive error messages
   - Exception filters

5. **TypeScript**:
   - Strong typing throughout the application
   - Interfaces and DTOs for data validation

6. **Database**:
   - Prisma ORM for type-safe database access
   - Migrations for database schema changes
   - Proper naming conventions for database tables and columns

7. **User Experience**:
   - Seamless token refresh process
   - Comprehensive user profile management
   - Secure but user-friendly authentication flow
