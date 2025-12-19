import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Category {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
