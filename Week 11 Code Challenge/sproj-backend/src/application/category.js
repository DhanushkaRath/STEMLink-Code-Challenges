import NotFoundError from "../domain/errors/not-found-error.js";
import Category from "../infrastructure/schemas/Category.js";
import mongoose from "mongoose";

export const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    await Category.create(req.body);
    return res.status(201);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return res.status(204);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return res.status(200).send(category);
  } catch (error) {
    next(error);
  }
};
