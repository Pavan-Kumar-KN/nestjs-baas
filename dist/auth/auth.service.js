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
        const { email, password } = loginDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async logout(token) {
        await this.tokenBlacklistService.blacklistToken(token);
        try {
            const payload = this.jwtService.verify(token);
            if (payload && payload.sub) {
                await this.prisma.refreshToken.updateMany({
                    where: { userId: payload.sub },
                    data: { revoked: true },
                });
            }
        }
        catch (error) {
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async refresh(refreshToken) {
        const storedRefreshToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!storedRefreshToken || storedRefreshToken.revoked) {
            throw new common_1.UnauthorizedException('Refresh token has been revoked or is invalid');
        }
        if (new Date() > storedRefreshToken.expiresAt) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        await this.prisma.refreshToken.update({
            where: { id: storedRefreshToken.id },
            data: { revoked: true },
        });
        const tokens = await this.generateTokens(storedRefreshToken.userId, storedRefreshToken.user.email);
        return tokens;
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const accessTokenExpires = new Date();
        accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 1);
        const refreshTokenExpires = new Date();
        refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);
        await this.prisma.accessToken.create({
            data: {
                token: accessToken,
                userId: userId,
                expiresAt: accessTokenExpires,
            },
        });
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userId,
                expiresAt: refreshTokenExpires,
            },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 60,
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