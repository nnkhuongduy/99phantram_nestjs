import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';
import { AppAuthController } from './auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppAuthController],
})
export class AppAuthModule {}
