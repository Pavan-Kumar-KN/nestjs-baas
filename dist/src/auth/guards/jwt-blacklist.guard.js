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
exports.JwtBlacklistGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const token_blacklist_service_1 = require("../token-blacklist.service");
const passport_jwt_1 = require("passport-jwt");
let JwtBlacklistGuard = class JwtBlacklistGuard extends (0, passport_1.AuthGuard)('jwt') {
    tokenBlacklistService;
    constructor(tokenBlacklistService) {
        super();
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            console.log('Token extracted:', token ? 'Token exists' : 'No token');
            if (!token) {
                console.log('No token provided');
                throw new common_1.UnauthorizedException('No token provided');
            }
            const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
            console.log('Is token blacklisted:', isBlacklisted);
            if (isBlacklisted) {
                console.log('Token has been revoked');
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            const isValid = await super.canActivate(context);
            if (!isValid) {
                console.log('JWT validation failed');
                return false;
            }
            const user = request.user;
            console.log('User in request:', user);
            console.log('User permissions:', user?.permissions);
            console.log('User role:', user?.role);
            console.log('User type:', user?.userType);
            return true;
        }
        catch (error) {
            console.error('Error in JwtBlacklistGuard:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.JwtBlacklistGuard = JwtBlacklistGuard;
exports.JwtBlacklistGuard = JwtBlacklistGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_blacklist_service_1.TokenBlacklistService])
], JwtBlacklistGuard);
//# sourceMappingURL=jwt-blacklist.guard.js.map