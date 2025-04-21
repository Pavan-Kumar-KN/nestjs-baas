import { UserType } from '@prisma/client';
export declare class CreateUserDto {
    username: string;
    email?: string;
    password: string;
    userType?: UserType;
}
