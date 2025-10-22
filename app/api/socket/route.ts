import { Server as SocketIOServer } from 'socket.io';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Store the Socket.io server instance globally
declare global {
  var io: SocketIOServer | undefined;
}

export async function GET(req: NextRequest) {
  if (!global.io) {
    console.log('Initializing Socket.io server...');

    // Create Socket.io server
    const io = new SocketIOServer({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      path: '/api/socket',
    });

    global.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Note: This is a simplified setup. In production, you'd want to use
    // a custom server or Socket.io with an external adapter for scaling
  }

  return new Response('Socket.io server is running', { status: 200 });
}

// Helper function to emit events
export function emitItemEvent(event: string, data: any) {
  if (global.io) {
    global.io.emit(event, data);
  }
}
