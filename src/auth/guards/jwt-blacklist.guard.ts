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
    // First, check if the JWT is valid using the parent guard
    const isValid = await super.canActivate(context);
    
    if (!isValid) {
      return false;
    }

    // Then, check if the token is blacklisted
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
    
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return true;
  }
}
