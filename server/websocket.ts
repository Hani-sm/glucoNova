import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { UserRole } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'gluconova-secret-key-change-in-production';

function verifyToken(token: string): { userId: string; role: UserRole; isApproved: boolean } {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole; isApproved: boolean };
}

interface UserSocket {
  ws: WebSocket;
  userId: string;
  role: string;
}

const userConnections = new Map<string, UserSocket[]>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    
    // Only handle WebSocket upgrade for '/ws' path with valid token
    if (url.pathname === '/ws') {
      const token = url.searchParams.get('token');

      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      try {
        const decoded = verifyToken(token);
        wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
          handleConnection(ws, decoded);
        });
      } catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
      }
    } else {
      // Ignore other upgrade requests (like HMR from Vite)
      socket.destroy();
    }
  });

  return { wss, userConnections };
}

function handleConnection(ws: WebSocket, decoded: { userId: string; role: UserRole; isApproved: boolean }) {
  const userId = decoded.userId;
  const role = decoded.role;

  const userSocket: UserSocket = { ws, userId, role };
  
  if (!userConnections.has(userId)) {
    userConnections.set(userId, []);
  }
  userConnections.get(userId)!.push(userSocket);

  console.log(`User ${userId} connected. Total users: ${userConnections.size}`);

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to real-time updates',
    userId,
  }));

  // Handle incoming messages
  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data);
      handleMessage(message, userSocket);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    const connections = userConnections.get(userId);
    if (connections) {
      const index = connections.indexOf(userSocket);
      if (index > -1) {
        connections.splice(index, 1);
      }
      if (connections.length === 0) {
        userConnections.delete(userId);
      }
    }
    console.log(`User ${userId} disconnected`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

function handleMessage(message: any, userSocket: UserSocket) {
  switch (message.type) {
    case 'glucose_update':
      broadcastToUser(userSocket.userId, {
        type: 'glucose_alert',
        data: message.data,
        timestamp: new Date(),
      });
      break;
    case 'prediction_update':
      broadcastToUser(userSocket.userId, {
        type: 'prediction',
        data: message.data,
        timestamp: new Date(),
      });
      break;
    case 'notification':
      broadcastToUser(userSocket.userId, {
        type: 'notification',
        data: message.data,
        timestamp: new Date(),
      });
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

export function broadcastToUser(userId: string, message: any) {
  const connections = userConnections.get(userId);
  if (connections) {
    connections.forEach((conn) => {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(message));
      }
    });
  }
}

export function broadcastToRole(role: string, message: any) {
  userConnections.forEach((connections, userId) => {
    connections.forEach((conn) => {
      if (conn.role === role && conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(message));
      }
    });
  });
}

export function broadcastToAll(message: any) {
  userConnections.forEach((connections) => {
    connections.forEach((conn) => {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(message));
      }
    });
  });
}

export function broadcastAlert(alert: {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  data?: any;
}) {
  userConnections.forEach((connections, userId) => {
    connections.forEach((conn) => {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify({
          alertType: alert.type,
          severity: alert.severity,
          message: alert.message,
          data: alert.data,
          timestamp: new Date(),
        }));
      }
    });
  });
}
