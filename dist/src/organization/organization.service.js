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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationService = class OrganizationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrganizationDto) {
        const { name, description } = createOrganizationDto;
        const existingOrg = await this.prisma.organization.findUnique({
            where: { name },
        });
        if (existingOrg) {
            throw new common_1.ConflictException(`Organization with name '${name}' already exists`);
        }
        const organization = await this.prisma.organization.create({
            data: {
                name,
                description,
            },
        });
        return organization;
    }
    async findAll() {
        return this.prisma.organization.findMany({
            include: {
                departments: true,
            },
        });
    }
    async findOne(id) {
        const organization = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                departments: true,
            },
        });
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID '${id}' not found`);
        }
        return organization;
    }
    async update(id, updateOrganizationDto) {
        await this.findOne(id);
        if (updateOrganizationDto.name) {
            const existingOrg = await this.prisma.organization.findFirst({
                where: {
                    name: updateOrganizationDto.name,
                    id: { not: id },
                },
            });
            if (existingOrg) {
                throw new common_1.ConflictException(`Organization with name '${updateOrganizationDto.name}' already exists`);
            }
        }
        return this.prisma.organization.update({
            where: { id },
            data: updateOrganizationDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.organization.delete({
            where: { id },
        });
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map