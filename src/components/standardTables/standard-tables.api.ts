export interface StandardTableParent {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string;
}

export interface StandardTableChild {
  id: number;
  chart?: number;
  name_en: string;
  name_fa: string;
  size: string;
  file: string;
}

const normalizeList = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results?: unknown }).results)
  ) {
    return (data as { results: T[] }).results;
  }

  return [];
};

export const getStandardTableParents = async (): Promise<
  StandardTableParent[]
> => {
  const response = await fetch("/api/chart/parent/get", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return normalizeList<StandardTableParent>(data);
};

export const getStandardTableChildrenByParent = async (
  parentId: number,
): Promise<StandardTableChild[]> => {
  const response = await fetch(`/api/chart/child/get-by-parent/${parentId}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return normalizeList<StandardTableChild>(data);
};

export const deleteStandardTableParent = async (parentId: number) => {
  const response = await fetch(`/api/chart/parent/delete/${parentId}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const deleteStandardTableChild = async (childId: number) => {
  const response = await fetch(`/api/chart/child/delete/${childId}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};
