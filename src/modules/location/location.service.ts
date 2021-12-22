import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Location,
  LocationDocument,
  LocationStatus,
} from 'src/schemas/location.schema';
import { Supply, SupplyDocument } from 'src/schemas/supply.schema';
import { CreateLocationDto } from '../app/location/dtos/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    @InjectModel(Supply.name) private supplyModel: Model<SupplyDocument>,
  ) {}

  private async _removeFromParents(location: LocationDocument) {
    const parentLocations = await this.locationModel.find({
      subLocations: location._id,
    });

    for (const _location of parentLocations) {
      _location.subLocations = _location.subLocations.filter(
        (id) => id !== location._id,
      );

      await _location.save();
    }
  }

  async archiveLocation(location: LocationDocument) {
    const supplies = await this.supplyModel.find({
      locations: { $elemMatch: { _id: location._id } },
    });

    if (supplies.length > 0)
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Không thể lưu trữ địa điểm vẫn còn sản phẩm đang sử dụng!',
      });

    location.status = LocationStatus.ARCHIVED;
    location.subLocations = [];

    await this._removeFromParents(location);

    await location.save();

    return location;
  }

  async createLocation(body: CreateLocationDto) {
    return await this.locationModel.create({
      ...body,
    });
  }

  async getLocation(id: string) {
    const location = await this.locationModel.findById(id);

    if (!location)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy địa điểm!',
      });

    return location;
  }

  async deleteLocation(id: string) {
    const location = await this.getLocation(id);

    if (location.status !== LocationStatus.ARCHIVED)
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Không thể xóa địa điểm chưa được lưu trữ!',
      });

    await location.delete();
  }

  async updateLocation(id: string, body: CreateLocationDto) {
    let location = (await this.getLocation(id)) as LocationDocument;
    let subLocations = [];
    const supplies = await this.supplyModel.find({
      locations: { $elemMatch: { _id: id } },
    });

    if (body.status === LocationStatus.ARCHIVED)
      location = await this.archiveLocation(location);

    if (location.locationLevel !== body.locationLevel) {
      if (supplies.length > 0)
        throw new BadRequestException({
          success: false,
          code: 400,
          message:
            'Không thể thay đổi cấp địa điểm khi vẫn còn sản phẩm đang sử dụng!',
        });

      await this._removeFromParents(location);
      subLocations = [];
    } else {
      if (body.subLocations !== null)
        subLocations = (
          await this.locationModel.find({ _id: body.subLocations })
        ).map((_) => _._id);
      else subLocations = location.subLocations;
    }

    location.name = body.name;
    location.locationLevel = body.locationLevel;
    location.status = body.status;
    location.subLocations = subLocations;

    await location.save();

    for (const supply of supplies) {
      const supplyLocation = supply.locations.find(_ => _._id === id);

      supplyLocation.name = body.name;
      supplyLocation.locationLevel = body.locationLevel;
      supplyLocation.status = body.status;

      await supply.save();
    }

    return location;
  }
}
