"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seeding...');
    const permissions = await createDefaultPermissions();
    console.log(`Created ${permissions.length} default permissions`);
    const adminRole = await createAdminRole(permissions);
    console.log(`Created admin role with ${permissions.length} permissions`);
    const adminUser = await createAdminUser(adminRole.id);
    console.log(`Created admin user: ${adminUser.username}`);
    console.log('Seeding completed successfully');
}
async function createDefaultPermissions() {
    const permissionKeys = [
        'organization:create',
        'organization:read',
        'organization:update',
        'organization:delete',
        'department:create',
        'department:read',
        'department:update',
        'department:delete',
        'role:create',
        'role:read',
        'role:update',
        'role:delete',
        'permission:create',
        'permission:read',
        'permission:update',
        'permission:delete',
        'permission:assign',
        'employee:create',
        'employee:read',
        'employee:update',
        'employee:delete',
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'resource:create',
        'resource:read',
        'resource:update',
        'resource:delete',
    ];
    const permissions = [];
    for (const key of permissionKeys) {
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
        }
        else {
            permissions.push(existingPermission);
        }
    }
    return permissions;
}
async function createAdminRole(permissions) {
    const existingRole = await prisma.role.findFirst({
        where: { name: 'Super Admin' },
    });
    if (existingRole) {
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
async function createAdminUser(roleId) {
    const username = 'admin';
    const password = 'admin123';
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        const adminRecord = await prisma.admin.findUnique({
            where: { userId: existingUser.id },
        });
        if (!adminRecord) {
            await prisma.admin.create({
                data: {
                    user: { connect: { id: existingUser.id } },
                    role: { connect: { id: roleId } },
                },
            });
        }
        return existingUser;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email: 'admin@example.com',
                password: hashedPassword,
                userType: client_1.UserType.ADMIN,
            },
        });
        await prisma.admin.create({
            data: {
                user: { connect: { id: user.id } },
                role: { connect: { id: roleId } },
            },
        });
        return user;
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map