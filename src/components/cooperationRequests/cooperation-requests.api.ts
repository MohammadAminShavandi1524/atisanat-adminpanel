export interface CooperationRequest {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  company: string | null;
  resume: string;
  created: string;
}

export async function getCooperationRequests(): Promise<CooperationRequest[]> {
  const response = await fetch("/api/cooperation-requests", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteCooperationRequest(id: string) {
  const response = await fetch(`/api/cooperation-requests/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
