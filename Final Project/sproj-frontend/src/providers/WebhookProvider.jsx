import React, { useState, useEffect } from 'react';
import { WebhookContext } from '../contexts/WebhookContext';

const WebhookProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/orders');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrders(prevOrders => [...prevOrders, data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebhookContext.Provider value={{ orders }}>
      {children}
    </WebhookContext.Provider>
  );
};

export default WebhookProvider; 