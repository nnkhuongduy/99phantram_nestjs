import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role, RoleDocument } from 'src/schemas/role.schema';
import { User, UserDocument, UserStatus } from 'src/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { PostUserBodyDto } from './dto/post-user-body';
import { PutUserBodyDto } from './dto/put-user-body';
import { StepTwoUpdateBody } from './dto/step-two-body';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private authService: AuthService,
  ) {}

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy người dùng!',
      });

    return user;
  }

  async createUser(body: PostUserBodyDto): Promise<UserDocument> {
    const role = this.roleModel.findById(body.role);

    if (!role)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy vai trò!',
      });

    return await this.userModel.create({
      ...body,
      password: this.authService.encryptPassword(body.password),
      role,
    });
  }

  async updateUser(id: string, body: PutUserBodyDto): Promise<UserDocument> {
    const user = await this.getUser(id);

    const role = await this.roleModel.findById(body.role);

    if (!role)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy vai trò!',
      });

    user.email = body.email;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.sex = body.sex;
    user.address = body.address;
    user.phoneNumber = body.phoneNumber;
    user.role = role;
    user.status = body.status;
    user.avatar = body.avatar;

    if (body.password) {
      user.password = body.password;
    }

    await user.save();

    return user;
  }

  async archiveUser(user: UserDocument): Promise<void> {
    user.status = UserStatus.ARCHIVED;

    await user.save();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUser(id);

    await user.delete();
  }

  async stepTwoUpdate(
    user: UserDocument,
    body: StepTwoUpdateBody,
  ): Promise<UserDocument> {
    user.phoneNumber = body.phoneNumber;
    user.locationBlock = body.block;
    user.locationProvince = body.province;
    user.locationWard = body.ward;

    await user.save();

    return user;
  }
}
