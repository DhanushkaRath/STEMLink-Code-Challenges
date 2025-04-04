import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const WebhookContext = createContext({});

export function WebhookProvider({ children }) {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Create WebSocket connection
        const ws = new WebSocket(`ws://localhost:8000?token=${token}`);

        ws.onopen = () => {
          console.log('WebSocket Connected');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          // Handle different types of webhook events here
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket Disconnected');
        };

        setSocket(ws);

        return () => {
          if (ws) ws.close();
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    };

    connectWebSocket();
  }, [getToken]);

  return (
    <WebhookContext.Provider value={{ socket }}>
      {children}
    </WebhookContext.Provider>
  );
}

export function useWebhook() {
  return useContext(WebhookContext);
} 