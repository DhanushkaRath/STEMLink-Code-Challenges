import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

// Store connected clients
const clients = new Set<WebSocket>();

export const initializeWebSocket = (server: Server) => {
  if (wss) {
    console.warn('WebSocket server is already initialized.');
    return wss;
  }

  wss = new WebSocketServer({ server, path: '/ws/orders' });

  console.log('WebSocket server initialized at /ws/orders');

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    clients.add(ws);

    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket Server Error:', error);
  });

  return wss;
};

// Broadcast message to all connected clients
export const broadcastMessage = (message: any) => {
  if (!wss) {
    console.warn('WebSocket server is not initialized.');
    return;
  }

  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};

// Gracefully close WebSocket server
export const closeWebSocketServer = () => {
  if (wss) {
    console.log('Closing WebSocket server...');
    clients.forEach((client) => client.close());
    wss.close();
    wss = null;
    clients.clear();
  }
};
