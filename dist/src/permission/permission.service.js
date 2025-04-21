"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionService = class PermissionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPermissionDto) {
        const { key, description } = createPermissionDto;
        const existingPermission = await this.prisma.permission.findUnique({
            where: { key },
        });
        if (existingPermission) {
            throw new common_1.ConflictException(`Permission with key '${key}' already exists`);
        }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Permission with ID '${id}' not found`);
        }
        return permission;
    }
    async findByKey(key) {
        const permission = await this.prisma.permission.findUnique({
            where: { key },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with key '${key}' not found`);
        }
        return permission;
    }
    async update(id, updatePermissionDto) {
        await this.findOne(id);
        const { key, description } = updatePermissionDto;
        if (key) {
            const existingPermission = await this.prisma.permission.findFirst({
                where: {
                    key,
                    id: { not: id },
                },
            });
            if (existingPermission) {
                throw new common_1.ConflictException(`Permission with key '${key}' already exists`);
            }
        }
        return this.prisma.permission.update({
            where: { id },
            data: {
                key,
                description,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.permission.delete({
            where: { id },
        });
    }
    async assignToUser(userId, permissionId, active = true) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID '${userId}' not found`);
        }
        const permission = await this.findOne(permissionId);
        const existingUserPermission = await this.prisma.userPermission.findFirst({
            where: {
                userId,
                permissionId,
            },
        });
        if (existingUserPermission) {
            return this.prisma.userPermission.update({
                where: { id: existingUserPermission.id },
                data: { active },
                include: {
                    user: true,
                    permission: true,
                },
            });
        }
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
    async removeFromUser(userId, permissionId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID '${userId}' not found`);
        }
        await this.findOne(permissionId);
        const userPermission = await this.prisma.userPermission.findFirst({
            where: {
                userId,
                permissionId,
            },
        });
        if (!userPermission) {
            throw new common_1.NotFoundException(`User does not have this permission`);
        }
        return this.prisma.userPermission.delete({
            where: { id: userPermission.id },
        });
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionService);
//# sourceMappingURL=permission.service.js.map