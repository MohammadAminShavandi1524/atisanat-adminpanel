export interface ResumeQuestion {
  id: number;
  question_en: string;
  question_fa: string;
  index: number;
  created: string;
}

export const getResumeQuestions = async (): Promise<ResumeQuestion[]> => {
  const response = await fetch("/api/resume/dynamic/question/get/", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get resume questions");
  }

  return response.json();
};
