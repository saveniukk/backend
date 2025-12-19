import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from '@prisma/client';

@Controller('record')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  async create(@Body() createRecordDto: CreateRecordDto): Promise<Record> {
    return this.recordsService.create(createRecordDto);
  }

  @Get()
  async findAll(
    @Query('user_id') userId?: string,
    @Query('category_id') categoryId?: string,
  ): Promise<Record[]> {
    return this.recordsService.findAll(userId, categoryId);
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
