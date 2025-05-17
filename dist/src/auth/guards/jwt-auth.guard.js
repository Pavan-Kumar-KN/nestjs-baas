"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    async canActivate(context) {
        try {
            console.log('JwtAuthGuard: canActivate called');
            const request = context.switchToHttp().getRequest();
            const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            console.log('Token extracted:', token ? 'Token exists' : 'No token');
            if (!token) {
                console.log('No token provided');
                throw new common_1.UnauthorizedException('No token provided');
            }
            const result = await super.canActivate(context);
            console.log('JWT validation result:', result);
            const user = request.user;
            console.log('User in request:', user ? 'exists' : 'undefined');
            console.log('User ID:', user?.id);
            console.log('User type:', user?.userType);
            return result;
        }
        catch (error) {
            console.error('Error in JwtAuthGuard:', error);
            throw error;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map