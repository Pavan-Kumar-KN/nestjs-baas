import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async blacklistToken(token: string): Promise<void> {
    try {
      // Decode the token to get the expiration time
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded === 'string' || !decoded.exp) {
        throw new Error('Invalid token');
      }

      const expiresAt = new Date(decoded.exp * 1000); // Convert from seconds to milliseconds

      // Store the token in the blacklist
      await this.prisma.blacklistedToken.create({
        data: {
          token,
          expiresAt,
        },
      });
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw error;
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
        where: { token },
      });

      return !!blacklistedToken;
    } catch (error) {
      console.error('Error checking blacklisted token:', error);
      return false;
    }
  }

  // Cleanup expired tokens (can be called periodically)
  async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.prisma.blacklistedToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  }
}
