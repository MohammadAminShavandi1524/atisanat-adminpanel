export interface ChildChartDetails {
  id: number;

  chart:
    | number
    | {
        id: number;
      };

  name_en: string;
  name_fa: string;
  size: string;
  file: string;
}

export interface UpdateChildChartPayload {
  chart: number;
  name_en: string;
  name_fa: string;
  size: string;
  file?: string;
}

export const getChildChartById = async (
  id: string,
): Promise<ChildChartDetails> => {
  const response = await fetch(`/api/chart/child/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateChildChart = async (
  id: string,
  payload: UpdateChildChartPayload,
) => {
  const response = await fetch(`/api/chart/child/update/${id}`, {
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
