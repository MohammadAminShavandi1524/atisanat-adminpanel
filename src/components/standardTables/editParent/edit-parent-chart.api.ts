export interface ParentChartDetails {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string;
}

export interface UpdateParentChartPayload {
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image?: string;
}

export const getParentChartById = async (
  id: string,
): Promise<ParentChartDetails> => {
  const response = await fetch(`/api/chart/parent/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateParentChart = async (
  id: string,
  payload: UpdateParentChartPayload,
) => {
  const response = await fetch(`/api/chart/parent/update/${id}`, {
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
