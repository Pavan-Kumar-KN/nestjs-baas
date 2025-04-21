import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        username: string;
        email: string | null;
        password: string;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByUsername(username: string): Promise<{
        id: string;
        username: string;
        email: string | null;
        password: string;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
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
    private hashPassword;
}
