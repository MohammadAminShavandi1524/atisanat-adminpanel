import { z } from "zod";

const CHART_SIZES = ["A3", "A4", "A5"] as const;

interface CreateChildChartSchemaMessages {
  parentRequired: string;

  nameEnRequired: string;
  nameFaRequired: string;

  sizeRequired: string;
  sizeInvalid: string;

  fileRequired: string;
  fileType: string;
}

export const createChildChartSchema = (
  messages: CreateChildChartSchemaMessages,
) =>
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
      .custom<File>(
        (value) => typeof File !== "undefined" && value instanceof File,
        {
          message: messages.fileRequired,
        },
      )
      .refine(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
        {
          message: messages.fileType,
        },
      ),
  });

export type ChildChartFormValues = z.infer<
  ReturnType<typeof createChildChartSchema>
>;
