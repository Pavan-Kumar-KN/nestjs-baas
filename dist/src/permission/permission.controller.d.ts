import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(createPermissionDto: CreatePermissionDto): Promise<{
        id: string;
        description: string | null;
        key: string;
        resourceTypeId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        description: string | null;
        key: string;
        resourceTypeId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        roles: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        }[];
        departments: {
            id: string;
            name: string;
            organizationId: string;
        }[];
        userPermissions: ({
            user: {
                id: string;
                username: string;
                email: string | null;
                password: string;
                refreshTokens: string | null;
                accessTokens: string | null;
                userType: import(".prisma/client").$Enums.UserType;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            permissionId: string;
            active: boolean;
        })[];
    } & {
        id: string;
        description: string | null;
        key: string;
        resourceTypeId: string | null;
    }>;
    update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<{
        id: string;
        description: string | null;
        key: string;
        resourceTypeId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        key: string;
        resourceTypeId: string | null;
    }>;
    assignToUser(userId: string, permissionId: string, active?: boolean): Promise<{
        permission: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        permissionId: string;
        active: boolean;
    }>;
    removeFromUser(userId: string, permissionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        permissionId: string;
        active: boolean;
    }>;
}
