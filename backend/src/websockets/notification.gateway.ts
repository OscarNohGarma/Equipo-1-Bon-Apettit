import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200', // Cambia según tu cliente
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'], // Solo WebSocket
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('mensaje')
  handleMensaje(client: Socket, payload: any): void {
    console.log('Mensaje recibido desde el cliente:', payload);
    // Puedes emitir un evento de vuelta al cliente
    client.emit('mensaje', { text: 'Mensaje recibido correctamente' });
  }

  @SubscribeMessage('cancelOrder')
  handleCancelOrder(client: Socket, payload: any): void {
    console.log('Orden cancelada desde el cliente:', payload);
    // Emitir un evento a todos los clientes conectados notificando la cancelación
    this.server.emit('orderCancelled', {
      message: `Orden ${payload.id} cancelada para el usuario ${payload.user}`,
      user: payload.user,
    });
  }

  emitEvent(eventName: string, data: any) {
    this.server.emit(eventName, data);
  }
}
