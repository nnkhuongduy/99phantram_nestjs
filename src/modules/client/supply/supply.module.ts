import { Module } from '@nestjs/common';

import { SupplyModule } from 'src/modules/supply/supply.module';
import { ClientSupplyController } from './supply.controller';

@Module({
  imports: [SupplyModule],
  controllers: [ClientSupplyController],
})
export class ClientSupplyModule {}
