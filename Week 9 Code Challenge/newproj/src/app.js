import express from 'express';

import 'dotenv/config';
import { productRouter } from './api/product.js';
import globalErrorHandlingMiddleware from './api/middleware/global-error-handling-middleware.js';
import { connectDB } from './infrastructure/db.js';
import { CategoryRouter } from './api/Category.js';

const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//     console.log("Request Recieved");
//     console.log(req.method, req.url);
//     next();
// })

app.use('/api/products', productRouter);
app.use("/api/categories", CategoryRouter);
app.use(globalErrorHandlingMiddleware)

connectDB();
app.listen(8000, () => console.log(`Server running on port ${8000}`));


