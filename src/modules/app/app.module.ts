import { Module } from '@nestjs/common';

import { AppAuthModule } from './auth/auth.module';
import { AppCategoryModule } from './category/category.module';
import { AppUserModule } from './user/user.module';

@Module({
  imports: [AppAuthModule, AppCategoryModule, AppUserModule],
  controllers: [],
})
export class _99AppModule {}
