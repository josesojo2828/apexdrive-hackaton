import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');

  afterInit(server: Server) {
    this.logger.log('Init Notifications WebSocket Gateway');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // Expecting userId in query or headers
    const userId = client.handshake.query.userId as string;
    if (userId) {
        client.join(userId);
        this.logger.log(`Client ${client.id} joined room for user ${userId}`);
    }
  }

  // Generic method to notify a user
  sendNotificationToUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }

  // Broadcat to admins
  sendToAdmins(event: string, payload: any, adminIds: string[]) {
    if (adminIds.length > 0) {
        adminIds.forEach(id => {
            this.server.to(id).emit(event, payload);
        });
    }
  }
}
