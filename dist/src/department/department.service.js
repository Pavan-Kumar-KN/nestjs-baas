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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DepartmentService = class DepartmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDepartmentDto) {
        const { name, organizationId } = createDepartmentDto;
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID '${organizationId}' not found`);
        }
        const existingDept = await this.prisma.department.findFirst({
            where: {
                name,
                organizationId,
            },
        });
        if (existingDept) {
            throw new common_1.ConflictException(`Department with name '${name}' already exists in this organization`);
        }
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
    async findByOrganization(organizationId) {
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID '${organizationId}' not found`);
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Department with ID '${id}' not found`);
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        await this.findOne(id);
        const { name, organizationId } = updateDepartmentDto;
        if (organizationId) {
            const organization = await this.prisma.organization.findUnique({
                where: { id: organizationId },
            });
            if (!organization) {
                throw new common_1.NotFoundException(`Organization with ID '${organizationId}' not found`);
            }
        }
        if (name) {
            const department = await this.prisma.department.findUnique({
                where: { id },
            });
            if (!department) {
                throw new common_1.NotFoundException(`Department with ID '${id}' not found`);
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
                throw new common_1.ConflictException(`Department with name '${name}' already exists in this organization`);
            }
        }
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.department.delete({
            where: { id },
        });
    }
    async addPermission(departmentId, permissionId) {
        await this.findOne(departmentId);
        const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID '${permissionId}' not found`);
        }
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
    async removePermission(departmentId, permissionId) {
        await this.findOne(departmentId);
        const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID '${permissionId}' not found`);
        }
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
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map