import express from "express";
import { handleWebhook } from "../application/payment";

export const paymentsRouter = express.Router();

paymentsRouter.route("/webhook").post(handleWebhook);
