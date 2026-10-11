export interface DynamicResumeAnswer {
  question: string;
  answer: string;
}

export interface DynamicResumeSubmission {
  id: number;
  answers: DynamicResumeAnswer[];
  created: string;
}

export async function getDynamicResumeAnswers(): Promise<
  DynamicResumeSubmission[]
> {
  const response = await fetch("/api/resume/dynamic/answer/get/", {
    cache: "no-store",
  });

  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body as DynamicResumeSubmission[];
}

export async function deleteDynamicResumeAnswer(id: number) {
  const response = await fetch(`/api/resume/dynamic/answer/delete/${id}/`, {
    method: "DELETE",
  });

  const text = await response.text();

  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw body;
  }

  return body;
}
