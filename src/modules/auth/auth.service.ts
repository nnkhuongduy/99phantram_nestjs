import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleLevel } from 'src/schemas/role.schema';
import { compare, hash } from 'bcrypt';

import { User, UserDocument, UserStatus } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user)
      throw new UnauthorizedException({
        success: false,
        code: 401,
        message: 'Không tìm thấy nhân viên!',
      });

    if (user.status == UserStatus.ARCHIVED)
      throw new UnauthorizedException({
        success: false,
        code: 401,
        message: 'Tài khoản đã bị khóa hoặc xóa!',
      });

    if (user.role.roleLevel == RoleLevel.CLIENT)
      throw new UnauthorizedException({
        success: false,
        code: 401,
        message: 'Tài khoản không có quyền truy cập tài nguyên này!',
      });

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException({
        success: false,
        code: 401,
        message: 'Mật khẩu không đúng!',
      });

    return user;
  }

  async login(user: UserDocument, remember = false) {
    const payload = { email: user.email, id: user._id };
    const identifier = { ...user.toJSON(), password: undefined };

    return {
      identifier,
      token: this.jwtService.sign(payload, {
        expiresIn: remember ? '24h' : '2h',
      }),
    };
  }

  async encryptPassword(password: string) {
    return await hash(password, 10);
  }

  async verifyPassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
