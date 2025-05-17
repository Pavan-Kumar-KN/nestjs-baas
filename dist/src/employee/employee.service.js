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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmployeeService = class EmployeeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEmployeeDto) {
        const { userId, departmentId, roleId, title } = createEmployeeDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID '${userId}' not found`);
        }
        const existingEmployee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (existingEmployee) {
            throw new common_1.ConflictException(`User is already an employee`);
        }
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
        }
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID '${roleId}' not found`);
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { userType: client_1.UserType.EMPLOYEE },
        });
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
    async findByDepartment(departmentId) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
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
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
                department: true,
                role: true,
            },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID '${id}' not found`);
        }
        return employee;
    }
    async findByUserId(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: {
                user: true,
                department: true,
                role: true,
            },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with user ID '${userId}' not found`);
        }
        return employee;
    }
    async update(id, updateEmployeeDto) {
        await this.findOne(id);
        const { departmentId, roleId, title } = updateEmployeeDto;
        if (departmentId) {
            const department = await this.prisma.department.findUnique({
                where: { id: departmentId },
            });
            if (!department) {
                throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
            }
        }
        if (roleId) {
            const role = await this.prisma.role.findUnique({
                where: { id: roleId },
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID '${roleId}' not found`);
            }
        }
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
    async remove(id) {
        const employee = await this.findOne(id);
        await this.prisma.user.update({
            where: { id: employee.userId },
            data: { userType: client_1.UserType.GUEST },
        });
        return this.prisma.employee.delete({
            where: { id },
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map