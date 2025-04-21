import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('ADMIN')
  @RequirePermissions('role:create')
  create(@Body() createRoleDto: CreateRoleDto, @Req() req: any) {
    console.log("Create Role DTO:", createRoleDto);
    console.log("User in request:", req.user);
    console.log("User permissions:", req.user?.permissions);
    console.log("User role:", req.user?.role);
    console.log("User type:", req.user?.userType);
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions('role:read')
  findAll() {
    return this.roleService.findAll();
  }

  @Get('department/:id')
  @RequirePermissions('role:read')
  findByDepartment(@Param('id') id: string) {
    return this.roleService.findByDepartment(id);
  }

  @Get(':id')
  @RequirePermissions('role:read')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @RequirePermissions('role:update')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @RequirePermissions('role:delete')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Post(':id/permissions/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('role:update', 'permission:assign')
  addPermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.roleService.addPermission(id, permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('role:update', 'permission:assign')
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.roleService.removePermission(id, permissionId);
  }
}
