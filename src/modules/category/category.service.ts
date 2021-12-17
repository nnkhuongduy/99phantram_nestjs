import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { kebabCase } from 'lodash';

import {
  CategoryDocument,
  Category,
  CategoryStatus,
  CategoryLevel,
} from 'src/schemas/category.schema';
import {
  Supply,
  SupplyDocument,
  SupplyStatus,
} from 'src/schemas/supply.schema';
import { PostCategoryBodyDto } from './dto/post-category-body';
import { PutCategoryBodyDto } from './dto/put-category-body';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Supply.name) private supplyModel: Model<SupplyDocument>,
  ) {}

  private async _removeFromParents(category: CategoryDocument) {
    const parents = await this.categoryModel.find({
      subCategories: category._id,
    });

    for (const _ of parents) {
      _.subCategories = _.subCategories.filter(
        (__: string) => __ !== category._id,
      );

      await _.save();
    }
  }

  async archiveCategory(category: CategoryDocument): Promise<void> {
    const supplies = await this.supplyModel.find({
      status: { $ne: SupplyStatus.ARCHIVED },
      categories: {
        $elemMatch: {
          _id: category._id,
        },
      },
    });

    if (supplies.length > 0) {
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Không thể lưu trữ danh mục vẫn còn sản phẩm đang sử dụng!"',
      });
    }

    category.status = CategoryStatus.ARCHIVED;

    await category.save();

    if (category.categoryLevel == CategoryLevel.SECONDARY) {
      const parentCategories = await this.categoryModel.find({
        subCategories: {
          $elemMatch: {
            _id: category._id,
          },
        },
      });

      for (const _ of parentCategories) {
        _.subCategories = _.subCategories.filter(
          (id: string) => id !== category._id,
        );
        await _.save();
      }
    }
  }

  async createCategory(body: PostCategoryBodyDto): Promise<CategoryDocument> {
    const category = (await this.categoryModel.create({
      ...body,
      specs: [],
      subCategories: [],
      slug: kebabCase(body.slug),
    })) as CategoryDocument;

    return category;
  }

  async getCategory(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);

    if (!category)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy danh mục sản phẩm!',
      });

    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategory(id);

    if (category.status !== CategoryStatus.ARCHIVED)
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Danh mục không thể xóa!',
      });

    await category.delete();
  }

  async updateCategory(
    body: PutCategoryBodyDto,
    id: string,
  ): Promise<CategoryDocument> {
    let subCategories: string[];

    const supplies = (await this.supplyModel.find({
      status: { $ne: SupplyStatus.ARCHIVED },
      categories: {
        $elemMatch: {
          _id: id,
        },
      },
    })) as SupplyDocument[];
    const updatingCategory = await this.getCategory(id);

    try {
      subCategories = (
        await this.categoryModel.find({
          _id: { $in: body.subCategories },
        })
      ).map((_) => _._id);
    } catch (error) {
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Không tìm thấy danh mục con',
      });
    }

    if (updatingCategory.categoryLevel !== body.categoryLevel) {
      if (
        updatingCategory.categoryLevel === CategoryLevel.PRIMARY &&
        updatingCategory.subCategories.length > 0
      )
        throw new BadRequestException({
          success: false,
          code: 400,
          message: 'Không thể đổi cấp danh mục khi vẫn còn danh mục con!',
        });

      if (
        updatingCategory.categoryLevel === CategoryLevel.SECONDARY &&
        supplies.length > 0
      )
        throw new BadRequestException({
          success: false,
          code: 400,
          message:
            'Không thể đổi cấp danh mục khi vẫn còn sản phẩm sử dụng danh mục!',
        });

      await this._removeFromParents(updatingCategory);
      subCategories = [];
    }

    if (body.status === CategoryStatus.ARCHIVED)
      await this.archiveCategory(updatingCategory);

    updatingCategory.name = body.name;
    updatingCategory.image = body.image;
    updatingCategory.categoryLevel = body.categoryLevel;
    updatingCategory.status = body.status;
    updatingCategory.subCategories = subCategories;
    updatingCategory.slug = kebabCase(body.slug);

    await updatingCategory.save();

    for (const supply of supplies) {
      supply.categories = supply.categories.map((_) => {
        if (_._id === id) {
          return {
            ..._,
            ...body,
            slug: kebabCase(body.slug),
          };
        }

        return _;
      }) as CategoryDocument[];

      await supply.save();
    }

    return updatingCategory;
  }
}
