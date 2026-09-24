export interface ProductCategory {
  id: number;
  name_en: string;
  name_fa: string;
}

export interface UpdateProductCategoryPayload {
  name_en: string;
  name_fa: string;
}

export const getProductCategory = async (
  id: string,
): Promise<ProductCategory> => {
  const response = await fetch(`/api/products/category/get/${id}`, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateProductCategory = async (
  id: string,
  payload: UpdateProductCategoryPayload,
) => {
  const response = await fetch(`/api/products/category/update/${id}`, {
    method: "PUT",

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
