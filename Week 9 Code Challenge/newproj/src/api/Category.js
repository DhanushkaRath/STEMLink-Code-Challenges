import express from "express"
import { getCategories, createCategory, getCategory, deleteCategory, updateCategory } from "../application/Category.js";


export const CategoryRouter = express.Router()

CategoryRouter.route("/").get(getCategories).post(createCategory);
CategoryRouter
    .route('/:id')
    .get(getCategory)
    .delete(deleteCategory)
    .patch(updateCategory)