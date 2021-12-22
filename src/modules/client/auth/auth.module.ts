import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { FrontendAuthController } from './auth.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [FrontendAuthController],
})
export class ClientAuthModule {}
