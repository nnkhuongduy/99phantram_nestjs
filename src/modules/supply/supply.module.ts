import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';

import { SupplyService } from './supply.service';

@Module({
  imports: [MailModule],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}
