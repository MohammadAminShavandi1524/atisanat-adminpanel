export interface ContactMessage {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  company: string | null;
  message: string;
  created: string;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const response = await fetch("/api/contact-messages", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteContactMessage(id: string) {
  const response = await fetch(`/api/contact-messages/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
