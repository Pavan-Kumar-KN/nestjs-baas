import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      console.log('Creating role with DTO:', createRoleDto);

      const { name, description, departmentId } = createRoleDto;

      // If departmentId is provided, check if department exists
      if (departmentId) {
        console.log(`Checking if department ${departmentId} exists`);

        const department = await this.prisma.department.findUnique({
          where: { id: departmentId },
        });

        if (!department) {
          console.log(`Department with ID '${departmentId}' not found`);
          throw new NotFoundException(`Department with ID '${departmentId}' not found`);
        }

        console.log(`Department found: ${department.name}`);

        // Check if role with the same name already exists in the department
        console.log(`Checking if role with name '${name}' exists in department ${departmentId}`);

        const existingRole = await this.prisma.role.findFirst({
          where: {
            name,
            departmentId,
          },
        });

        if (existingRole) {
          console.log(`Role with name '${name}' already exists in this department`);
          throw new ConflictException(`Role with name '${name}' already exists in this department`);
        }
      } else {
        // Check if global role with the same name already exists
        console.log(`Checking if global role with name '${name}' exists`);

        const existingRole = await this.prisma.role.findFirst({
          where: {
            name,
            departmentId: null,
          },
        });

        if (existingRole) {
          console.log(`Global role with name '${name}' already exists`);
          throw new ConflictException(`Global role with name '${name}' already exists`);
        }
      }

      console.log('Role validation passed, creating role');

      // Create the role
      const role = await this.prisma.role.create({
        data: {
          name,
          description,
          department: departmentId ? {
            connect: { id: departmentId },
          } : undefined,
        },
        include: {
          department: true,
          permissions: true,
        },
      });

      console.log('Role created successfully:', role);
      return role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        department: true,
        permissions: true,
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

    return this.prisma.role.findMany({
      where: {
        departmentId,
      },
      include: {
        permissions: true,
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        department: true,
        permissions: true,
        employees: true,
        admins: true,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      console.log(`Updating role with ID ${id}`, updateRoleDto);

      // Check if role exists
      await this.findOne(id);
      console.log(`Role with ID ${id} found`);

      const { name, description, departmentId } = updateRoleDto;

      // If changing department, check if it exists
      if (departmentId !== undefined) {
        if (departmentId) {
          const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
          });

          if (!department) {
            throw new NotFoundException(`Department with ID '${departmentId}' not found`);
          }
        }

        // If changing name, check for uniqueness within the department
        if (name) {
          const targetDeptId = departmentId !== null ? departmentId : null;

          const duplicateRole = await this.prisma.role.findFirst({
            where: {
              name,
              departmentId: targetDeptId,
              id: { not: id },
            },
          });

          if (duplicateRole) {
            const context = targetDeptId ? 'in this department' : 'as a global role';
            throw new ConflictException(`Role with name '${name}' already exists ${context}`);
          }
        }
      }

      // Update the role
      const updatedRole = await this.prisma.role.update({
        where: { id },
        data: {
          name,
          description,
          department: departmentId !== undefined ? (
            departmentId ? { connect: { id: departmentId } } : { disconnect: true }
          ) : undefined,
        },
        include: {
          department: true,
          permissions: true,
        },
      });

      console.log('Role updated successfully:', updatedRole);
      return updatedRole;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      console.log(`Removing role with ID ${id}`);

      // Check if role exists
      await this.findOne(id);
      console.log(`Role with ID ${id} found`);

      // Delete the role
      const deletedRole = await this.prisma.role.delete({
        where: { id },
      });

      console.log('Role deleted successfully');
      return deletedRole;
    } catch (error) {
      console.error('Error removing role:', error);
      throw error;
    }
  }

  async addPermission(roleId: string, permissionId: string) {
    try {
      console.log(`Adding permission ${permissionId} to role ${roleId}`);

      // Check if role exists
      await this.findOne(roleId);
      console.log(`Role with ID ${roleId} found`);

      // Check if permission exists
      const permission = await this.prisma.permission.findUnique({
        where: { id: permissionId },
      });

      if (!permission) {
        console.log(`Permission with ID '${permissionId}' not found`);
        throw new NotFoundException(`Permission with ID '${permissionId}' not found`);
      }

      console.log(`Permission with ID ${permissionId} found`);

      // Add permission to role
      const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: { id: permissionId },
          },
        },
        include: {
          permissions: true,
        },
      });

      console.log('Permission added to role successfully');
      return updatedRole;
    } catch (error) {
      console.error('Error adding permission to role:', error);
      throw error;
    }
  }

  async removePermission(roleId: string, permissionId: string) {
    try {
      console.log(`Removing permission ${permissionId} from role ${roleId}`);

      // Check if role exists
      await this.findOne(roleId);
      console.log(`Role with ID ${roleId} found`);

      // Check if permission exists
      const permission = await this.prisma.permission.findUnique({
        where: { id: permissionId },
      });

      if (!permission) {
        console.log(`Permission with ID '${permissionId}' not found`);
        throw new NotFoundException(`Permission with ID '${permissionId}' not found`);
      }

      console.log(`Permission with ID ${permissionId} found`);

      // Remove permission from role
      const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            disconnect: { id: permissionId },
          },
        },
        include: {
          permissions: true,
        },
      });

      console.log('Permission removed from role successfully');
      return updatedRole;
    } catch (error) {
      console.error('Error removing permission from role:', error);
      throw error;
    }
  }
}
