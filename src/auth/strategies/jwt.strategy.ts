import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT payload:', JSON.stringify(payload, null, 2));

      // We don't need to check the blacklist here since we're using the User model approach
      // The token validation is already done by Passport before this method is called

      // Get user from database
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        console.error('User not found for token payload');
        throw new UnauthorizedException('Invalid token');
      }

      console.log('User found:', user.username);
      console.log('User type:', user.userType);
      console.log('Payload permissions:', payload.permissions || []);

      // Create user object with permissions from the token
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
    } catch (error) {
      console.error('Error in JWT strategy validate:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
