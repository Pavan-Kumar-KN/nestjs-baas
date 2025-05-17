import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      console.log('RoleGuard: canActivate called');

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      console.log('Required roles:', requiredRoles);

      if (!requiredRoles || requiredRoles.length === 0) {
        console.log('No roles required');
        return true; // No roles required
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      console.log('User in role guard:', user ? 'exists' : 'undefined');
      console.log('User type:', user?.userType);
      console.log('User role:', user?.role);

      if (!user) {
        console.log('No user in request');
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      if (!user.userType) {
        console.log('No userType in user object');
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      // Check if user has required role type
      const hasRequiredRole = requiredRoles.some(role => {
        console.log(`Checking role ${role} against user type ${user.userType}`);

        if (role === 'ADMIN' && user.userType === UserType.ADMIN) {
          console.log('User is ADMIN');
          return true;
        }
        if (role === 'EMPLOYEE' && user.userType === UserType.EMPLOYEE) {
          console.log('User is EMPLOYEE');
          return true;
        }
        if (role === 'GUEST' && user.userType === UserType.GUEST) {
          console.log('User is GUEST');
          return true;
        }

        // Check for specific role name if user has role information
        if (user.role && user.role.name === role) {
          console.log(`User has role ${role}`);
          return true;
        }

        return false;
      });

      if (!hasRequiredRole) {
        console.log('User does not have required role');
        throw new ForbiddenException('You do not have the required role to access this resource');
      }

      console.log('Role check passed');
      return true;
    } catch (error) {
      console.error('Error in RoleGuard:', error);
      throw error;
    }
  }
}
