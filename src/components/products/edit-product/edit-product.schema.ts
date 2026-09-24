import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface EditProductSchemaMessages {
  categoryRequired: string;

  nameEnRequired: string;
  nameFaRequired: string;

  descriptionEnRequired: string;
  descriptionFaRequired: string;

  imageSize: string;
  imageType: string;
}

export const editProductSchema = (
  messages: EditProductSchemaMessages,
) =>
  z.object({
    category: z
      .number()
      .min(1, messages.categoryRequired),

    name_en: z
      .string()
      .trim()
      .min(1, messages.nameEnRequired),

    name_fa: z
      .string()
      .trim()
      .min(1, messages.nameFaRequired),

    description_en: z
      .string()
      .trim()
      .min(1, messages.descriptionEnRequired),

    description_fa: z
      .string()
      .trim()
      .min(1, messages.descriptionFaRequired),

    image: z
      .custom<File | undefined>(
        (value) =>
          value === undefined ||
          (typeof File !== "undefined" && value instanceof File),
      )
      .refine(
        (file) => !file || file.size <= MAX_IMAGE_SIZE,
        {
          message: messages.imageSize,
        },
      )
      .refine(
        (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
        {
          message: messages.imageType,
        },
      ),
  });

export type EditProductFormValues = z.infer<
  ReturnType<typeof editProductSchema>
>;
