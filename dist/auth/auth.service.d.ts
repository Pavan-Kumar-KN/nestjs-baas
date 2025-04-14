import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private tokenBlacklistService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, tokenBlacklistService: TokenBlacklistService, prisma: PrismaService);
    register(registerDto: RegisterDto): Promise<{
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(token: string): Promise<void>;
    private comparePasswords;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    private generateTokens;
}
