"use client";

import { FolderX } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import CategoryRow from "./CategoryRow";

interface Category {
  id: number;
  name: string;
  lang: "fa" | "en";
}

interface CategoriesSectionProps {
  categories: Category[];
  onDelete: (id: number) => void;
}

const CategoriesSection = ({
  categories,
  onDelete,
}: CategoriesSectionProps) => {
  const t = useTranslations("news");

  const locale = useLocale();

  const isEmpty = categories.length === 0;

  const emptyTitle =
    locale === "fa" ? "دسته‌بندی‌ای وجود ندارد" : "No categories found";

  const emptyDescription =
    locale === "fa"
      ? "در حال حاضر هیچ دسته‌بندی‌ای برای نمایش وجود ندارد."
      : "There are currently no categories available.";

  return (
    <section className="border-border bg-background relative flex h-full max-h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border">
      {/* Table Header */}
      <div className="border-border bg-secondary-bg 3xl:px-10 shrink-0 border-b px-10 xl:px-5 2xl:px-7">
        <div className="text-muted-foreground 3xl:h-14 grid h-14 grid-cols-4 items-center text-xs font-medium tracking-[0.04em] xl:h-11 xl:text-[11px] 2xl:h-12 2xl:text-xs">
          <div>{t("categories.table.id")}</div>

          <div>{t("categories.table.name")}</div>

          <div>{t("categories.table.language")}</div>

          <div>{t("categories.table.actions")}</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        {isEmpty ? (
          <div className="3xl:gap-3 3xl:py-16 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 py-16 xl:gap-2.5 xl:py-12">
            <div className="border-border bg-secondary-bg 3xl:size-14 flex size-14 items-center justify-center rounded-xl border xl:size-11 2xl:size-12">
              <FolderX
                className="text-muted-foreground 3xl:size-6 size-6 xl:size-5"
                strokeWidth={1.6}
              />
            </div>

            <h3 className="text-foreground 3xl:text-base text-base font-semibold xl:text-sm 2xl:text-[15px]">
              {emptyTitle}
            </h3>

            <p className="text-muted-foreground 3xl:text-sm max-w-md text-center text-sm leading-6 xl:text-[13px]">
              {emptyDescription}
            </p>
          </div>
        ) : (
          <ScrollArea
            dir={locale === "en" ? "ltr" : "rtl"}
            data-lenis-prevent
            className="h-full min-h-0 w-full flex-1"
            scrollBarClassName="me-0"
          >
            <div className="3xl:px-6 3xl:pt-4 3xl:pb-6 w-full px-6 pt-4 pb-6 xl:px-4 xl:pt-3 xl:pb-4 2xl:px-5 2xl:pt-3.5 2xl:pb-5">
              {categories.map((item) => (
                <CategoryRow
                  key={`${item.lang}-${item.id}`}
                  id={String(item.id)}
                  label={item.name}
                  lang={item.lang}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
