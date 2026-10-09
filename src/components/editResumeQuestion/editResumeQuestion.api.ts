import type { ResumeQuestionFormValues } from "@/components/addResumeQuestion/resumeQuestion.schema";

export interface ResumeQuestionDetails {
  id: number;
  question_en: string;
  question_fa: string;
  index: number;
  created: string;
}

export const getResumeQuestionDetails = async (
  questionId: number,
): Promise<ResumeQuestionDetails> => {
  const response = await fetch(
    `/api/resume/dynamic/question/get/${questionId}/`,
    {
      cache: "no-store",
    },
  );

  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body;
};

export const updateResumeQuestionDetails = async (
  questionId: number,
  data: ResumeQuestionFormValues,
) => {
  const response = await fetch(
    `/api/resume/dynamic/question/update/${questionId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw body;
  }

  return body;
};
