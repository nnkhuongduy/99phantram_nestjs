import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { UserService } from 'src/modules/user/user.service';
import { User, UserDocument } from 'src/schemas/user.schema';

@Controller('/api/app/users')
export class AppUserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
  ) {}

  @Get()
  @UseGuards(AppJwtAuthGuard)
  async getAllUsers() {
    return await this.userModel.find().select('-password');
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }
}
