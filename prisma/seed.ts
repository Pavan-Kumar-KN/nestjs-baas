import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

async function createDefaultPermissions() {
  // Define the Permission type based on the Prisma schema
  type Permission = {
    id: string;
    key: string;
    description: string | null;
    resourceTypeId: string | null;
  };

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

  try {
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
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
