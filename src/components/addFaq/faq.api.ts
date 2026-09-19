import type { FaqFormValues } from "./faq.schema";

export const createFaq = async (data: FaqFormValues) => {
  const response = await fetch("/api/faqs/create", {
    method: "POST",

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
