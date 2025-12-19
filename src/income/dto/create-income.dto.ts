import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  user_id?: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be a positive number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}

