import { Module } from '@nestjs/common';

import { AppAuthModule } from './auth/auth.module';
import { AppCategoryModule } from './category/category.module';
import { AppLocationModule } from './location/location.module';
import { AppRoleModule } from './role/role.module';
import { AppSupplyModule } from './supply/supply.module';
import { AppUserModule } from './user/user.module';

@Module({
  imports: [
    AppAuthModule,
    AppCategoryModule,
    AppUserModule,
    AppLocationModule,
    AppRoleModule,
    AppSupplyModule,
  ],
  controllers: [],
})
export class _99AppModule {}
