import { z } from "zod";

interface EditProductCategorySchemaMessages {
  nameEnRequired: string;
  nameEnMax: string;

  nameFaRequired: string;
  nameFaMax: string;
}

export const editProductCategorySchema = (
  messages: EditProductCategorySchemaMessages,
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

export type EditProductCategoryFormValues = z.infer<
  ReturnType<typeof editProductCategorySchema>
>;
