"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const token_blacklist_service_1 = require("./token-blacklist.service");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    usersService;
    jwtService;
    tokenBlacklistService;
    prisma;
    constructor(usersService, jwtService, tokenBlacklistService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.prisma = prisma;
    }
    async register(registerDto) {
        return this.usersService.create(registerDto);
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        console.log("Login attempt with username:", username);
        console.log("Login attempt with password:", password);
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            console.log("User not found");
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log("Going for verfication of password", password);
        console.log("User found:", user.username);
        console.log("User password", user.password);
        const isPasswordValid = await this.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const userWithDetails = await this.getUserWithRoleAndPermissions(user.id);
        const tokens = await this.generateTokens(user.id, userWithDetails);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                accessTokens: tokens.accessToken,
                refreshTokens: tokens.refreshToken,
            },
        });
        return {
            ...tokens,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                userType: user.userType,
            },
        };
    }
    async logout(token) {
        await this.tokenBlacklistService.blacklistToken(token);
        try {
        }
        catch (error) {
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        console.log("Comparing passwords:", plainPassword, hashedPassword);
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        console.log("Password match result:", isMatch);
        return isMatch;
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const userId = payload.sub;
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || user.refreshTokens !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const userWithDetails = await this.getUserWithRoleAndPermissions(userId);
            const tokens = await this.generateTokens(userId, userWithDetails);
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    accessTokens: tokens.accessToken,
                    refreshTokens: tokens.refreshToken,
                },
            });
            return {
                ...tokens,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    userType: user.userType,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async getUserWithRoleAndPermissions(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                admin: {
                    include: {
                        role: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
                employee: {
                    include: {
                        role: {
                            include: {
                                permissions: true,
                            },
                        },
                        department: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
                userPermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async generateTokens(userId, userWithDetails) {
        const userType = userWithDetails.userType;
        let roleId = null;
        let roleName = null;
        let departmentId = null;
        let organizationId = null;
        if (userType === client_1.UserType.ADMIN && userWithDetails.admin) {
            roleId = userWithDetails.admin.roleId;
            roleName = userWithDetails.admin.role?.name;
        }
        else if (userType === client_1.UserType.EMPLOYEE && userWithDetails.employee) {
            roleId = userWithDetails.employee.roleId;
            roleName = userWithDetails.employee.role?.name;
            departmentId = userWithDetails.employee.departmentId;
            organizationId = userWithDetails.employee.department?.organizationId;
        }
        const permissions = new Set();
        if (userType === client_1.UserType.ADMIN && userWithDetails.admin?.role?.permissions) {
            userWithDetails.admin.role.permissions.forEach(p => permissions.add(p.key));
        }
        else if (userType === client_1.UserType.EMPLOYEE && userWithDetails.employee?.role?.permissions) {
            userWithDetails.employee.role.permissions.forEach(p => permissions.add(p.key));
        }
        if (userType === client_1.UserType.EMPLOYEE && userWithDetails.employee?.department?.permissions) {
            userWithDetails.employee.department.permissions.forEach(p => permissions.add(p.key));
        }
        if (userWithDetails.userPermissions) {
            userWithDetails.userPermissions
                .filter(up => up.active)
                .forEach(up => permissions.add(up.permission.key));
        }
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
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        token_blacklist_service_1.TokenBlacklistService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map