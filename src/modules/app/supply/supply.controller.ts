import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/app-jwt.guard';
import { PutSupplyDto } from 'src/modules/supply/dtos/put-supply.dto';
import { SupplyService } from 'src/modules/supply/supply.service';
import { Supply, SupplyDocument } from 'src/schemas/supply.schema';

@Controller('/api/app/supplies')
export class AppSupplyController {
  constructor(
    @InjectModel(Supply.name) private supplyModel: Model<SupplyDocument>,
    private supplyService: SupplyService,
  ) {}

  private _mapping(_: SupplyDocument) {
    const supply = {
      ..._.toJSON(),
      id: _._id,
      createdOn: _.createdAt,
      modifiedOn: _.updatedAt,
    };

    if (supply.owner) supply.owner.password = undefined;

    return supply;
  }

  @Get()
  @UseGuards(AppJwtAuthGuard)
  async getAllSupplies() {
    return (
      await this.supplyModel.find({}).sort({ createdAt: -1 }).populate('owner')
    ).map((_) => this._mapping(_));
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  async getSupply(@Param('id') id: string) {
    return this._mapping(await this.supplyModel.findById(id).populate('owner'));
  }

  @Put(':id')
  @UseGuards(AppJwtAuthGuard)
  async updateSupply(@Param('id') id: string, @Body() body: PutSupplyDto) {
    await this.supplyService.updateSupply(id, body);
  }

  @Delete(':id')
  @UseGuards(AppJwtAuthGuard)
  async deleteService(id: string) {
    await this.supplyService.deleteSupply(id);
  }
}
