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
      // Decode the token to get the user ID
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded === 'string' || !decoded.sub) {
        throw new Error('Invalid token');
      }

      const userId = decoded.sub;

      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // If this token is the current access token, remove it
      if (user.accessTokens === token) {
        // Update the user to remove the token
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            accessTokens: null,
          },
        });
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw error;
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      // Try to verify the token first
      try {
        this.jwtService.verify(token);
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError.message);
        return true; // Invalid tokens are considered blacklisted
      }

      // Decode the token to get the user ID
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded === 'string' || !decoded.sub) {
        console.error('Token decoding failed or missing sub claim');
        return true; // Invalid tokens are considered blacklisted
      }

      const userId = decoded.sub;
      console.log('Token user ID:', userId);

      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error('User not found for token');
        return true; // User not found
      }

      console.log('User access token:', user.accessTokens ? 'exists' : 'null');

      // Check if the token is still the user's accessToken
      // In our implementation, accessTokens stores the current token directly
      const isBlacklisted = user.accessTokens !== token;
      console.log('Is token blacklisted (not matching stored token):', isBlacklisted);

      return isBlacklisted;
    } catch (error) {
      console.error('Error checking blacklisted token:', error);
      return true; // Consider as blacklisted on error
    }
  }

  // No need for cleanup as tokens are stored in the user model
  async cleanupExpiredTokens(): Promise<void> {
    // No operation needed as we're not using a separate blacklist table
    return;
  }
}
