import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtBlacklistGuard } from './guards/jwt-blacklist.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log("Login request received:", loginDto);
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtBlacklistGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // console.log("User profile requested");
    // console.log('User:', req.user);
    return req.user;
  }

  @UseGuards(JwtBlacklistGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.logout(token);
    }
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const newTokens = await this.authService.refresh(refreshToken);
    return newTokens;
  }
}
