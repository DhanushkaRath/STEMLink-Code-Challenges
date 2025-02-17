import express from "express"
import { getCategories, createCategory, getCategory, deleteCategory, updateCategory } from "../application/category.js";


const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories).post(createCategory);
categoryRouter
    .route('/:id')
    .get(getCategory)
    .delete(deleteCategory)
    .patch(updateCategory)


export { categoryRouter };