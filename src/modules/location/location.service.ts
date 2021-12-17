import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Location, LocationDocument } from 'src/schemas/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
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
}
