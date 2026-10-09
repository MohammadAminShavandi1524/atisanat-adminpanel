import type { ResumeQuestionFormValues } from "./resumeQuestion.schema";

export const createResumeQuestion = async (data: ResumeQuestionFormValues) => {
  const response = await fetch("/api/resume/dynamic/question/create/", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body;
};
