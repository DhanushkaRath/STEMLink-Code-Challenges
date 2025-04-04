import { NextFunction, Request, Response } from "express";
import Order from "../infrastructure/schemas/Order";

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, data } = req.body;
  console.log(type, data);

  if (type === "succeeded") {
    await Order.findByIdAndUpdate(data.orderId, { paymentStatus: "PAID" });    
  }
  res.status(200).send();
  return;
};