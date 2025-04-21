import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        department: {
            id: string;
            name: string;
            organizationId: string;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    }>;
    findAll(): Promise<({
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        department: {
            id: string;
            name: string;
            organizationId: string;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    })[]>;
    findByDepartment(id: string): Promise<({
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    })[]>;
    findByUserId(id: string): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        department: {
            id: string;
            name: string;
            organizationId: string;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    }>;
    findOne(id: string): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        department: {
            id: string;
            name: string;
            organizationId: string;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    }>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            departmentId: string | null;
        };
        department: {
            id: string;
            name: string;
            organizationId: string;
        };
        user: {
            id: string;
            username: string;
            email: string | null;
            password: string;
            refreshTokens: string | null;
            accessTokens: string | null;
            userType: import(".prisma/client").$Enums.UserType;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        departmentId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        title: string | null;
    }>;
}
