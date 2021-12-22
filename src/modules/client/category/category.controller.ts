import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Category,
  CategoryDocument,
  CategoryStatus,
  CategoryLevel,
} from 'src/schemas/category.schema';

@Controller('/api/category')
export class ClientCategoryController {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  @Get('primary')
  async getAllPrimaryCategories() {
    return (
      await this.categoryModel.find({
        status: { $ne: CategoryStatus.ARCHIVED },
        categoryLevel: CategoryLevel.PRIMARY,
      })
    ).map((_) => {
      const category = _.toJSON();

      return {
        ...category,
        id: category._id,
      };
    });
  }

  @Get('secondary/:idOrSlug')
  async getSecondaryCategories(@Param('idOrSlug') idOrSlug: string) {
    const query =
      idOrSlug.length === 24
        ? {
            _id: idOrSlug,
          }
        : { slug: idOrSlug };

    const category = await this.categoryModel
      .findOne({ ...query, status: { $ne: CategoryStatus.ARCHIVED } })
      .populate('subCategories');

    if (!category)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy danh mục!',
      });

    return category.subCategories.map((_) => {
      const category = (_ as any).toJSON();

      return {
        ...category,
        id: category._id,
        specs: category.specs.map((spec) => ({
          ...spec,
          id: spec._id,
        })),
      };
    });
  }

  @Get('detail/:idOrSlug')
  async getCategory(@Param('idOrSlug') idOrSlug: string) {
    const query =
      idOrSlug.length === 24
        ? {
            _id: idOrSlug,
          }
        : { slug: idOrSlug };

    const category = await this.categoryModel.findOne({
      ...query,
      status: { $ne: CategoryStatus.ARCHIVED },
    });

    if (!category)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy danh mục!',
      });

    return { ...category.toJSON(), id: category._id };
  }
}
