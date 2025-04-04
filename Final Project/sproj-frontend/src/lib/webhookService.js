import { store } from "./store";
import { api } from "./api";

class WebhookService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.listeners = new Map();
  }

  connect() {
    try {
      console.log('Attempting to connect to WebSocket server...');
      this.socket = new WebSocket('ws://localhost:8000/ws/orders');

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.notifyListeners('connected');
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.notifyListeners('disconnected');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyListeners('error', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          this.notifyListeners('message', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  handleWebhookMessage(data) {
    if (data.type === 'ORDER_STATUS_UPDATE') {
      const { orderId, status } = data.payload;
      
      // Update the order in the cache
      store.dispatch(
        api.util.updateQueryData('getOrder', { orderId }, (draft) => {
          if (draft) {
            draft.paymentStatus = status;
          }
        })
      );

      // Also update the order in the orders list if it exists
      store.dispatch(
        api.util.updateQueryData('getOrders', undefined, (draft) => {
          if (draft) {
            const orderIndex = draft.findIndex(order => order._id === orderId);
            if (orderIndex !== -1) {
              draft[orderIndex].paymentStatus = status;
            }
          }
        })
      );
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.log('Max reconnection attempts reached');
      this.notifyListeners('maxReconnectAttemptsReached');
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }
}

export const webhookService = new WebhookService();
