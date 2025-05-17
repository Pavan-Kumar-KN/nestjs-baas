import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { userId, departmentId, roleId, title } = createEmployeeDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    // Check if user is already an employee
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (existingEmployee) {
      throw new ConflictException(`User is already an employee`);
    }

    // Check if department exists
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID '${departmentId}' not found`);
    }

    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID '${roleId}' not found`);
    }

    // Update user type to EMPLOYEE
    await this.prisma.user.update({
      where: { id: userId },
      data: { userType: UserType.EMPLOYEE },
    });

    // Create employee
    const employee = await this.prisma.employee.create({
      data: {
        user: {
          connect: { id: userId },
        },
        department: {
          connect: { id: departmentId },
        },
        role: {
          connect: { id: roleId },
        },
        title,
      },
      include: {
        user: true,
        department: true,
        role: true,
      },
    });

    return employee;
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        user: true,
        department: true,
        role: true,
      },
    });
  }

  async findByDepartment(departmentId: string) {
    // Check if department exists
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID '${departmentId}' not found`);
    }

    return this.prisma.employee.findMany({
      where: {
        departmentId,
      },
      include: {
        user: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        role: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID '${id}' not found`);
    }

    return employee;
  }

  async findByUserId(userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: {
        user: true,
        department: true,
        role: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with user ID '${userId}' not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // Check if employee exists
    await this.findOne(id);

    const { departmentId, roleId, title } = updateEmployeeDto;

    // Check if department exists if provided
    if (departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        throw new NotFoundException(`Department with ID '${departmentId}' not found`);
      }
    }

    // Check if role exists if provided
    if (roleId) {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID '${roleId}' not found`);
      }
    }

    // Update employee
    return this.prisma.employee.update({
      where: { id },
      data: {
        department: departmentId ? {
          connect: { id: departmentId },
        } : undefined,
        role: roleId ? {
          connect: { id: roleId },
        } : undefined,
        title,
      },
      include: {
        user: true,
        department: true,
        role: true,
      },
    });
  }

  async remove(id: string) {
    // Check if employee exists
    const employee = await this.findOne(id);

    // Update user type to GUEST
    await this.prisma.user.update({
      where: { id: employee.userId },
      data: { userType: UserType.GUEST },
    });

    // Delete employee
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
