import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../infrastructure/schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../infrastructure/schemas/Address";
import { CreateOrderDTO } from "../domain/dto/order";
import { broadcastMessage } from "../infrastructure/websocket";

// Define interfaces for the request body
interface OrderItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  line_1: string;
  line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
}

interface OrderRequestBody {
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

export const createOrder = async (
  req: Request<{}, {}, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Received order data:", req.body);

    const { userId } = getAuth(req);
    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }

    // Create address
    const address = await Address.create({
      userId,
      street: req.body.shippingAddress.line_1,
      additionalStreet: req.body.shippingAddress.line_2,
      city: req.body.shippingAddress.city,
      state: req.body.shippingAddress.state,
      postalCode: req.body.shippingAddress.zip_code,
      phone: req.body.shippingAddress.phone
    });

    // Create order with the items as they come from frontend
    const order = await Order.create({
      userId,
      items: req.body.items.map((item: OrderItem) => ({
        productId: item.id || item._id || `PROD_${Date.now()}`, // Generate a productId if none exists
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      addressId: address._id,
      orderStatus: "PENDING",
      paymentStatus: "PENDING",
      totalAmount: req.body.total
    });

    // Broadcast new order
    broadcastMessage({
      type: 'NEW_ORDER',
      data: order
    });

    res.status(201).json({ 
      orderId: order._id,
      message: "Order created successfully" 
    });
  } catch (error) {
    console.error("Order creation error:", error);
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }

    const orders = await Order.find({ userId })
      .populate('addressId')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    const { orderId } = req.params;

    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('addressId');

    if (!order) {
      throw new ValidationError("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    }).populate({
      path: "items."
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const orders = await Order.find({ userId })
      .populate('addressId')
      .sort({ createdAt: -1 })
      .lean();

    // Define valid status values
    const validOrderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const validPaymentStatuses = ['PENDING', 'PAID'];

    // Ensure all required fields are present with default values and proper formatting
    const sanitizedOrders = orders.map(order => {
      // Ensure orderStatus and paymentStatus are valid strings
      const orderStatus = typeof order.orderStatus === 'string' 
        ? order.orderStatus.toUpperCase() 
        : 'PENDING';
      const paymentStatus = typeof order.paymentStatus === 'string' 
        ? order.paymentStatus.toUpperCase() 
        : 'PENDING';

      return {
        ...order,
        totalAmount: order.totalAmount || 0,
        orderStatus: validOrderStatuses.includes(orderStatus) ? orderStatus : 'PENDING',
        paymentStatus: validPaymentStatuses.includes(paymentStatus) ? paymentStatus : 'PENDING',
        items: order.items.map(item => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 0,
          name: item.name || 'Unknown Product'
        }))
      };
    });

    res.status(200).json(sanitizedOrders);
  } catch (error) {
    next(error);
  }
};