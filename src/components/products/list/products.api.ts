export interface ProductCategory {
  id: number;
  name_en: string;
  name_fa: string;
}

export interface Product {
  id: number;
  category: ProductCategory | number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string;
  created?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products/get", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`/api/products/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};
