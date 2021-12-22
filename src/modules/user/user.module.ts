import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, MailModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
