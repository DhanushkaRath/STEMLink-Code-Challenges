import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import { categoryRouter } from "./api/category";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { orderRouter } from "./api/order";
import { paymentsRouter } from "./api/payment";
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import { WebSocketServer } from 'ws';
import http from 'http';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const app = express();
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ server, path: '/ws/orders' });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(express.json());

// CORS: Allow specific production URL + any localhost:<port>
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://fed-storefront-frontend-dhanushka.netlify.app'
    ];

    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Clerk middleware
app.use(clerkMiddleware());

// Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentsRouter);

// Error handler
app.use(globalErrorHandlingMiddleware);

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws/orders`);
});
