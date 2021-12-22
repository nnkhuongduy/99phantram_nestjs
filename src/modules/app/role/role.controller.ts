import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/app-jwt.guard';
import { RoleDocument, Role } from 'src/schemas/role.schema';

@Controller('/api/app/roles')
export class AppRoleController {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  @Get('selectable')
  @UseGuards(AppJwtAuthGuard)
  async getSelectableRoles(@Req() req) {
    return (
      await this.roleModel.find({
        _id: { $in: req.user.role.selectableRoles },
      })
    ).map((_) => {
      const role = _.toJSON();

      return {
        ...role,
        id: role._id,
        createdOn: role.createdAt,
        modifiedOn: role.updatedAt,
        selectableRoles: undefined,
      };
    });
  }
}
