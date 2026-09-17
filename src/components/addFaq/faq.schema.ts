import { z } from "zod";

type FaqValidationMessages = {
  questionEnRequired: string;
  questionEnMax: string;

  questionFaRequired: string;
  questionFaMax: string;

  answerEnRequired: string;
  answerFaRequired: string;
};

export const createFaqSchema = ({
  questionEnRequired,
  questionEnMax,
  questionFaRequired,
  questionFaMax,
  answerEnRequired,
  answerFaRequired,
}: FaqValidationMessages) =>
  z.object({
    question_en: z
      .string()
      .trim()
      .min(1, questionEnRequired)
      .max(500, questionEnMax),

    question_fa: z
      .string()
      .trim()
      .min(1, questionFaRequired)
      .max(500, questionFaMax),

    answer_en: z.string().trim().min(1, answerEnRequired),

    answer_fa: z.string().trim().min(1, answerFaRequired),
  });

export type FaqFormValues = z.infer<ReturnType<typeof createFaqSchema>>;
