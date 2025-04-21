import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const { name, description } = createOrganizationDto;

    // Check if organization with the same name already exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { name },
    });

    if (existingOrg) {
      throw new ConflictException(`Organization with name '${name}' already exists`);
    }

    // Create the organization
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

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        departments: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID '${id}' not found`);
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    // Check if organization exists
    await this.findOne(id);

    // Check if name is being updated and if it's already taken
    if (updateOrganizationDto.name) {
      const existingOrg = await this.prisma.organization.findFirst({
        where: {
          name: updateOrganizationDto.name,
          id: { not: id },
        },
      });

      if (existingOrg) {
        throw new ConflictException(`Organization with name '${updateOrganizationDto.name}' already exists`);
      }
    }

    // Update the organization
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    // Check if organization exists
    await this.findOne(id);

    // Delete the organization
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
