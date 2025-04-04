import { z } from "zod";

export const CreateCategoryDTO = z.object({
  name: z.string(),
});