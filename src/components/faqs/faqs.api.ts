export interface Faq {
  id: number;
  index: number;
  question_en: string;
  question_fa: string;
  answer_en: string;
  answer_fa: string;
}

export async function getFaqs(): Promise<Faq[]> {
  const response = await fetch("/api/faqs", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteFaq(id: number) {
  const response = await fetch(`/api/faqs/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function increaseFaqIndex(id: number) {
  const response = await fetch(`/api/faqs/increase/${id}`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function reduceFaqIndex(id: number) {
  const response = await fetch(`/api/faqs/reduce/${id}`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
