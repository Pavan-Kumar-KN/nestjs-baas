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
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionGuard = class PermissionGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        try {
            console.log('PermissionGuard: canActivate called');
            const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
            console.log('Required permissions:', requiredPermissions);
            if (!requiredPermissions || requiredPermissions.length === 0) {
                console.log('No permissions required');
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            console.log('User in permission guard:', user ? 'exists' : 'undefined');
            console.log('User permissions:', user?.permissions);
            if (!user) {
                console.log('No user in request');
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            if (!user.permissions) {
                console.log('No permissions in user object');
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            const hasAllRequiredPermissions = requiredPermissions.every(permission => {
                const hasPermission = user.permissions.includes(permission);
                console.log(`Checking permission ${permission}: ${hasPermission ? 'has' : 'does not have'}`);
                return hasPermission;
            });
            if (!hasAllRequiredPermissions) {
                console.log('User does not have all required permissions');
                throw new common_1.ForbiddenException('You do not have the required permissions to access this resource');
            }
            console.log('Permission check passed');
            return true;
        }
        catch (error) {
            console.error('Error in PermissionGuard:', error);
            throw error;
        }
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map