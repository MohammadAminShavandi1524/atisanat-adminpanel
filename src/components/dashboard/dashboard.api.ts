export interface DashboardStats {
  contactMessages: number | null;
  hireResumes: number | null;
  cooperationRequests: number | null;
  productCategories: number | null;
  products: number | null;
  machiningChallenges: number | null;
  standardTableParents: number | null;
  standardTables: number | null;
  faqs: number | null;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  return null;
};

const getCollection = (value: unknown, depth = 0): unknown[] | null => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value) || depth > 3) {
    return null;
  }

  const keys = [
    "data",
    "results",
    "items",
    "records",
    "list",
    "messages",
    "resumes",
    "requests",
    "categories",
    "products",
    "parents",
    "children",
    "charts",
    "faqs",
    "blogs",
  ];

  for (const key of keys) {
    const result = getCollection(value[key], depth + 1);

    if (result !== null) {
      return result;
    }
  }

  return null;
};

const getCollectionCount = (value: unknown): number => {
  if (isRecord(value)) {
    const directCount =
      getNumber(value.total) ??
      getNumber(value.totalCount) ??
      getNumber(value.total_count);

    if (directCount !== null) {
      return directCount;
    }

    if (isRecord(value.pagination)) {
      const paginationCount = getNumber(value.pagination.total);

      if (paginationCount !== null) {
        return paginationCount;
      }
    }

    if (isRecord(value.meta)) {
      const metaCount = getNumber(value.meta.total);

      if (metaCount !== null) {
        return metaCount;
      }
    }
  }

  const collection = getCollection(value);

  if (collection !== null) {
    return collection.length;
  }

  throw new Error("Unsupported dashboard response shape");
};

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard request failed: ${url} (${response.status})`);
  }

  return response.json();
};

const fetchCount = async (url: string): Promise<number> => {
  const data = await fetchJson(url);

  return getCollectionCount(data);
};

const safelyCount = async (url: string): Promise<number | null> => {
  try {
    return await fetchCount(url);
  } catch (error) {
    console.error(`DASHBOARD COUNT ERROR: ${url}`, error);

    return null;
  }
};

const getStandardTableCounts = async (): Promise<{
  parents: number | null;
  children: number | null;
}> => {
  try {
    const data = await fetchJson("/api/chart/parent/get");

    const parents = getCollection(data);

    const parentCount = getCollectionCount(data);

    if (parents === null) {
      return {
        parents: parentCount,
        children: null,
      };
    }

    if (parents.length === 0) {
      return {
        parents: parentCount,
        children: 0,
      };
    }

    const parentIds = parents.map((parent) => {
      if (!isRecord(parent)) {
        return null;
      }

      const id = parent.id;

      if (
        (typeof id === "number" && Number.isFinite(id)) ||
        (typeof id === "string" && id.trim() !== "")
      ) {
        return String(id);
      }

      return null;
    });

    if (parentIds.some((id) => id === null)) {
      return {
        parents: parentCount,
        children: null,
      };
    }

    const results = await Promise.all(
      parentIds.map((id) =>
        safelyCount(
          `/api/chart/child/get-by-parent/${encodeURIComponent(id!)}`,
        ),
      ),
    );

    const children = results.every((count): count is number => count !== null)
      ? results.reduce((total, count) => total + count, 0)
      : null;

    return {
      parents: parentCount,
      children,
    };
  } catch (error) {
    console.error("DASHBOARD STANDARD TABLES ERROR:", error);

    return {
      parents: null,
      children: null,
    };
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [
    contactMessages,
    hireResumes,
    cooperationRequests,
    productCategories,
    products,
    machiningChallenges,
    standardTables,
    faqs,
  ] = await Promise.all([
    safelyCount("/api/contact-messages"),
    safelyCount("/api/resume/cv/get"),
    safelyCount("/api/cooperation-requests"),
    safelyCount("/api/products/category/get"),
    safelyCount("/api/products/get"),

    // Verify that this route returns the complete challenge list.
    safelyCount("/api/blog/root"),

    getStandardTableCounts(),
    safelyCount("/api/faqs"),
  ]);

  return {
    contactMessages,
    hireResumes,
    cooperationRequests,
    productCategories,
    products,
    machiningChallenges,
    standardTableParents: standardTables.parents,
    standardTables: standardTables.children,
    faqs,
  };
};
