import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersController {
    private readonly usersService;
    private readonly prisma;
    constructor(usersService: UsersService, prisma: PrismaService);
    getProfile(req: any): Promise<{
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
