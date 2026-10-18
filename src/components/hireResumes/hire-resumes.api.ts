import type { HireResume } from "./hire-resumes.types";

const API_BASE = "/api/resume/cv";

export const getHireResumes = async (): Promise<HireResume[]> => {
  const response = await fetch(`${API_BASE}/get`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hire resumes: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid hire resumes response");
  }

  return data as HireResume[];
};

export const deleteHireResume = async (id: number): Promise<void> => {
  const response = await fetch(
    `${API_BASE}/delete/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    let message = "Failed to delete hire resume";

    try {
      const data: unknown = await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        message = data.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }
};
