import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Location, LocationDocument } from 'src/schemas/location.schema';
import { Spec, SpecDocument } from 'src/schemas/spec.schema';
import {
  Supply,
  SupplyDocument,
  SupplyStatus,
} from 'src/schemas/supply.schema';
import { UserDocument } from 'src/schemas/user.schema';
import { PostSupplyDto } from '../client/supply/dtos/post-supply.dto';
import { PutSupplyDto } from './dtos/put-supply.dto';
import { QuerySupplyDto } from '../client/supply/dtos/query-supply.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SupplyService {
  constructor(
    @InjectModel(Supply.name) private supplyModel: Model<SupplyDocument>,
    @InjectModel(Spec.name) private specModel: Model<SpecDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private mailService: MailService,
  ) {}

  async createSupply(owner: UserDocument, body: PostSupplyDto) {
    const specs = [];
    const categories = [];
    const locations = [];

    for (const specBody of body.specs) {
      const spec = await this.specModel.findById(specBody.id);

      if (!spec)
        throw new NotFoundException({
          success: false,
          code: 404,
          message: 'Không tìm thấy thiết lập!',
        });

      const newSpec = new Spec();
      newSpec.name = spec.name;
      newSpec.value = specBody.value;
      newSpec.required = spec.required;
      newSpec.parent = spec.parent;

      specs.push(newSpec);
    }

    for (const categoryId of body.categories) {
      const category = await this.categoryModel
        .findById(categoryId)
        .select('-subCategories -specs');

      if (!category)
        throw new NotFoundException({
          success: false,
          code: 404,
          message: 'Không tìm thấy danh mục!',
        });

      categories.push(category);
    }

    for (const locationId of body.locations) {
      const location = await this.locationModel
        .findById(locationId)
        .select('-subLocations');

      if (!location)
        throw new NotFoundException({
          success: false,
          code: 404,
          message: 'Không tìm thấy địa điểm!',
        });

      locations.push(location);
    }

    const supply = await this.supplyModel.create({
      ...body,
      owner: owner._id,
      specs,
      categories,
      locations,
    });

    await this.mailService.sendSupplySubmitted(supply);

    return supply;
  }

  async getAllSupplies() {
    const supplies = this.supplyModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('owner')
      .select('-owner.password');

    return supplies;
  }

  async getActiveSupplies(queryBody: QuerySupplyDto) {
    var query: Record<string, any> = {
      status: SupplyStatus.ACTIVE,
    };

    if (queryBody.queryText)
      query.$or = [
        { name: { $regex: queryBody.queryText, $options: 'i' } },
        { 'locations.name': { $regex: queryBody.queryText, $options: 'i' } },
        { 'categories.name': { $regex: queryBody.queryText, $options: 'i' } },
      ];

    if (queryBody.categorySlug)
      query['categories.slug'] = queryBody.categorySlug;

    const supplies = await this.supplyModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .skip(20 * queryBody.page)
      .populate('owner')
      .select('-owner.password');

    return supplies;
  }

  async getSupply(id: string) {
    const supply = await this.supplyModel
      .findById(id)
      .populate('owner')
      .select('-owner.password');

    if (!supply)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy sản phẩm!',
      });

    return supply;
  }

  async updateSupply(id: string, body: PutSupplyDto) {
    const supply = await this.getSupply(id);

    supply.status = body.status;

    if (body.reason) supply.reason = body.reason;

    await supply.save();

    if (body.sendEmail) {
      if (body.status === SupplyStatus.DECLINED)
        await this.mailService.sendSupplyToDeclined(supply);
      if (body.status == SupplyStatus.ACTIVE)
        await this.mailService.sendSupplyToActive(supply);
      if (body.status == SupplyStatus.ARCHIVED)
        await this.mailService.sendSupplyToArchive(supply);
    }

    return supply;
  }

  async deleteSupply(id: string) {
    const supply = await this.getSupply(id);

    if (
      supply.status !== SupplyStatus.ARCHIVED &&
      supply.status !== SupplyStatus.DECLINED
    )
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Không thể xóa sản phẩm chưa được lưu trữ hoặc từ chối!',
      });

    await supply.delete();
  }

  async getOwnSupplies(user: UserDocument) {
    return await this.supplyModel
      .find({
        owner: user._id,
        status: { $ne: SupplyStatus.ARCHIVED },
      })
      .sort({ createdAt: -1 });
  }
}
