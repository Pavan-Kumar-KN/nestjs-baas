import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    private readonly prisma;
    constructor(usersService: UsersService, prisma: PrismaService);
    getProfile(req: Request & {
        user: {
            userId: string;
        };
    }): Promise<{
        userPermissions: ({
            permission: {
                id: string;
                description: string | null;
                key: string;
                resourceTypeId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            permissionId: string;
            active: boolean;
        })[];
        admin: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
        } | null;
        employee: ({
            role: {
                id: string;
                name: string;
                description: string | null;
                departmentId: string | null;
            };
            department: {
                id: string;
                name: string;
                organizationId: string;
            };
        } & {
            id: string;
            departmentId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
            title: string | null;
        }) | null;
        clientUsers: ({
            client: {
                id: string;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            clientId: string;
        })[];
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        userPermissions: ({
            permission: {
                id: string;
                description: string | null;
                key: string;
                resourceTypeId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            permissionId: string;
            active: boolean;
        })[];
        admin: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
        } | null;
        employee: ({
            role: {
                id: string;
                name: string;
                description: string | null;
                departmentId: string | null;
            };
            department: {
                id: string;
                name: string;
                organizationId: string;
            };
        } & {
            id: string;
            departmentId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
            title: string | null;
        }) | null;
        clientUsers: ({
            client: {
                id: string;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            clientId: string;
        })[];
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: Request & {
        user: {
            userId: string;
        };
    }, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
