# Multi-Tenant Organizational Management System

A comprehensive multi-tenant organizational management system built with NestJS and Prisma, featuring role-based access control, permission management, and JWT authentication.

## Table of Contents

- [System Overview](#system-overview)
- [Core Concepts](#core-concepts)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [API Endpoints with Examples](#api-endpoints-with-examples)
- [Implementation Details](#implementation-details)
- [Getting Started](#getting-started)
- [Best Practices](#best-practices)

## System Overview

This system provides a robust framework for managing organizations with multiple departments, roles, and employees. It implements a sophisticated permission system that operates at three levels:

1. **Role-based permissions**: Permissions assigned to roles that users inherit
2. **Department-level permissions**: Permissions assigned directly to departments
3. **User-specific permissions**: Additional permissions assigned to individual users

### User Types

- **ADMIN**: System-level or organization-level administrator
- **EMPLOYEE**: Belongs to a department and has a role
- **GUEST**: Basic user with limited access
- **CLIENT_USER**: Belongs to a client and can access specific resources

### Key Features

- JWT-based authentication with access and refresh tokens
- Role-based access control
- Multi-level permission system
- Organization and department management
- Employee management
- Resource management

## Core Concepts

To understand this system, you need to grasp several key concepts:

### Multi-Tenancy

Multi-tenancy refers to a software architecture where a single instance of the application serves multiple customers (tenants). In this system:

- Each **Organization** represents a tenant
- Organizations have their own **Departments**, **Roles**, and **Employees**
- Resources can be isolated by organization

This approach allows for efficient resource sharing while maintaining data isolation between tenants.

### JWT Authentication

JSON Web Tokens (JWT) are used for authentication:

- **Stateless**: No need to store session information on the server
- **Compact**: Can be sent through URL, POST parameter, or HTTP header
- **Self-contained**: Contains all necessary information about the user

This system uses a dual-token approach:

- **Access Token**: Short-lived token for API access
- **Refresh Token**: Long-lived token to obtain new access tokens

Both tokens are stored in the User model, eliminating the need for a separate token table.

### Role-Based Access Control (RBAC)

RBAC is a security approach that restricts system access based on the roles of individual users:

- **Roles** are assigned to users
- **Permissions** are assigned to roles
- Users inherit permissions from their roles

This system extends RBAC with department-level and user-specific permissions for more granular control.

### Clean Architecture

The system follows clean architecture principles:

- **Separation of concerns**: Each module has a specific responsibility
- **Dependency rule**: Inner layers don't depend on outer layers
- **Testability**: Business logic can be tested independently

The architecture is organized into controllers, services, and repositories, with clear boundaries between them.

### Domain-Driven Design (DDD)

DDD concepts applied in this system include:

- **Entities**: Domain objects with identity (User, Organization, etc.)
- **Value Objects**: Objects defined by their attributes
- **Aggregates**: Clusters of entities and value objects
- **Repositories**: Abstraction for data access
- **Services**: Domain logic that doesn't belong to entities

### Repository Pattern with Prisma

Prisma ORM is used to implement the repository pattern:

- **Type-safe**: Database queries are type-checked at compile time
- **Migrations**: Database schema changes are tracked and versioned
- **Relations**: Relationships between entities are easily defined and queried

The PrismaService acts as a repository, providing data access methods to the domain services.

## Architecture

The system follows a clean architecture pattern with proper separation of concerns:

### Core Modules

1. **Auth Module**: Handles authentication and authorization
2. **User Module**: Manages user accounts
3. **Organization Module**: Manages organizations
4. **Department Module**: Manages departments within organizations
5. **Role Module**: Manages roles and their permissions
6. **Permission Module**: Manages permissions
7. **Employee Module**: Manages employees and their assignments
8. **Resource Module**: Manages resources and resource types

### Layers

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **DTOs**: Define data transfer objects for validation
- **Guards**: Protect routes based on authentication and permissions
- **Decorators**: Provide metadata for authorization

## Database Schema

The system uses Prisma ORM with PostgreSQL. The main models include:

### User Model

```prisma
model User {
  id            String         @id @default(uuid())
  username      String         @unique
  email         String?        @unique
  password      String
  userType      UserType       @default(GUEST)
  accessTokens  String?
  refreshTokens String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Relationships
  admin         Admin?
  employee      Employee?
  clientUsers   ClientUser[]
  userPermissions UserPermission[]
}
```

### Organization Model

```prisma
model Organization {
  id          String       @id @default(uuid())
  name        String       @unique
  description String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relationships
  departments Department[]
}
```

### Department Model

```prisma
model Department {
  id             String       @id @default(uuid())
  name           String
  organizationId String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  // Relationships
  organization   Organization @relation(fields: [organizationId], references: [id])
  employees      Employee[]
  permissions    Permission[]
}
```

### Role Model

```prisma
model Role {
  id          String       @id @default(uuid())
  name        String
  description String?
  departmentId String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relationships
  department   Department?  @relation(fields: [departmentId], references: [id])
  permissions  Permission[]
  employees    Employee[]
  admins       Admin[]
}
```

### Permission Model

```prisma
model Permission {
  id          String       @id @default(uuid())
  key         String       @unique
  description String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relationships
  roles       Role[]
  departments Department[]
  userPermissions UserPermission[]
}
```

### Employee Model

```prisma
model Employee {
  id           String     @id @default(uuid())
  userId       String     @unique
  departmentId String
  roleId       String
  title        String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relationships
  user         User       @relation(fields: [userId], references: [id])
  department   Department @relation(fields: [departmentId], references: [id])
  role         Role       @relation(fields: [roleId], references: [id])
}
```

## Authentication

The system uses JWT-based authentication with access and refresh tokens:

### Access Token

- Short-lived token (15 minutes)
- Contains user ID, user type, role, department, organization, and permissions
- Used for API authorization

### Refresh Token

- Long-lived token (7 days)
- Used to obtain new access tokens
- Stored in the User model

### Authentication Flow

1. **Login**: User provides credentials and receives access and refresh tokens
2. **API Access**: User includes access token in Authorization header
3. **Token Refresh**: When access token expires, user uses refresh token to get a new one
4. **Logout**: Token is blacklisted to prevent further use

## Authorization

The system implements a sophisticated authorization mechanism:

### Permission Levels

1. **Role-based**: Permissions assigned to roles
2. **Department-level**: Permissions assigned to departments
3. **User-specific**: Permissions assigned directly to users

### Permission Format

Permissions follow a resource:action format, such as:

- `organization:create`
- `department:read`
- `employee:update`
- `resource:delete`

### Guards and Decorators

- **JwtAuthGuard**: Verifies JWT token
- **RoleGuard**: Checks user role
- **PermissionGuard**: Checks user permissions
- **Roles Decorator**: Specifies required roles
- **RequirePermissions Decorator**: Specifies required permissions

## API Endpoints with Examples

### Authentication

#### Register a new user

```
POST /auth/register
```

Request:
```json
{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "userType": "GUEST",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Login

```
POST /auth/login
```

Request:
```json
{
  "username": "john.doe",
  "password": "securePassword123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "userType": "GUEST"
  }
}
```

#### Refresh Token

```
POST /auth/refresh
```

Request:
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
  "expiresIn": 900,
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "userType": "GUEST"
  }
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

#### Get User Profile

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
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "userType": "EMPLOYEE",
  "employee": {
    "id": "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
    "title": "Software Engineer",
    "department": {
      "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      "name": "Engineering"
    },
    "role": {
      "id": "r1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      "name": "Developer"
    }
  }
}
```

### Organizations

#### Create Organization

```
POST /organizations
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:
```json
{
  "name": "Acme Corporation",
  "description": "A global technology company"
}
```

Response:
```json
{
  "id": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "name": "Acme Corporation",
  "description": "A global technology company",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Get All Organizations

```
GET /organizations
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
[
  {
    "id": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "name": "Acme Corporation",
    "description": "A global technology company",
    "createdAt": "2023-07-01T12:00:00.000Z",
    "updatedAt": "2023-07-01T12:00:00.000Z",
    "departments": [
      {
        "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
        "name": "Engineering"
      },
      {
        "id": "d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
        "name": "Marketing"
      }
    ]
  }
]
```

### Departments

#### Create Department

```
POST /departments
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:
```json
{
  "name": "Research & Development",
  "organizationId": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a"
}
```

Response:
```json
{
  "id": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "name": "Research & Development",
  "organizationId": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z",
  "organization": {
    "id": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "name": "Acme Corporation"
  }
}
```

#### Add Permission to Department

```
POST /departments/:id/permissions/:permissionId
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "id": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "name": "Research & Development",
  "organizationId": "o1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "permissions": [
    {
      "id": "p1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      "key": "resource:read",
      "description": "Permission to read resources"
    }
  ]
}
```

### Roles

#### Create Role

```
POST /roles
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:
```json
{
  "name": "Project Manager",
  "description": "Manages projects and team members",
  "departmentId": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a"
}
```

Response:
```json
{
  "id": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
  "name": "Project Manager",
  "description": "Manages projects and team members",
  "departmentId": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z",
  "department": {
    "id": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
    "name": "Research & Development"
  },
  "permissions": []
}
```

#### Add Permission to Role

```
POST /roles/:id/permissions/:permissionId
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "id": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
  "name": "Project Manager",
  "permissions": [
    {
      "id": "p1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      "key": "resource:read",
      "description": "Permission to read resources"
    },
    {
      "id": "p2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
      "key": "resource:create",
      "description": "Permission to create resources"
    }
  ]
}
```

### Permissions

#### Create Permission

```
POST /permissions
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:
```json
{
  "key": "project:manage",
  "description": "Permission to manage projects"
}
```

Response:
```json
{
  "id": "p3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "key": "project:manage",
  "description": "Permission to manage projects",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Assign Permission to User

```
POST /permissions/user/:userId/permission/:permissionId
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Query Parameters:
```
active=true
```

Response:
```json
{
  "id": "up1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "permissionId": "p3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "active": true,
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "username": "john.doe"
  },
  "permission": {
    "id": "p3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
    "key": "project:manage"
  }
}
```

### Employees

#### Create Employee

```
POST /employees
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:
```json
{
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "departmentId": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "roleId": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
  "title": "Senior Project Manager"
}
```

Response:
```json
{
  "id": "e1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "departmentId": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
  "roleId": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
  "title": "Senior Project Manager",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z",
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "userType": "EMPLOYEE"
  },
  "department": {
    "id": "d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
    "name": "Research & Development"
  },
  "role": {
    "id": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
    "name": "Project Manager"
  }
}
```

#### Get Employees by Department

```
GET /employees/department/:id
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
[
  {
    "id": "e1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "title": "Senior Project Manager",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "username": "john.doe",
      "email": "john.doe@example.com"
    },
    "role": {
      "id": "r2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
      "name": "Project Manager"
    }
  },
  {
    "id": "e2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7b",
    "title": "Software Engineer",
    "user": {
      "id": "f57bc20c-68dd-5483-b678-1f13c3d4e590",
      "username": "jane.smith",
      "email": "jane.smith@example.com"
    },
    "role": {
      "id": "r3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a",
      "name": "Developer"
    }
  }
]
```

## Implementation Details

### JWT Token Storage

Access and refresh tokens are stored directly in the User model:

```typescript
// User model in Prisma schema
model User {
  // Other fields...
  accessTokens  String?
  refreshTokens String?
}
```

This approach eliminates the need for a separate token table while still providing the ability to invalidate tokens when needed.

### Permission Calculation

Permissions are calculated by combining permissions from multiple sources:

```typescript
// Extract permissions
const permissions = new Set<string>();

// Add role permissions
if (userType === UserType.ADMIN && userWithDetails.admin?.role?.permissions) {
  userWithDetails.admin.role.permissions.forEach(p => permissions.add(p.key));
} else if (userType === UserType.EMPLOYEE && userWithDetails.employee?.role?.permissions) {
  userWithDetails.employee.role.permissions.forEach(p => permissions.add(p.key));
}

// Add department permissions for employees
if (userType === UserType.EMPLOYEE && userWithDetails.employee?.department?.permissions) {
  userWithDetails.employee.department.permissions.forEach(p => permissions.add(p.key));
}

// Add user-specific permissions
if (userWithDetails.userPermissions) {
  userWithDetails.userPermissions
    .filter(up => up.active)
    .forEach(up => permissions.add(up.permission.key));
}
```

### JWT Payload Structure

The JWT payload includes all necessary information for authorization:

```typescript
const payload = {
  sub: userId,
  userType,
  role: {
    id: roleId,
    name: roleName,
  },
  department: departmentId,
  organization: organizationId,
  permissions: Array.from(permissions),
};
```

### Permission Guard Implementation

The permission guard checks if the user has the required permissions:

```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    const hasAllRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('You do not have the required permissions to access this resource');
    }

    return true;
  }
}
```

## Best Practices

### Security

- Passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- Access tokens have a short lifespan
- Refresh tokens can be invalidated
- Input validation using class-validator

### Performance

- Efficient database queries with Prisma
- Proper indexing of database fields
- Pagination for large result sets
- Eager loading of related entities when needed

### Maintainability

- Clean architecture with separation of concerns
- Consistent naming conventions
- Comprehensive error handling
- Detailed API documentation
- Type safety with TypeScript

### Scalability

- Modular design for easy extension
- Stateless authentication for horizontal scaling
- Database connection pooling
- Efficient permission calculation and caching

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- NestJS CLI (`npm i -g @nestjs/cli`)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="15m"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database with initial data (admin user, permissions):

```bash
npm run prisma:seed
```

6. Start the application:

```bash
npm run start:dev
```

### Default Admin Credentials

After running the seed script, you can log in with the following credentials:

- Username: `admin`
- Password: `admin123`

**Important**: Change the default password in production!

### Database Seeding

The seed script (`prisma/seed.ts`) creates:

1. Default permissions for all resources
2. An admin role with all permissions
3. An admin user with the admin role

#### Seed Implementation

The seed script is implemented in TypeScript and uses the Prisma Client to interact with the database. Here's a detailed explanation of how it works:

```typescript
async function main() {
  console.log('Starting seeding...');

  // Create default permissions
  const permissions = await createDefaultPermissions();
  console.log(`Created ${permissions.length} default permissions`);

  // Create admin role
  const adminRole = await createAdminRole(permissions);
  console.log(`Created admin role with ${permissions.length} permissions`);

  // Create admin user
  const adminUser = await createAdminUser(adminRole.id);
  console.log(`Created admin user: ${adminUser.username}`);

  console.log('Seeding completed successfully');
}
```

#### Creating Default Permissions

The `createDefaultPermissions` function creates a set of default permissions for all resources in the system:

```typescript
async function createDefaultPermissions() {
  const permissionKeys = [
    // Organization permissions
    'organization:create',
    'organization:read',
    'organization:update',
    'organization:delete',

    // Department permissions
    'department:create',
    'department:read',
    'department:update',
    'department:delete',

    // Role permissions
    'role:create',
    'role:read',
    'role:update',
    'role:delete',

    // Permission permissions
    'permission:create',
    'permission:read',
    'permission:update',
    'permission:delete',
    'permission:assign',

    // Employee permissions
    'employee:create',
    'employee:read',
    'employee:update',
    'employee:delete',

    // User permissions
    'user:create',
    'user:read',
    'user:update',
    'user:delete',

    // Resource permissions
    'resource:create',
    'resource:read',
    'resource:update',
    'resource:delete',
  ];

  const permissions: any[] = [];

  for (const key of permissionKeys) {
    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { key },
    });

    if (!existingPermission) {
      const permission = await prisma.permission.create({
        data: {
          key,
        },
      });
      permissions.push(permission);
    } else {
      permissions.push(existingPermission);
    }
  }

  return permissions;
}
```

#### Creating Admin Role

The `createAdminRole` function creates an admin role with all permissions:

```typescript
async function createAdminRole(permissions: any[]) {
  // Check if admin role already exists
  const existingRole = await prisma.role.findFirst({
    where: { name: 'Super Admin' },
  });

  if (existingRole) {
    // Connect all permissions to the role
    await prisma.role.update({
      where: { id: existingRole.id },
      data: {
        permissions: {
          connect: permissions.map(p => ({ id: p.id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return existingRole;
  }

  // Create admin role with all permissions
  return prisma.role.create({
    data: {
      name: 'Super Admin',
      permissions: {
        connect: permissions.map(p => ({ id: p.id })),
      },
    },
    include: {
      permissions: true,
    },
  });
}
```

#### Creating Admin User

The `createAdminUser` function creates an admin user with the admin role:

```typescript
async function createAdminUser(roleId: string) {
  const username = 'admin';
  const password = 'admin123'; // This should be changed in production

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    // Check if admin record exists
    const adminRecord = await prisma.admin.findUnique({
      where: { userId: existingUser.id },
    });

    if (!adminRecord) {
      // Create admin record if it doesn't exist
      await prisma.admin.create({
        data: {
          user: { connect: { id: existingUser.id } },
          role: { connect: { id: roleId } },
        },
      });
    }

    return existingUser;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const user = await prisma.user.create({
    data: {
      username,
      email: 'admin@example.com',
      password: hashedPassword,
      userType: UserType.ADMIN,
    },
  });

  // Create admin record
  await prisma.admin.create({
    data: {
      user: { connect: { id: user.id } },
      role: { connect: { id: roleId } },
    },
  });

  return user;
}
```

#### Running the Seed Script

To run the seed script, you can use the following command:

```bash
npm run prisma:seed
```

This command is defined in the `package.json` file:

```json
"scripts": {
  "prisma:seed": "ts-node prisma/seed.ts"
}
```

You can modify the seed script to create additional initial data as needed, such as organizations, departments, roles, and employees.
```

### Project Structure

```
├── prisma/                  # Prisma schema and migrations
│   ├── migrations/         # Database migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
├── src/
│   ├── auth/               # Authentication module
│   │   ├── dto/            # Data transfer objects
│   │   ├── guards/         # Authentication guards
│   │   ├── strategies/     # Passport strategies
│   │   ├── decorators/     # Custom decorators
│   ├── users/              # User management module
│   ├── organizations/      # Organization management module
│   ├── departments/        # Department management module
│   ├── roles/              # Role management module
│   ├── permissions/        # Permission management module
│   ├── employees/          # Employee management module
│   ├── prisma/             # Prisma service module
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── .env                    # Environment variables
└── package.json            # Project dependencies
```
