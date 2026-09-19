export interface HireResume {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  resume: string;
  created: string;
}

export async function getHireResumes(): Promise<HireResume[]> {
  const response = await fetch("/api/hire-resumes", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getHireResume(id: string): Promise<HireResume> {
  const response = await fetch(`/api/hire-resumes/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteHireResume(id: string) {
  const response = await fetch(`/api/hire-resumes/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
