import { ExecutionContext } from '@nestjs/common';
import { TokenBlacklistService } from '../token-blacklist.service';
declare const JwtBlacklistGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtBlacklistGuard extends JwtBlacklistGuard_base {
    private tokenBlacklistService;
    constructor(tokenBlacklistService: TokenBlacklistService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
