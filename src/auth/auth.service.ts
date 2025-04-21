import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserType } from '@prisma/client';

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
    const { username, password } = loginDto;


    console.log("Login attempt with username:", username);
    console.log("Login attempt with password:", password);

    // Find user by username
    const user = await this.usersService.findByUsername(username);


    if (!user) {
    console.log("User not found");
      throw new UnauthorizedException('Invalid credentials');
    }


    console.log("Going for verfication of password",password);
    console.log("User found:", user.username);
    console.log("User password", user.password);
    // Verify password
    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user role and permissions
    const userWithDetails = await this.getUserWithRoleAndPermissions(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, userWithDetails);

    // Store tokens in user record
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        accessTokens: tokens.accessToken,
        refreshTokens: tokens.refreshToken,
      },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    };
  }

  async logout(token: string): Promise<void> {
    // Blacklist the access token
    await this.tokenBlacklistService.blacklistToken(token);

    try {
      // Also revoke any refresh tokens for this user if we can extract user info from token
      // const payload = this.jwtService.verify(token);
      // if (payload && payload.sub) {
      //   await this.prisma.refreshToken.updateMany({
      //     where: { userId: payload.sub },
      //     data: { revoked: true },
      //   });
      // }
    } catch (error) {
      // If token verification fails, just continue with the logout process
    }
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Compare the plain password with the hashed password using bcrypt
    console.log("Comparing passwords:", plainPassword, hashedPassword);
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    console.log("Password match result:", isMatch);
    return isMatch;
  }

  async refresh(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;

      // Find the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.refreshTokens !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user details for the new token
      const userWithDetails = await this.getUserWithRoleAndPermissions(userId);

      // Generate new tokens
      const tokens = await this.generateTokens(userId, userWithDetails);

      // Update tokens in database
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          accessTokens: tokens.accessToken,
          refreshTokens: tokens.refreshToken,
        },
      });

      return {
        ...tokens,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getUserWithRoleAndPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        admin: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        employee: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
            department: {
              include: {
                permissions: true,
              },
            },
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateTokens(userId: string, userWithDetails: any) {
    // Extract user type
    const userType = userWithDetails.userType;

    // Extract role information
    let roleId = null;
    let roleName = null;
    let departmentId = null;
    let organizationId = null;

    if (userType === UserType.ADMIN && userWithDetails.admin) {
      roleId = userWithDetails.admin.roleId;
      roleName = userWithDetails.admin.role?.name;
    } else if (userType === UserType.EMPLOYEE && userWithDetails.employee) {
      roleId = userWithDetails.employee.roleId;
      roleName = userWithDetails.employee.role?.name;
      departmentId = userWithDetails.employee.departmentId;
      organizationId = userWithDetails.employee.department?.organizationId;
    }

    // Extract permissions
    const permissions = new Set<string>();

    // Add role permissions
    if (userType === UserType.ADMIN && userWithDetails.admin?.role?.permissions) {
      userWithDetails.admin.role.permissions.forEach(p => permissions.add(p.key));
    } else if (userType === UserType.EMPLOYEE && userWithDetails.employee?.role?.permissions) {
      userWithDetails.employee.role.permissions.forEach(p => permissions.add(p.key));
    }

    // Add department permissions for employees
    if (userType === UserType.EMPLOYEE && userWithDetails.employee?.department?.permissions) {
      userWithDetails.employee.department.permissions.forEach(p => permissions.add(p.key));
    }

    // Add user-specific permissions
    if (userWithDetails.userPermissions) {
      userWithDetails.userPermissions
        .filter(up => up.active)
        .forEach(up => permissions.add(up.permission.key));
    }

    // Create payload with all necessary information
    const payload = {
      sub: userId,
      userType,
      role: {
        id: roleId,
        name: roleName,
      },
      department: departmentId,
      organization: organizationId,
      permissions: Array.from(permissions),
    };

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }
}
