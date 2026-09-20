import { z } from "zod";

const CHART_SIZES = ["A3", "A4", "A5"] as const;

interface EditChildChartSchemaMessages {
  parentRequired: string;

  nameEnRequired: string;
  nameFaRequired: string;

  sizeRequired: string;
  sizeInvalid: string;

  fileType: string;
}

export const editChildChartSchema = (messages: EditChildChartSchemaMessages) =>
  z.object({
    chart: z
      .number({
        message: messages.parentRequired,
      })
      .int()
      .positive(messages.parentRequired),

    name_en: z.string().trim().min(1, messages.nameEnRequired),

    name_fa: z.string().trim().min(1, messages.nameFaRequired),

    size: z
      .string()
      .min(1, messages.sizeRequired)
      .refine(
        (value) => CHART_SIZES.includes(value as (typeof CHART_SIZES)[number]),
        {
          message: messages.sizeInvalid,
        },
      ),

    file: z
      .custom<File | undefined>(
        (value) =>
          value === undefined ||
          (typeof File !== "undefined" && value instanceof File),
      )
      .refine(
        (file) =>
          !file ||
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
        {
          message: messages.fileType,
        },
      )
      .optional(),
  });

export type EditChildChartFormValues = z.infer<
  ReturnType<typeof editChildChartSchema>
>;
