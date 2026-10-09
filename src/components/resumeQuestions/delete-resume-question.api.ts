export const deleteResumeQuestion = async (questionId: number) => {
  const response = await fetch(
    `/api/resume/dynamic/question/delete/${questionId}/`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Failed to delete resume question");
  }

  return response.json().catch(() => null);
};
