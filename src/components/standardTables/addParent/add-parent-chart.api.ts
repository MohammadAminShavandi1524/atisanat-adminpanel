export interface CreateParentChartPayload {
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string;
}

interface UploadChartCoverResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export const uploadChartCover = (
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload/chart-cover");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);

      onProgress(progress);
    };

    xhr.onload = () => {
      try {
        const data: UploadChartCoverResponse = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
          resolve(data.url);

          return;
        }

        reject(new Error(data.message ?? "Cover upload failed"));
      } catch {
        reject(new Error("Cover upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Cover upload failed"));
    };

    xhr.send(formData);
  });
};

export const createParentChart = async (payload: CreateParentChartPayload) => {
  const response = await fetch("/api/chart/parent/create", {
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
