import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
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
export class AuctionsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AuctionsGateway');

  afterInit(server: Server) {
    this.logger.log('Init Auctions WebSocket Gateway');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Method to be called from AuctionsService to broadcast bids
  emitNewBid(auctionId: string, bidData: any) {
    this.server.emit(`auction:${auctionId}:newBid`, bidData);
    this.server.emit('auction:update', { auctionId }); // Global update for lists
  }

  // Method to be called when an auction is created/updated
  emitAuctionChange() {
    this.server.emit('auction:listRefresh');
  }
}
