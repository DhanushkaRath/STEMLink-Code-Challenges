import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { WebSocket } from 'ws';

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}

export class WebSocketHandler {
  private wss: WebSocketServer;
  private clients: Set<ExtendedWebSocket>;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/orders' });
    this.clients = new Set();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: ExtendedWebSocket) => {
      console.log('New WebSocket connection');
      ws.isAlive = true;
      this.clients.add(ws);

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    // Set up ping/pong to keep connections alive
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const extendedWs = ws as ExtendedWebSocket;
        if (extendedWs.isAlive === false) {
          console.log('Terminating inactive connection');
          return ws.terminate();
        }
        extendedWs.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  public broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
} 