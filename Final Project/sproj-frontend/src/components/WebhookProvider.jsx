import { useEffect } from 'react';
import { webhookService } from '../lib/webhookService';
import { store } from '../lib/store';
import { api } from "../lib/api";

const Api = api;

export function WebhookProvider({ children }) {
  useEffect(() => {
    console.log('Initializing WebhookProvider...');
    
    const handleConnected = () => {
      console.log('WebSocket connected in WebhookProvider');
    };

    const handleDisconnected = () => {
      console.log('WebSocket disconnected in WebhookProvider');
    };

    const handleError = (error) => {
      console.error('WebSocket error in WebhookProvider:', error);
    };

    const handleMessage = (data) => {
      console.log('Received message in WebhookProvider:', data);
      
      switch (data.type) {
        case 'ORDER_STATUS_UPDATE':
          const { orderId, status } = data.payload;
          console.log('Order status update:', { orderId, status });
          
          // Update the order in the cache
          store.dispatch(
            Api.util.updateQueryData('getOrder', { orderId }, (draft) => {
              if (draft) {
                draft.status = status;
              }
            })
          );

          // Also update the order in the orders list if it exists
          store.dispatch(
            Api.util.updateQueryData('getOrders', undefined, (draft) => {
              if (draft) {
                const orderIndex = draft.findIndex(order => order._id === orderId);
                if (orderIndex !== -1) {
                  draft[orderIndex].status = status;
                }
              }
            })
          );
          break;
          
        case 'CONNECTION_ESTABLISHED':
          console.log('Connection established:', data.message);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    // Add event listeners
    webhookService.addEventListener('connected', handleConnected);
    webhookService.addEventListener('disconnected', handleDisconnected);
    webhookService.addEventListener('error', handleError);
    webhookService.addEventListener('message', handleMessage);

    // Connect to WebSocket
    webhookService.connect();

    // Cleanup function
    return () => {
      console.log('Cleaning up WebhookProvider...');
      webhookService.removeEventListener('connected', handleConnected);
      webhookService.removeEventListener('disconnected', handleDisconnected);
      webhookService.removeEventListener('error', handleError);
      webhookService.removeEventListener('message', handleMessage);
      webhookService.disconnect();
    };
  }, []);

  return children;
} 