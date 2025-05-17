import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles('ADMIN')
  @RequirePermissions('employee:create')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @RequirePermissions('employee:read')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('department/:id')
  @RequirePermissions('employee:read')
  findByDepartment(@Param('id') id: string) {
    return this.employeeService.findByDepartment(id);
  }

  @Get('user/:id')
  @RequirePermissions('employee:read')
  findByUserId(@Param('id') id: string) {
    return this.employeeService.findByUserId(id);
  }

  @Get(':id')
  @RequirePermissions('employee:read')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @RequirePermissions('employee:update')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @RequirePermissions('employee:delete')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
