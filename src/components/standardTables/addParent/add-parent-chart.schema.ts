import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface CreateParentChartSchemaMessages {
  nameEnRequired: string;
  nameEnMax: string;

  nameFaRequired: string;
  nameFaMax: string;

  descriptionEnRequired: string;
  descriptionFaRequired: string;

  imageRequired: string;
  imageSize: string;
  imageType: string;
}

export const createParentChartSchema = (
  messages: CreateParentChartSchemaMessages,
) =>
  z.object({
    name_en: z
      .string()
      .trim()
      .min(1, messages.nameEnRequired)
      .max(300, messages.nameEnMax),

    name_fa: z
      .string()
      .trim()
      .min(1, messages.nameFaRequired)
      .max(300, messages.nameFaMax),

    description_en: z.string().trim().min(1, messages.descriptionEnRequired),

    description_fa: z.string().trim().min(1, messages.descriptionFaRequired),

    image: z
      .custom<File>(
        (value) => typeof File !== "undefined" && value instanceof File,
        {
          message: messages.imageRequired,
        },
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: messages.imageSize,
      })
      .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
        message: messages.imageType,
      }),
  });

export type ParentChartFormValues = z.infer<
  ReturnType<typeof createParentChartSchema>
>;
