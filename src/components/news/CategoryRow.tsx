"use client";

import Link from "next/link";

import { Edit, Trash } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "../ui/custom-button";

import { customButtonVariants } from "../ui/custom-button/custom-button-variants";

interface CategoryRowProps {
  id: string;
  label: string;
  lang: "fa" | "en";
  onDelete: () => void;
}

const CategoryRow = ({
  id,
  label,
  lang,
  onDelete,
}: CategoryRowProps) => {
  const locale = useLocale();

  const t = useTranslations("news.actions");

  return (
    <div
      className={cn(
        "border-border bg-background relative mb-2 grid min-h-16 w-full grid-cols-4 items-center rounded-xl border px-4",
        "transition-colors duration-200",
        "hover:border-custom-primary/25 hover:bg-secondary-bg/50",
        "last:mb-0",
      )}
    >
      {/* ID */}
      <div className="text-muted-foreground font-mono text-sm">
        #{id}
      </div>

      {/* Category */}
      <div className="min-w-0 pe-4">
        <span
          lang={lang}
          className={cn(
            "text-foreground block truncate text-sm font-medium",
            lang === "fa" && "font-IRANYekanX",
          )}
        >
          {label}
        </span>
      </div>

      {/* Language */}
      <div>
        <span className="border-custom-primary/20 bg-custom-primary/[0.06] text-custom-primary inline-flex min-w-10 items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-medium">
          {lang === "fa" ? "FA" : "EN"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Link
          href={`/${locale}/news/categories/edit/${lang}/${id}`}
          className={cn(
            customButtonVariants({
              intent: "info",
              variant: "soft",
            }),
            "h-10 gap-1.5 px-3.5 text-sm xl:h-9 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:text-[13px] 3xl:h-10 3xl:text-sm",
          )}
        >
          <Edit className="size-4" strokeWidth={1.7} />

          <span>{t("edit")}</span>
        </Link>

        <CustomHoldButton
          intent="destructive"
          variant="soft"
          duration={1200}
          onComplete={onDelete}
          className="h-10 px-3.5 text-sm xl:h-9 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:text-[13px] 3xl:h-10 3xl:text-sm"
          leftSection={
            <Trash
              className="size-4"
              strokeWidth={1.7}
            />
          }
        >
          {t("delete")}
        </CustomHoldButton>
      </div>
    </div>
  );
};

export default CategoryRow;
