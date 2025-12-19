import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('record')
@UseGuards(JwtAuthGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @CurrentUser() user: User,
  ): Promise<Record> {
    return this.recordsService.create({
      ...createRecordDto,
      user_id: user.id,
    });
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('user_id') userId?: string,
    @Query('category_id') categoryId?: string,
  ): Promise<Record[]> {
    const finalUserId = userId || user.id;
    return this.recordsService.findAll(finalUserId, categoryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Record> {
    return this.recordsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.recordsService.remove(id);
    return { message: 'Record deleted successfully' };
  }
}
