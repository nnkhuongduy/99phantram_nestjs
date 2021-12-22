import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppJwtStrategy extends PassportStrategy(Strategy, 'appJwt') {
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

    return { ...user.toJSON(), id: user._id, password: undefined } as User;
  }
}
