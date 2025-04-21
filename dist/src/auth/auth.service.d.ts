import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private tokenBlacklistService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, tokenBlacklistService: TokenBlacklistService, prisma: PrismaService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
            userType: import(".prisma/client").$Enums.UserType;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(token: string): Promise<void>;
    private comparePasswords;
    refresh(refreshToken: string): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
            userType: import(".prisma/client").$Enums.UserType;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    getUserWithRoleAndPermissions(userId: string): Promise<{
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
        admin: ({
            role: {
                permissions: {
                    id: string;
                    description: string | null;
                    key: string;
                    resourceTypeId: string | null;
                }[];
            } & {
                id: string;
                name: string;
                description: string | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
        }) | null;
        employee: ({
            role: {
                permissions: {
                    id: string;
                    description: string | null;
                    key: string;
                    resourceTypeId: string | null;
                }[];
            } & {
                id: string;
                name: string;
                description: string | null;
                departmentId: string | null;
            };
            department: {
                permissions: {
                    id: string;
                    description: string | null;
                    key: string;
                    resourceTypeId: string | null;
                }[];
            } & {
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
    } & {
        id: string;
        username: string;
        email: string | null;
        password: string;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateTokens;
}
