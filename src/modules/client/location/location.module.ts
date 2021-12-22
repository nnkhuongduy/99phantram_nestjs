import { Module } from '@nestjs/common';

import { ClientLocationController } from './location.controller';

@Module({
  controllers: [ClientLocationController],
})
export class ClientLocationModule {}
