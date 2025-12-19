import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  user_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID(4, { message: 'Category ID must be a valid UUID' })
  category_id: string;

  @IsNumber({}, { message: 'Sum must be a number' })
  @IsPositive({ message: 'Sum must be a positive number' })
  @IsNotEmpty({ message: 'Sum is required' })
  sum: number;
}
