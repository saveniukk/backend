import { Controller, Post, Body } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { User } from '@prisma/client';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  async addIncome(@Body() createIncomeDto: CreateIncomeDto): Promise<User> {
    return this.incomeService.addIncome(createIncomeDto);
  }
}

