export interface CreateProductCategoryPayload {
  name_en: string;
  name_fa: string;
}

export const createProductCategory = async (
  payload: CreateProductCategoryPayload,
) => {
  const response = await fetch("/api/products/category/create", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};
