import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('departments')
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles('ADMIN')
  @RequirePermissions('department:create')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @RequirePermissions('department:read')
  findAll() {
    return this.departmentService.findAll();
  }

  @Get('organization/:id')
  @RequirePermissions('department:read')
  findByOrganization(@Param('id') id: string) {
    return this.departmentService.findByOrganization(id);
  }

  @Get(':id')
  @RequirePermissions('department:read')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @RequirePermissions('department:update')
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @RequirePermissions('department:delete')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }

  @Post(':id/permissions/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('department:update', 'permission:assign')
  addPermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.departmentService.addPermission(id, permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  @Roles('ADMIN')
  @RequirePermissions('department:update', 'permission:assign')
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.departmentService.removePermission(id, permissionId);
  }
}
