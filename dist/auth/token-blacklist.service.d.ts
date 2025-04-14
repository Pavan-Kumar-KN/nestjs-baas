import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class TokenBlacklistService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    blacklistToken(token: string): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
    cleanupExpiredTokens(): Promise<void>;
}
