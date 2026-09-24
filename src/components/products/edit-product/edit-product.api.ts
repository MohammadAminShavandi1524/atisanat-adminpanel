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

export interface UpdateProductPayload {
  category: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string | null;
}

interface UploadProductImageResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export const getProduct = async (
  id: string,
): Promise<Product> => {
  const response = await fetch(`/api/products/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const response = await fetch("/api/products/category/get", {
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

export const uploadProductImage = (
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload/product-image");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);

      onProgress(progress);
    };

    xhr.onload = () => {
      try {
        const data: UploadProductImageResponse = JSON.parse(xhr.responseText);

        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          data.success &&
          data.url
        ) {
          resolve(data.url);

          return;
        }

        reject(new Error(data.message ?? "Product image upload failed"));
      } catch {
        reject(new Error("Product image upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Product image upload failed"));
    };

    xhr.send(formData);
  });
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
) => {
  const response = await fetch(`/api/products/update/${id}`, {
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
