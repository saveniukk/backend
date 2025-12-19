import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name must not be empty' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;
}
