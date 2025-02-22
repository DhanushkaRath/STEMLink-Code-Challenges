import express from "express";


import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../application/product";

export const productRouter = express.Router();

productRouter.route("/").get(getProducts).post(createProduct);
productRouter.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct);

export default productRouter;


