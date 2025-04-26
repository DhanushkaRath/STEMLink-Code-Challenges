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
app.use(express.json());
app.use(clerkMiddleware());
app.use(cors({
  origin: ["http://localhost:5173", "https://fed-storefront-frontend-dhanushka.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://fed-storefront-frontend-dhanushka.netlify.app',
      'http://localhost:5173'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options("*", cors()); // Respond to preflight requests globally
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.path);
  next();
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws/orders' });

// WebSocket connection handling
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



// Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentsRouter);

// Error handling
app.use(globalErrorHandlingMiddleware);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);
  