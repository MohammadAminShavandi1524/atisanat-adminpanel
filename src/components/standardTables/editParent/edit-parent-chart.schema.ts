import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

interface EditParentChartSchemaMessages {
  nameEnRequired: string;
  nameEnMax: string;

  nameFaRequired: string;
  nameFaMax: string;

  descriptionEnRequired: string;
  descriptionFaRequired: string;

  imageSize: string;
  imageType: string;
}

export const editParentChartSchema = (
  messages: EditParentChartSchemaMessages,
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
        (file) =>
          !file ||
          ALLOWED_IMAGE_TYPES.includes(file.type),
        {
          message: messages.imageType,
        },
      )
      .optional(),
  });

export type EditParentChartFormValues = z.infer<
  ReturnType<typeof editParentChartSchema>
>;