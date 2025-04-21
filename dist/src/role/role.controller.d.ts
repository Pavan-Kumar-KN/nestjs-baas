import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto, req: any): Promise<{
        department: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
    }>;
    findAll(): Promise<({
        department: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
    })[]>;
    findByDepartment(id: string): Promise<({
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
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
        admins: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            roleId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        department: {
            id: string;
            name: string;
            organizationId: string;
        } | null;
        permissions: {
            id: string;
            description: string | null;
            key: string;
            resourceTypeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        departmentId: string | null;
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
        description: string | null;
        departmentId: string | null;
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
        description: string | null;
        departmentId: string | null;
    }>;
}
