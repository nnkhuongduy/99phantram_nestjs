import { Module } from '@nestjs/common';
import { AppRoleController } from './role.controller';

@Module({
  controllers: [AppRoleController],
})
export class AppRoleModule {}
