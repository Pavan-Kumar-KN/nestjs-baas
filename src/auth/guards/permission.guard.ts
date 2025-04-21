import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      console.log('PermissionGuard: canActivate called');

      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

      console.log('Required permissions:', requiredPermissions);

      if (!requiredPermissions || requiredPermissions.length === 0) {
        console.log('No permissions required');
        return true; // No permissions required
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      console.log('User in permission guard:', user ? 'exists' : 'undefined');
      console.log('User permissions:', user?.permissions);

      if (!user) {
        console.log('No user in request');
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      if (!user.permissions) {
        console.log('No permissions in user object');
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      const hasAllRequiredPermissions = requiredPermissions.every(permission => {
        const hasPermission = user.permissions.includes(permission);
        console.log(`Checking permission ${permission}: ${hasPermission ? 'has' : 'does not have'}`);
        return hasPermission;
      });

      if (!hasAllRequiredPermissions) {
        console.log('User does not have all required permissions');
        throw new ForbiddenException('You do not have the required permissions to access this resource');
      }

      console.log('Permission check passed');
      return true;
    } catch (error) {
      console.error('Error in PermissionGuard:', error);
      throw error;
    }
  }
}
