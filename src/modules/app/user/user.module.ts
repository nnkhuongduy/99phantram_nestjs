import { Module } from '@nestjs/common';

import { UserModule } from 'src/modules/user/user.module';
import { AppUserController } from './user.controller';

@Module({
  imports: [UserModule],
  controllers: [AppUserController],
})
export class AppUserModule {}
