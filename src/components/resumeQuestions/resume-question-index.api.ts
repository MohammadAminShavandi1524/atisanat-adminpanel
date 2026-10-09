export const increaseResumeQuestionIndex = async (questionId: number) => {
  const response = await fetch(
    `/api/resume/dynamic/question/increase-index/${questionId}/`,
    { method: "PATCH" },
  );

  if (!response.ok) {
    throw new Error("Failed to increase question index");
  }

  return response.json().catch(() => null);
};

export const decreaseResumeQuestionIndex = async (questionId: number) => {
  const response = await fetch(
    `/api/resume/dynamic/question/decrease-index/${questionId}/`,
    { method: "PATCH" },
  );

  if (!response.ok) {
    throw new Error("Failed to decrease question index");
  }

  return response.json().catch(() => null);
};
