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
import { LocationService } from 'src/modules/location/location.service';
import { Location, LocationDocument } from 'src/schemas/location.schema';
import { CreateLocationDto } from './dtos/create-location.dto';

@Controller('/api/app/locations')
export class AppLocationController {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private locationService: LocationService,
  ) {}

  private _mapping(location: LocationDocument) {
    return {
      ...location.toJSON(),
      id: location._id,
    };
  }

  @Get()
  @UseGuards(AppJwtAuthGuard)
  async getAllLocations() {
    return (await this.locationModel.find({}).sort({ _id: 1 })).map((_) =>
      this._mapping(_),
    );
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  async getLocation(@Param('id') id: string) {
    return this._mapping(await this.locationModel.findById(id));
  }

  @Post()
  @UseGuards(AppJwtAuthGuard)
  async createLocation(@Body() body: CreateLocationDto) {
    await this.locationService.createLocation(body);
  }

  @Put(':id')
  @UseGuards(AppJwtAuthGuard)
  async updateLocation(
    @Param('id') id: string,
    @Body() body: CreateLocationDto,
  ) {
    await this.locationService.updateLocation(id, body);
  }

  @Delete(':id')
  @UseGuards(AppJwtAuthGuard)
  async deleteLocation(@Param('id') id: string) {
    await this.locationService.deleteLocation(id);
  }
}
