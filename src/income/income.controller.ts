import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('income')
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  async addIncome(
    @Body() createIncomeDto: CreateIncomeDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.incomeService.addIncome({
      ...createIncomeDto,
      user_id: user.id,
    });
  }
}

