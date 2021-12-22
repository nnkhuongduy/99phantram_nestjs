import { Module } from '@nestjs/common';

import { ClientAuthModule } from './auth/auth.module';
import { ClientCategoryModule } from './category/category.module';
import { ClientChatModule } from './chat/chat.module';
import { ClientLocationModule } from './location/location.module';
import { ClientSupplyModule } from './supply/supply.module';

@Module({
  imports: [
    ClientAuthModule,
    ClientCategoryModule,
    ClientLocationModule,
    ClientSupplyModule,
    ClientChatModule,
  ],
})
export class ClientModule {}
