import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { Record, Prisma } from '@prisma/client';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    if (!createRecordDto.user_id) {
      throw new BadRequestException('User ID is required');
    }

    const userId = createRecordDto.user_id;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createRecordDto.category_id },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createRecordDto.category_id} not found`,
      );
    }

    // Check if balance will become negative
    const currentBalance = Number(user.balance);
    const expenseAmount = Number(createRecordDto.sum);
    const newBalance = currentBalance - expenseAmount;

    if (newBalance < 0) {
      throw new BadRequestException(
        `Insufficient balance. Current balance: ${currentBalance}, Required: ${expenseAmount}`,
      );
    }

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // Create the record
      const record = await tx.record.create({
        data: {
          user_id: userId,
          category_id: createRecordDto.category_id,
          sum: createRecordDto.sum,
        },
      });

      // Update user balance
      const updatedBalance = currentBalance - expenseAmount;
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: updatedBalance,
        },
      });

      return record;
    });
  }

  async findOne(id: string): Promise<Record> {
    const record = await this.prisma.record.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async findAll(userId?: string, categoryId?: string): Promise<Record[]> {
    const where: Prisma.RecordWhereInput = {};
    if (userId) {
      where.user_id = userId;
    }
    if (categoryId) {
      where.category_id = categoryId;
    }

    return this.prisma.record.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.record.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
  }
}
