import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ClientChatGateway implements OnGatewayConnection, OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket);
    })
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('connecting');
    this.server.emit('chats', { test: 'test' });
  }

  @SubscribeMessage('chat-connect')
  onConnection(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    console.log({ body, socket });
    return { test: 'test' };
  }
}
