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
        const isValid = await super.canActivate(context);
        if (!isValid) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('Token has been revoked');
        }
        return true;
    }
};
exports.JwtBlacklistGuard = JwtBlacklistGuard;
exports.JwtBlacklistGuard = JwtBlacklistGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_blacklist_service_1.TokenBlacklistService])
], JwtBlacklistGuard);
//# sourceMappingURL=jwt-blacklist.guard.js.map