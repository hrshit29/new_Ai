import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => console.log('🔌 Socket connected'));
    socket.on('disconnect', () => console.log('🔌 Socket disconnected'));
    socket.on('connect_error', (err) =>
      console.error('Socket error:', err.message)
    );
  }
  return socket;
}

export function connectSocket(): void {
  getSocket().connect();
}

export function disconnectSocket(): void {
  socket?.disconnect();
}

export function joinAssignmentRoom(assignmentId: string): void {
  getSocket().emit('join:assignment', assignmentId);
}

export function leaveAssignmentRoom(assignmentId: string): void {
  getSocket().emit('leave:assignment', assignmentId);
}