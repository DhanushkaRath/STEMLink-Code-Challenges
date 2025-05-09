import express from "express";
import { createOrder, getOrders, getOrderById, getOrdersByUserId } from "../application/order";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(isAuthenticated, createOrder)
  .get(isAuthenticated, getOrders);

orderRouter
  .route("/:orderId")
  .get(isAuthenticated, getOrderById);

orderRouter
  .route("/user/:userId")
  .get(isAuthenticated, getOrdersByUserId);
