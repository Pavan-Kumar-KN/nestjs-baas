import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('JwtAuthGuard: canActivate called');

      // Extract the token
      const request = context.switchToHttp().getRequest();
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      console.log('Token extracted:', token ? 'Token exists' : 'No token');

      if (!token) {
        console.log('No token provided');
        throw new UnauthorizedException('No token provided');
      }

      // Call the parent canActivate method
      const result = await super.canActivate(context) as boolean;

      console.log('JWT validation result:', result);

      // Log the user object
      const user = request.user;
      console.log('User in request:', user ? 'exists' : 'undefined');
      console.log('User ID:', user?.id);
      console.log('User type:', user?.userType);

      return result;
    } catch (error) {
      console.error('Error in JwtAuthGuard:', error);
      throw error;
    }
  }
}
