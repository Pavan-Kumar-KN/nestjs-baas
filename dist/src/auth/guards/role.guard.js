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
exports.RoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const client_1 = require("@prisma/client");
let RoleGuard = class RoleGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        try {
            console.log('RoleGuard: canActivate called');
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            console.log('Required roles:', requiredRoles);
            if (!requiredRoles || requiredRoles.length === 0) {
                console.log('No roles required');
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            console.log('User in role guard:', user ? 'exists' : 'undefined');
            console.log('User type:', user?.userType);
            console.log('User role:', user?.role);
            if (!user) {
                console.log('No user in request');
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            if (!user.userType) {
                console.log('No userType in user object');
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            const hasRequiredRole = requiredRoles.some(role => {
                console.log(`Checking role ${role} against user type ${user.userType}`);
                if (role === 'ADMIN' && user.userType === client_1.UserType.ADMIN) {
                    console.log('User is ADMIN');
                    return true;
                }
                if (role === 'EMPLOYEE' && user.userType === client_1.UserType.EMPLOYEE) {
                    console.log('User is EMPLOYEE');
                    return true;
                }
                if (role === 'GUEST' && user.userType === client_1.UserType.GUEST) {
                    console.log('User is GUEST');
                    return true;
                }
                if (user.role && user.role.name === role) {
                    console.log(`User has role ${role}`);
                    return true;
                }
                return false;
            });
            if (!hasRequiredRole) {
                console.log('User does not have required role');
                throw new common_1.ForbiddenException('You do not have the required role to access this resource');
            }
            console.log('Role check passed');
            return true;
        }
        catch (error) {
            console.error('Error in RoleGuard:', error);
            throw error;
        }
    }
};
exports.RoleGuard = RoleGuard;
exports.RoleGuard = RoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RoleGuard);
//# sourceMappingURL=role.guard.js.map