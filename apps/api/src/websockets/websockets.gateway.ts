import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger = new Logger(WebSocketsGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.data.userId = payload.sub;
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Connection failed: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:workspace')
  handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    void client.join(`workspace:${workspaceId}`);
    this.logger.log(`Client ${client.id} joined workspace:${workspaceId}`);
    return { event: 'joined:workspace', data: workspaceId };
  }

  @SubscribeMessage('leave:workspace')
  handleLeaveWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    void client.leave(`workspace:${workspaceId}`);
    this.logger.log(`Client ${client.id} left workspace:${workspaceId}`);
    return { event: 'left:workspace', data: workspaceId };
  }

  @SubscribeMessage('join:page')
  handleJoinPage(
    @ConnectedSocket() client: Socket,
    @MessageBody() pageId: string,
  ) {
    void client.join(`page:${pageId}`);
    this.logger.log(`Client ${client.id} joined page:${pageId}`);
    return { event: 'joined:page', data: pageId };
  }

  @SubscribeMessage('leave:page')
  handleLeavePage(
    @ConnectedSocket() client: Socket,
    @MessageBody() pageId: string,
  ) {
    void client.leave(`page:${pageId}`);
    this.logger.log(`Client ${client.id} left page:${pageId}`);
    return { event: 'left:page', data: pageId };
  }

  emitToWorkspace(workspaceId: string, event: string, data: unknown) {
    this.server.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToPage(pageId: string, event: string, data: unknown) {
    this.server.to(`page:${pageId}`).emit(event, data);
  }
}
