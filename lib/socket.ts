// Socket.io event emitter for API routes
// This is a simplified version - in production, you'd use Redis or another adapter

import { Server as SocketIOServer } from 'socket.io';

declare global {
  var io: SocketIOServer | undefined;
}

export function emitToClients(event: string, data: any) {
  if (global.io) {
    global.io.emit(event, data);
    console.log(`Emitted ${event} event to all clients`);
  }
}

export const SOCKET_EVENTS = {
  ITEM_CREATED: 'item:created',
  ITEM_DELETED: 'item:deleted',
  ITEM_UPDATED: 'item:updated',
};
