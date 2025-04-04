import express from "express";
import {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../application/address";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const addressRouter = express.Router();

addressRouter.route("/").post(isAuthenticated, createAddress);
addressRouter
  .route("/:id")
  .get(isAuthenticated, getAddress)
  .put(isAuthenticated, updateAddress)
  .delete(isAuthenticated, deleteAddress);

export default addressRouter;