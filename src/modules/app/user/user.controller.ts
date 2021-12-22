import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/app-jwt.guard';
import { UserService } from 'src/modules/user/user.service';
import { User, UserDocument } from 'src/schemas/user.schema';

@Controller('/api/app/users')
export class AppUserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
  ) {}

  private _mapping(user: UserDocument) {
    return {
      ...user.toJSON(),
      id: user._id,
      createdOn: user.createdAt,
      modifiedOn: user.updatedAt,
      password: undefined,
      role: {
        ...user.role,
        id: (user.role as any)._id,
      },
    };
  }

  @Get()
  @UseGuards(AppJwtAuthGuard)
  async getAllUsers() {
    return (await this.userModel.find().select('-password')).map((_) =>
      this._mapping(_),
    );
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  async getUser(@Param('id') id: string) {
    return this._mapping(await this.userService.getUser(id));
  }
}
