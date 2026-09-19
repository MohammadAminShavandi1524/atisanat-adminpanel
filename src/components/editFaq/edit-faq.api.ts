import type { FaqFormValues } from "@/components/addFaq/faq.schema";

export interface EditFaqData extends FaqFormValues {
  id: number;
  index: number;
}

export const getFaqById = async (id: string): Promise<EditFaqData> => {
  const response = await fetch(`/api/faqs/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateFaq = async (id: string, data: FaqFormValues) => {
  const response = await fetch(`/api/faqs/${id}`, {
    method: "PUT",

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
