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
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let TokenBlacklistService = class TokenBlacklistService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async blacklistToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded || typeof decoded === 'string' || !decoded.exp) {
                throw new Error('Invalid token');
            }
            const expiresAt = new Date(decoded.exp * 1000);
            await this.prisma.blacklistedToken.create({
                data: {
                    token,
                    expiresAt,
                },
            });
        }
        catch (error) {
            console.error('Error blacklisting token:', error);
            throw error;
        }
    }
    async isBlacklisted(token) {
        try {
            const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
                where: { token },
            });
            return !!blacklistedToken;
        }
        catch (error) {
            console.error('Error checking blacklisted token:', error);
            return false;
        }
    }
    async cleanupExpiredTokens() {
        try {
            await this.prisma.blacklistedToken.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });
        }
        catch (error) {
            console.error('Error cleaning up expired tokens:', error);
        }
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map