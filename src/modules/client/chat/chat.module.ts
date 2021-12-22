import { Module } from '@nestjs/common';

import { ChatModule } from 'src/modules/chat/chat.module';
import { ClientChatController } from './chat.controller';
import { ClientChatGateway } from './chat.gateway';

@Module({
  providers: [ClientChatGateway],
  imports: [ChatModule],
  controllers: [ClientChatController]
})
export class ClientChatModule {}
