import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
    logout(req: any): Promise<{
        message: string;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
}
