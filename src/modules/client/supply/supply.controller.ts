import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ClientJwtAuthGuard } from 'src/modules/auth/guards/client-jwt.guard';
import { UserInfoGuard } from 'src/modules/auth/guards/user-info.guard';
import { SupplyService } from 'src/modules/supply/supply.service';
import {
  Supply,
  SupplyDocument,
  SupplyStatus,
} from 'src/schemas/supply.schema';
import { PostSupplyDto } from './dtos/post-supply.dto';
import { QuerySupplyDto } from './dtos/query-supply.dto';

@Controller('/api/supply')
export class ClientSupplyController {
  constructor(
    @InjectModel(Supply.name) private supplyModel: Model<SupplyDocument>,
    private supplyService: SupplyService,
  ) {}

  @Post()
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async createSupply(@Body() body: PostSupplyDto, @Req() req) {
    await this.supplyService.createSupply(req.user, body);
  }

  @Get()
  async getActiveSupplies(@Query() query: QuerySupplyDto) {
    return (await this.supplyService.getActiveSupplies(query)).map((_) => {
      const supply = _.toJSON();

      return {
        ...supply,
        id: supply._id,
        createdOn: supply.createdAt,
        modifiedOn: supply.updatedAt,
      };
    });
  }

  @Get('management')
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async getOwnSupplies(@Req() req) {
    return (await this.supplyService.getOwnSupplies(req.user)).map((_) => {
      const supply = _.toJSON();

      return {
        ...supply,
        id: supply._id,
        createdOn: supply.createdAt,
        modifiedOn: supply.updatedAt,
      };
    });
  }

  @Get(':id')
  async getSupply(@Param('id') id: string) {
    const supply = (
      await this.supplyModel
        .findOne({
          _id: id,
          status: SupplyStatus.ACTIVE,
        })
        .populate('owner')
    ).toJSON();

    supply.owner.password = undefined;
    (supply.owner as any).id = (supply.owner as any)._id;

    return {
      ...supply,
      id: supply._id,
      createdOn: supply.createdAt,
      modifiedOn: supply.updatedAt,
    };
  }
}
