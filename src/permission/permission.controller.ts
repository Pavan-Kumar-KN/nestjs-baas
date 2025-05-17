import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles('ADMIN')
  @RequirePermissions('permission:create')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @RequirePermissions('permission:read')
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @RequirePermissions('permission:read')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @RequirePermissions('permission:update')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @RequirePermissions('permission:delete')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Post('user/:userId/permission/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('permission:assign')
  assignToUser(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: string,
    @Query('active') active: boolean = true,
  ) {
    return this.permissionService.assignToUser(userId, permissionId, active);
  }

  @Delete('user/:userId/permission/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('permission:assign')
  removeFromUser(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.permissionService.removeFromUser(userId, permissionId);
  }
}
