import { z } from "zod";

export const CreateOrderDTO = z.object({
  items: z.array(z.object({
    itemId: z.string().optional(),
    id: z.string().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    name: z.string().optional(),
    product: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      image: z.string().optional(),
      description: z.string().optional()
    }).optional()
  })),
  shippingAddress: z.object({
    line_1: z.string(),
    line_2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    phone: z.string()
  }),
  total: z.number().positive()
});