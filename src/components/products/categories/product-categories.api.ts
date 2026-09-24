export interface ProductCategory {
  id: number;
  name_en: string;
  name_fa: string;
}

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const response = await fetch("/api/products/category/get", {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort(
    (a: ProductCategory, b: ProductCategory) => a.id - b.id,
  );
};

export const deleteProductCategory = async (id: number) => {
  const response = await fetch(`/api/products/category/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};