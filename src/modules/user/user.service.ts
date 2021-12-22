import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role, RoleDocument } from 'src/schemas/role.schema';
import {
  Gender,
  User,
  UserDocument,
  UserStatus,
} from 'src/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { RegistrationDto } from '../client/auth/dtos/registration.dto';
import { StepTwoUpdateDto } from '../client/auth/dtos/step-two.dto';
import { MailService } from '../mail/mail.service';
import { PostUserBodyDto } from './dto/post-user-body';
import { PutUserBodyDto } from './dto/put-user-body';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private authService: AuthService,
    private mailService: MailService,
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
    body: StepTwoUpdateDto,
  ): Promise<UserDocument> {
    user.phoneNumber = body.phoneNumber;
    user.locationBlock = body.block;
    user.locationProvince = body.province;
    user.locationWard = body.ward;

    await user.save();

    return user;
  }

  async register(body: RegistrationDto) {
    const role = await this.roleModel.findOne({ name: 'Buyer' });

    const existedUser = await this.userModel.exists({ email: body.email });

    if (existedUser)
      throw new BadRequestException({
        success: false,
        code: 400,
        message: 'Tài khoản này đã tồn tại!',
      });

    const password = await this.authService.encryptPassword(body.password);

    const user = await this.userModel.create({
      email: body.email,
      password,
      firstName: body.firstName,
      lastName: body.lastName,
      sex: Gender.OTHER,
      role,
    });

    await this.mailService.sendRegistrationVerification(user);

    return user;
  }

  async verification(id: string) {
    const user = await this.userModel.findById(id);

    if (!user)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy tài khoản này!',
      });

    if (user.status !== UserStatus.CREATED)
      throw new BadRequestException({
        success: false,
        code: 404,
        message: 'Tài khoản này đã được kích hoạt!',
      });

    user.status = UserStatus.VERIFIED;

    await user.save();
  }
}
