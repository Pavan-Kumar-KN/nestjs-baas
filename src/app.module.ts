import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { OrganizationModule } from './organization/organization.module';
import { DepartmentModule } from './department/department.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SharedModule,
    OrganizationModule,
    DepartmentModule,
    RoleModule,
    PermissionModule,
    EmployeeModule,
  ]
})
export class AppModule {}
