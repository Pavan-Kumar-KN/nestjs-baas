import { Body, Controller, Get, Param, Patch, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtBlacklistGuard } from '../auth/guards/jwt-blacklist.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtBlacklistGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: { userId: string } }) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtBlacklistGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtBlacklistGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request & { user: { userId: string } }, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If user is changing password, verify current password
    if (updateUserDto.password) {
      if (!updateUserDto.currentPassword) {
        throw new UnauthorizedException('Current password is required to set a new password');
      }

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    // Remove currentPassword from the data to be updated
    const { currentPassword, ...updateData } = updateUserDto;

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove password from the response
    const { password, ...result } = updatedUser;
    return result;
  }
}