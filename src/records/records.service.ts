import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Record } from './records.model';
import { CreateRecordDto } from './dto/create-record.dto';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class RecordsService {
  private records: Map<string, Record> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  create(createRecordDto: CreateRecordDto): Record {
    this.usersService.findOne(createRecordDto.user_id);
    this.categoriesService.findOne(createRecordDto.category_id);

    const id = uuidv4();
    const record: Record = {
      id,
      userId: createRecordDto.user_id,
      categoryId: createRecordDto.category_id,
      amount: createRecordDto.sum,
      timestamp: new Date().toISOString(),
    };

    this.records.set(id, record);
    return record;
  }

  findOne(id: string): Record {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    return record;
  }

  findAll(userId?: string, categoryId?: string): Record[] {
    if (!userId && !categoryId) {
      throw new BadRequestException(
        'At least one filter parameter (user_id or category_id) is required',
      );
    }

    const allRecords = Array.from(this.records.values());

    return allRecords.filter((record) => {
      let matches = true;
      if (userId && record.userId !== userId) matches = false;
      if (categoryId && record.categoryId !== categoryId) matches = false;
      return matches;
    });
  }

  remove(id: string): void {
    if (!this.records.has(id)) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    this.records.delete(id);
  }
}
