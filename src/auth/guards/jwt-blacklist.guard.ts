import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from '../token-blacklist.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtBlacklistGuard extends AuthGuard('jwt') {
  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Extract the token first
      const request = context.switchToHttp().getRequest();
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      console.log('Token extracted:', token ? 'Token exists' : 'No token');

      if (!token) {
        console.log('No token provided');
        throw new UnauthorizedException('No token provided');
      }

      // Check if the token is blacklisted before validating it
      const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
      console.log('Is token blacklisted:', isBlacklisted);

      if (isBlacklisted) {
        console.log('Token has been revoked');
        throw new UnauthorizedException('Token has been revoked');
      }

      // Now check if the JWT is valid using the parent guard
      const isValid = await super.canActivate(context);

      if (!isValid) {
        console.log('JWT validation failed');
        return false;
      }

      // Log the user object to see if it's properly attached
      const user = request.user;
      console.log('User in request:', user);
      console.log('User permissions:', user?.permissions);
      console.log('User role:', user?.role);
      console.log('User type:', user?.userType);

      return true;
    } catch (error) {
      console.error('Error in JwtBlacklistGuard:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
