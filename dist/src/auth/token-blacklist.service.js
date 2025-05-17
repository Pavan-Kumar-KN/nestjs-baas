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
            if (!decoded || typeof decoded === 'string' || !decoded.sub) {
                throw new Error('Invalid token');
            }
            const userId = decoded.sub;
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.accessTokens === token) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        accessTokens: null,
                    },
                });
            }
        }
        catch (error) {
            console.error('Error blacklisting token:', error);
            throw error;
        }
    }
    async isBlacklisted(token) {
        try {
            try {
                this.jwtService.verify(token);
            }
            catch (verifyError) {
                console.error('Token verification failed:', verifyError.message);
                return true;
            }
            const decoded = this.jwtService.decode(token);
            if (!decoded || typeof decoded === 'string' || !decoded.sub) {
                console.error('Token decoding failed or missing sub claim');
                return true;
            }
            const userId = decoded.sub;
            console.log('Token user ID:', userId);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                console.error('User not found for token');
                return true;
            }
            console.log('User access token:', user.accessTokens ? 'exists' : 'null');
            const isBlacklisted = user.accessTokens !== token;
            console.log('Is token blacklisted (not matching stored token):', isBlacklisted);
            return isBlacklisted;
        }
        catch (error) {
            console.error('Error checking blacklisted token:', error);
            return true;
        }
    }
    async cleanupExpiredTokens() {
        return;
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map