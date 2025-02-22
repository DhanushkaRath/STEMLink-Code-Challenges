import express, { ErrorRequestHandler } from "express";

import "dotenv/config";
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { categoryRouter } from "./api/category";
import cors from "cors";

const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();
app.listen(8000, () => console.log(`Server running on port ${8000}`));