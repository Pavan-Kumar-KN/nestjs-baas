import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must be at most 500 characters long' })
  description?: string;

  @IsUUID(4, { message: 'Department ID must be a valid UUID' })
  @IsOptional()
  departmentId?: string;
}
