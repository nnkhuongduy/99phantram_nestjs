import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Location,
  LocationDocument,
  LocationLevel,
  LocationStatus,
} from 'src/schemas/location.schema';

@Controller('api/location')
export class ClientLocationController {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  @Get('provinces')
  async getAllProvinces() {
    return (
      await this.locationModel
        .find({
          locationLevel: LocationLevel.PROVINCE,
          status: { $ne: LocationStatus.ARCHIVED },
        })
        .select('-subLocations')
    ).map((_) => {
      const location = _.toJSON();

      return { ...location, id: location._id };
    });
  }

  @Get('wards/:id')
  async getAllWards(@Param('id') id: string) {
    const province = await this.locationModel
      .findOne({
        _id: id,
        locationLevel: LocationLevel.PROVINCE,
        status: { $ne: LocationStatus.ARCHIVED },
      })
      .populate('subLocations');

    if (!province)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy vị trí!',
      });

    return province.subLocations.map((_) => {
      const location = (_ as any).toJSON();

      return { ...location, id: location._id };
    });
  }

  @Get('blocks/:id')
  async getAllBlocks(@Param('id') id: string) {
    const province = await this.locationModel
      .findOne({
        _id: id,
        locationLevel: LocationLevel.WARD,
        status: { $ne: LocationStatus.ARCHIVED },
      })
      .populate('subLocations');

    if (!province)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy vị trí!',
      });

    return province.subLocations.map((_) => {
      const location = (_ as any).toJSON();

      return { ...location, id: location._id };
    });
  }
}
