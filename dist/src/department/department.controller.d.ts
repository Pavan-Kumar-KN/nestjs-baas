import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentController {
    private readonly departmentService;
    constructor(departmentService: DepartmentService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
        organization: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
    }>;
    findAll(): Promise<({
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
        employees: {
            id: string;
            departmentId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
            title: string | null;
        }[];
        organization: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
    })[]>;
    findByOrganization(id: string): Promise<({
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
        employees: {
            id: string;
            departmentId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
            title: string | null;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
    })[]>;
    findOne(id: string): Promise<{
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
        employees: ({
            role: {
                id: string;
                name: string;
                description: string | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            departmentId: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
            title: string | null;
        })[];
        organization: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
    }>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        organization: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        organizationId: string;
    }>;
    addPermission(id: string, permissionId: string): Promise<{
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
    }>;
    removePermission(id: string, permissionId: string): Promise<{
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
    }>;
}
