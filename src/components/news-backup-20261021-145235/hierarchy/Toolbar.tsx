"use client";

import { ArrowDownUp, Search } from "lucide-react";

import { useTranslations } from "next-intl";

interface ToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  sort: "newest" | "oldest";
  setSort: (value: "newest" | "oldest") => void;
}

const Toolbar = ({
  search,
  setSearch,
  sort,
  setSort,
}: ToolbarProps) => {
  const t = useTranslations("news");

  return (
    <div className="flex items-center justify-between gap-5 px-7 pt-7 xl:px-4 xl:pt-4 2xl:px-5 2xl:pt-5 3xl:px-7 3xl:pt-7">
      {/* Search */}
      <div className="group relative max-w-xl flex-1">
        <Search
          className="text-muted-foreground group-focus-within:text-custom-primary absolute start-4 top-1/2 size-4.5 -translate-y-1/2 transition-colors duration-200"
          strokeWidth={1.7}
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("newsTable.searchPlaceholder")}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary h-12 w-full rounded-xl border ps-11 pe-4 text-sm transition-colors duration-200 outline-none"
        />
      </div>

      {/* Sort */}
      <div className="group relative">
        <ArrowDownUp
          className="text-muted-foreground group-focus-within:text-custom-primary pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 transition-colors duration-200"
          strokeWidth={1.7}
        />

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as "newest" | "oldest")
          }
          className="border-border bg-background text-foreground focus:border-custom-primary h-12 min-w-[180px] cursor-pointer appearance-none rounded-xl border ps-11 pe-9 text-sm transition-colors duration-200 outline-none"
        >
          <option value="newest">
            {t("newsTable.newestFirst")}
          </option>

          <option value="oldest">
            {t("newsTable.oldestFirst")}
          </option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;
