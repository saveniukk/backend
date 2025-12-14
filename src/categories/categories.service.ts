import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './categories.model';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  private categories: Map<string, Category> = new Map();

  create(createCategoryDto: CreateCategoryDto): Category {
    const id = uuidv4();
    const category: Category = { id, ...createCategoryDto };
    this.categories.set(id, category);
    return category;
  }

  findAll(): Category[] {
    return Array.from(this.categories.values());
  }

  findOne(id: string): Category {
    const category = this.categories.get(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  remove(id: string): void {
    if (!this.categories.has(id)) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    this.categories.delete(id);
  }
}
