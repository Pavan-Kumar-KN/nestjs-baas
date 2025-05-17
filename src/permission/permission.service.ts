import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { key, description } = createPermissionDto;

    // Check if permission with the same key already exists
    const existingPermission = await this.prisma.permission.findUnique({
      where: { key },
    });

    if (existingPermission) {
      throw new ConflictException(`Permission with key '${key}' already exists`);
    }

    // Create the permission
    const permission = await this.prisma.permission.create({
      data: {
        key,
        description,
      },
    });

    return permission;
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
        departments: true,
        userPermissions: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID '${id}' not found`);
    }

    return permission;
  }

  async findByKey(key: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { key },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with key '${key}' not found`);
    }

    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    // Check if permission exists
    await this.findOne(id);

    const { key, description } = updatePermissionDto;

    // If changing key, check if it's already taken
    if (key) {
      const existingPermission = await this.prisma.permission.findFirst({
        where: {
          key,
          id: { not: id },
        },
      });

      if (existingPermission) {
        throw new ConflictException(`Permission with key '${key}' already exists`);
      }
    }

    // Update the permission
    return this.prisma.permission.update({
      where: { id },
      data: {
        key,
        description,
      },
    });
  }

  async remove(id: string) {
    // Check if permission exists
    await this.findOne(id);

    // Delete the permission
    return this.prisma.permission.delete({
      where: { id },
    });
  }

  async assignToUser(userId: string, permissionId: string, active: boolean = true) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    // Check if permission exists
    const permission = await this.findOne(permissionId);

    // Check if user already has this permission
    const existingUserPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permissionId,
      },
    });

    if (existingUserPermission) {
      // Update the existing user permission
      return this.prisma.userPermission.update({
        where: { id: existingUserPermission.id },
        data: { active },
        include: {
          user: true,
          permission: true,
        },
      });
    }

    // Create a new user permission
    return this.prisma.userPermission.create({
      data: {
        user: {
          connect: { id: userId },
        },
        permission: {
          connect: { id: permissionId },
        },
        active,
      },
      include: {
        user: true,
        permission: true,
      },
    });
  }

  async removeFromUser(userId: string, permissionId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    // Check if permission exists
    await this.findOne(permissionId);

    // Check if user has this permission
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permissionId,
      },
    });

    if (!userPermission) {
      throw new NotFoundException(`User does not have this permission`);
    }

    // Delete the user permission
    return this.prisma.userPermission.delete({
      where: { id: userPermission.id },
    });
  }
}
