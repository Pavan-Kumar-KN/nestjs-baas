import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateEmployeeDto {
  @IsUUID(4, { message: 'Department ID must be a valid UUID' })
  @IsOptional()
  departmentId?: string;

  @IsUUID(4, { message: 'Role ID must be a valid UUID' })
  @IsOptional()
  roleId?: string;

  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title?: string;
}
