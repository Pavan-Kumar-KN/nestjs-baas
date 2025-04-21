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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoleService = class RoleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRoleDto) {
        try {
            console.log('Creating role with DTO:', createRoleDto);
            const { name, description, departmentId } = createRoleDto;
            if (departmentId) {
                console.log(`Checking if department ${departmentId} exists`);
                const department = await this.prisma.department.findUnique({
                    where: { id: departmentId },
                });
                if (!department) {
                    console.log(`Department with ID '${departmentId}' not found`);
                    throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
                }
                console.log(`Department found: ${department.name}`);
                console.log(`Checking if role with name '${name}' exists in department ${departmentId}`);
                const existingRole = await this.prisma.role.findFirst({
                    where: {
                        name,
                        departmentId,
                    },
                });
                if (existingRole) {
                    console.log(`Role with name '${name}' already exists in this department`);
                    throw new common_1.ConflictException(`Role with name '${name}' already exists in this department`);
                }
            }
            else {
                console.log(`Checking if global role with name '${name}' exists`);
                const existingRole = await this.prisma.role.findFirst({
                    where: {
                        name,
                        departmentId: null,
                    },
                });
                if (existingRole) {
                    console.log(`Global role with name '${name}' already exists`);
                    throw new common_1.ConflictException(`Global role with name '${name}' already exists`);
                }
            }
            console.log('Role validation passed, creating role');
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
        }
        catch (error) {
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
    async findByDepartment(departmentId) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Role with ID '${id}' not found`);
        }
        return role;
    }
    async update(id, updateRoleDto) {
        try {
            console.log(`Updating role with ID ${id}`, updateRoleDto);
            await this.findOne(id);
            console.log(`Role with ID ${id} found`);
            const { name, description, departmentId } = updateRoleDto;
            if (departmentId !== undefined) {
                if (departmentId) {
                    const department = await this.prisma.department.findUnique({
                        where: { id: departmentId },
                    });
                    if (!department) {
                        throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
                    }
                }
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
                        throw new common_1.ConflictException(`Role with name '${name}' already exists ${context}`);
                    }
                }
            }
            const updatedRole = await this.prisma.role.update({
                where: { id },
                data: {
                    name,
                    description,
                    department: departmentId !== undefined ? (departmentId ? { connect: { id: departmentId } } : { disconnect: true }) : undefined,
                },
                include: {
                    department: true,
                    permissions: true,
                },
            });
            console.log('Role updated successfully:', updatedRole);
            return updatedRole;
        }
        catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            console.log(`Removing role with ID ${id}`);
            await this.findOne(id);
            console.log(`Role with ID ${id} found`);
            const deletedRole = await this.prisma.role.delete({
                where: { id },
            });
            console.log('Role deleted successfully');
            return deletedRole;
        }
        catch (error) {
            console.error('Error removing role:', error);
            throw error;
        }
    }
    async addPermission(roleId, permissionId) {
        try {
            console.log(`Adding permission ${permissionId} to role ${roleId}`);
            await this.findOne(roleId);
            console.log(`Role with ID ${roleId} found`);
            const permission = await this.prisma.permission.findUnique({
                where: { id: permissionId },
            });
            if (!permission) {
                console.log(`Permission with ID '${permissionId}' not found`);
                throw new common_1.NotFoundException(`Permission with ID '${permissionId}' not found`);
            }
            console.log(`Permission with ID ${permissionId} found`);
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
        }
        catch (error) {
            console.error('Error adding permission to role:', error);
            throw error;
        }
    }
    async removePermission(roleId, permissionId) {
        try {
            console.log(`Removing permission ${permissionId} from role ${roleId}`);
            await this.findOne(roleId);
            console.log(`Role with ID ${roleId} found`);
            const permission = await this.prisma.permission.findUnique({
                where: { id: permissionId },
            });
            if (!permission) {
                console.log(`Permission with ID '${permissionId}' not found`);
                throw new common_1.NotFoundException(`Permission with ID '${permissionId}' not found`);
            }
            console.log(`Permission with ID ${permissionId} found`);
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
        }
        catch (error) {
            console.error('Error removing permission from role:', error);
            throw error;
        }
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map