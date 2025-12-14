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
import { Record } from './records.model';

@Controller('record')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(@Body() createRecordDto: CreateRecordDto): Record {
    return this.recordsService.create(createRecordDto);
  }

  @Get()
  findAll(
    @Query('user_id') userId?: string,
    @Query('category_id') categoryId?: string,
  ): Record[] {
    return this.recordsService.findAll(userId, categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Record {
    return this.recordsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.recordsService.remove(id);
    return { message: 'Record deleted successfully' };
  }
}
