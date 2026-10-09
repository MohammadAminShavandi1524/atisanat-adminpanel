import { z } from "zod";

type ResumeQuestionValidationMessages = {
  questionEnRequired: string;
  questionFaRequired: string;
};

export const createResumeQuestionSchema = ({
  questionEnRequired,
  questionFaRequired,
}: ResumeQuestionValidationMessages) =>
  z.object({
    question_en: z.string().trim().min(1, questionEnRequired),

    question_fa: z.string().trim().min(1, questionFaRequired),
  });

export type ResumeQuestionFormValues = z.infer<
  ReturnType<typeof createResumeQuestionSchema>
>;
