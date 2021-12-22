import { Module } from '@nestjs/common';
import { LocationModule } from 'src/modules/location/location.module';
import { AppLocationController } from './location.controller';

@Module({
  controllers: [AppLocationController],
  imports: [LocationModule],
})
export class AppLocationModule {}
