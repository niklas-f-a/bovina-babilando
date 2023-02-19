import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'Socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket);
      console.log(socket.id);
    });
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('pong');
  }
}
