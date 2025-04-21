import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name, organizationId } = createDepartmentDto;

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID '${organizationId}' not found`);
    }

    // Check if department with the same name already exists in the organization
    const existingDept = await this.prisma.department.findFirst({
      where: {
        name,
        organizationId,
      },
    });

    if (existingDept) {
      throw new ConflictException(`Department with name '${name}' already exists in this organization`);
    }

    // Create the department
    const department = await this.prisma.department.create({
      data: {
        name,
        organization: {
          connect: { id: organizationId },
        },
      },
      include: {
        organization: true,
      },
    });

    return department;
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        organization: true,
        employees: true,
        permissions: true,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID '${organizationId}' not found`);
    }

    return this.prisma.department.findMany({
      where: {
        organizationId,
      },
      include: {
        employees: true,
        permissions: true,
      },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        organization: true,
        employees: {
          include: {
            role: true,
          },
        },
        permissions: true,
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID '${id}' not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    // Check if department exists
    await this.findOne(id);

    const { name, organizationId } = updateDepartmentDto;

    // If changing organization, check if it exists
    if (organizationId) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new NotFoundException(`Organization with ID '${organizationId}' not found`);
      }
    }

    // If changing name, check for uniqueness within the organization
    if (name) {
      const department = await this.prisma.department.findUnique({
        where: { id },
      });

      if (!department) {
        throw new NotFoundException(`Department with ID '${id}' not found`);
      }

      const targetOrgId = organizationId || department.organizationId;

      const existingDept = await this.prisma.department.findFirst({
        where: {
          name,
          organizationId: targetOrgId,
          id: { not: id },
        },
      });

      if (existingDept) {
        throw new ConflictException(`Department with name '${name}' already exists in this organization`);
      }
    }

    // Update the department
    return this.prisma.department.update({
      where: { id },
      data: {
        name,
        organization: organizationId ? {
          connect: { id: organizationId },
        } : undefined,
      },
      include: {
        organization: true,
      },
    });
  }

  async remove(id: string) {
    // Check if department exists
    await this.findOne(id);

    // Delete the department
    return this.prisma.department.delete({
      where: { id },
    });
  }

  async addPermission(departmentId: string, permissionId: string) {
    // Check if department exists
    await this.findOne(departmentId);

    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID '${permissionId}' not found`);
    }

    // Add permission to department
    return this.prisma.department.update({
      where: { id: departmentId },
      data: {
        permissions: {
          connect: { id: permissionId },
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async removePermission(departmentId: string, permissionId: string) {
    // Check if department exists
    await this.findOne(departmentId);

    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID '${permissionId}' not found`);
    }

    // Remove permission from department
    return this.prisma.department.update({
      where: { id: departmentId },
      data: {
        permissions: {
          disconnect: { id: permissionId },
        },
      },
      include: {
        permissions: true,
      },
    });
  }
}
