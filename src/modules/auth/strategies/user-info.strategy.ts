import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserInfoStrategy extends PassportStrategy(Strategy, 'userInfo') {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userModel.findById(payload.id).select('-password');

    if (!user)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy người dùng',
      });

    if (
      !user.phoneNumber ||
      !user.address.length ||
      !user.locationProvince ||
      !user.locationBlock ||
      !user.locationWard
    )
      throw new ForbiddenException({
        success: false,
        code: 403,
        message: 'Tài khoản cần cập nhật thông tin',
      });

    return { ...user.toJSON(), id: user._id, password: undefined } as User;
  }
}
