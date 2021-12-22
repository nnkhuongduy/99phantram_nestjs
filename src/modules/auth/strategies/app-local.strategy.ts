import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class AppLocalStrategy extends PassportStrategy(
  Strategy,
  'localEmployee',
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateEmployee(email, password);

      return { ...user.toJSON(), id: user._id, password: undefined } as User;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
