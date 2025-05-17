import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        username: string;
        email: string | null;
        refreshTokens: string | null;
        accessTokens: string | null;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
            userType: import(".prisma/client").$Enums.UserType;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    getProfile(req: any): any;
    logout(req: any): Promise<{
        message: string;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
            userType: import(".prisma/client").$Enums.UserType;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
}
