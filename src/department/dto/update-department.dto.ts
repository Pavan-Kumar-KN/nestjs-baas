import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name?: string;

  @IsUUID(4, { message: 'Organization ID must be a valid UUID' })
  @IsOptional()
  organizationId?: string;
}
