import { CategoryDTO } from "../domain/dto/category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import Category from "../infrastructure/schemas/Category";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters long"),
  description: z.string().optional(),
  parentCategoryId: z.string().uuid().optional(),
});

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Category.find();
    res.status(200).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      message: "Category created successfully",
      product: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(category)
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCategory) {
      throw new NotFoundError("Category not found");
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};