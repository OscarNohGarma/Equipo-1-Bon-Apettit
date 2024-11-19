import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'], // Fuerza el uso de WebSocket
    });
  }

  // Escuchar eventos del servidor
  listenToEvent(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  // Emitir un evento al servidor
  emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Desconectar el socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  reconnect(): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'], // Fuerza el uso de WebSocket
    });
  }
}
