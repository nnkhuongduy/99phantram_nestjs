import { Module } from '@nestjs/common';
import { SupplyModule } from 'src/modules/supply/supply.module';
import { AppSupplyController } from './supply.controller';

@Module({
  imports: [SupplyModule],
  controllers: [AppSupplyController],
})
export class AppSupplyModule {}
