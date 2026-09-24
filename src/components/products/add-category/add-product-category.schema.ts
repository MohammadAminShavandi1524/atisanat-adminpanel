import { z } from "zod";

interface CreateProductCategorySchemaMessages {
  nameEnRequired: string;
  nameEnMax: string;

  nameFaRequired: string;
  nameFaMax: string;
}

export const createProductCategorySchema = (
  messages: CreateProductCategorySchemaMessages,
) =>
  z.object({
    name_en: z
      .string()
      .trim()
      .min(1, messages.nameEnRequired)
      .max(500, messages.nameEnMax),

    name_fa: z
      .string()
      .trim()
      .min(1, messages.nameFaRequired)
      .max(500, messages.nameFaMax),
  });

export type ProductCategoryFormValues = z.infer<
  ReturnType<typeof createProductCategorySchema>
>;
