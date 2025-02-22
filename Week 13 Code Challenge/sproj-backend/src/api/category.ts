import express, { Request, Response, NextFunction } from 'express';


import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory,
} from "../application/category";



export const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories).post(createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategory);