import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private configService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(payload: any): Promise<{
        permissions: any;
        role: any;
        userType: any;
        departmentId: any;
        organizationId: any;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
