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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const users_service_1 = require("../../users/users.service");
const config_1 = require("@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    usersService;
    configService;
    constructor(usersService, configService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.usersService = usersService;
        this.configService = configService;
    }
    async validate(payload) {
        try {
            console.log('JWT payload:', JSON.stringify(payload, null, 2));
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                console.error('User not found for token payload');
                throw new common_1.UnauthorizedException('Invalid token');
            }
            console.log('User found:', user.username);
            console.log('User type:', user.userType);
            console.log('Payload permissions:', payload.permissions || []);
            const userWithPermissions = {
                ...user,
                permissions: payload.permissions || [],
                role: payload.role,
                userType: payload.userType,
                departmentId: payload.department,
                organizationId: payload.organization,
            };
            console.log('User with permissions:', JSON.stringify({
                id: userWithPermissions.id,
                username: userWithPermissions.username,
                userType: userWithPermissions.userType,
                role: userWithPermissions.role,
                permissions: userWithPermissions.permissions,
            }, null, 2));
            return userWithPermissions;
        }
        catch (error) {
            console.error('Error in JWT strategy validate:', error);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map