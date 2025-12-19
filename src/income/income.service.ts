import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async addIncome(createIncomeDto: CreateIncomeDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: createIncomeDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createIncomeDto.user_id} not found`,
      );
    }

    const currentBalance = Number(user.balance);
    const newBalance = currentBalance + createIncomeDto.amount;

    return this.prisma.user.update({
      where: { id: createIncomeDto.user_id },
      data: {
        balance: newBalance,
      },
    });
  }
}

