import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async logout(token: string): Promise<void> {
    // Blacklist the access token
    await this.tokenBlacklistService.blacklistToken(token);
    
    try {
      // Also revoke any refresh tokens for this user if we can extract user info from token
      const payload = this.jwtService.verify(token);
      if (payload && payload.sub) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: payload.sub },
          data: { revoked: true },
        });
      }
    } catch (error) {
      // If token verification fails, just continue with the logout process
    }
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async refresh(refreshToken: string) {
    // Check if token is blacklisted or revoked
    const storedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedRefreshToken || storedRefreshToken.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked or is invalid');
    }

    // Check if token is expired
    if (new Date() > storedRefreshToken.expiresAt) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke current refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedRefreshToken.id },
      data: { revoked: true },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(storedRefreshToken.userId, storedRefreshToken.user.email);

    return tokens;
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    
    // Generate access token (set to 1 minute for testing)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    
    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Calculate expiration dates
    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 1); // 1 minute for testing
    
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);

    // Store tokens in database
    await this.prisma.accessToken.create({
      data: {
        token: accessToken,
        userId: userId,
        expiresAt: accessTokenExpires,
      },
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: refreshTokenExpires,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 60, // 1 minute in seconds
    };
  }
}
