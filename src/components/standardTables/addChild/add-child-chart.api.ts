export interface ParentChart {
  id: number;
  name_en: string;
  name_fa: string;
  description_en?: string;
  description_fa?: string;
  image?: string;
}

export interface CreateChildChartPayload {
  chart: number;
  name_en: string;
  name_fa: string;
  size: string;
  file: string;
}

interface UploadChartFileResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export const getParentCharts = async (): Promise<ParentChart[]> => {
  const response = await fetch("/api/chart/parent/get", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

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

export const uploadChartFile = (
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload/chart-file");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);

      onProgress(progress);
    };

    xhr.onload = () => {
      try {
        const data: UploadChartFileResponse = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
          resolve(data.url);

          return;
        }

        reject(new Error(data.message ?? "Chart file upload failed"));
      } catch {
        reject(new Error("Chart file upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Chart file upload failed"));
    };

    xhr.send(formData);
  });
};

export const createChildChart = async (payload: CreateChildChartPayload) => {
  const response = await fetch("/api/chart/child/create", {
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
