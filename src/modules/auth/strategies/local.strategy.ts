import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserDocument } from 'src/schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class AppLocalStrategy extends PassportStrategy(
  Strategy,
  'localEmployee',
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.authService.validateEmployee(email, password);

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
