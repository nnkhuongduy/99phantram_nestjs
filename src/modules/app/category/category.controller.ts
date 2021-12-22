import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/app-jwt.guard';

import { CategoryService } from 'src/modules/category/category.service';
import { PostCategoryBodyDto } from 'src/modules/category/dto/post-category-body';
import { PutCategoryBodyDto } from 'src/modules/category/dto/put-category-body';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Controller('/api/app/categories')
export class AppCategoryController {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private categoryService: CategoryService,
  ) {}

  private _mapping(category: CategoryDocument) {
    return {
      ...category.toJSON(),
      id: category._id,
      specs: category.specs.map((spec: any) => ({
        ...spec.toJSON(),
        id: spec._id,
      })),
    };
  }

  @Get()
  @UseGuards(AppJwtAuthGuard)
  async getAllCategories() {
    return (await this.categoryModel.find()).map((_) => this._mapping(_));
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  async getCategory(@Param('id') id: string) {
    return this._mapping(await this.categoryService.getCategory(id));
  }

  @Post()
  @UseGuards(AppJwtAuthGuard)
  async createCategory(@Body() body: PostCategoryBodyDto) {
    return this._mapping(await this.categoryService.createCategory(body));
  }

  @Put(':id')
  @UseGuards(AppJwtAuthGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() body: PutCategoryBodyDto,
  ) {
    await this.categoryService.updateCategory(body, id);
  }

  @Delete(':id')
  @UseGuards(AppJwtAuthGuard)
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
  }
}
