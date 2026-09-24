"use client";

import Link from "next/link";

import { Edit, Trash } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import type { ProductCategory } from "./product-categories.api";

interface ProductCategoryRowProps {
  category: ProductCategory;
  onDelete: (id: number) => void;
}

const ProductCategoryRow = ({
  category,
  onDelete,
}: ProductCategoryRowProps) => {
  const locale = useLocale();

  const t = useTranslations("productCategories");

  return (
    <div className="border-border bg-background mb-2 grid min-h-16 grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_260px] items-center rounded-xl border px-5 transition-colors duration-200 last:mb-0 hover:border-custom-primary/25 xl:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_220px] xl:px-4 2xl:grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_240px] 3xl:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_260px] 3xl:px-5">
      {/* ID */}
      <div className="text-muted-foreground font-mono text-sm">
        #{category.id}
      </div>

      {/* English Name */}
      <div className="min-w-0 pe-5">
        <span
          lang="en"
          className="text-foreground block truncate text-sm font-medium"
        >
          {category.name_en}
        </span>
      </div>

      {/* Persian Name */}
      <div className="min-w-0 pe-5">
        <span
          lang="fa"
          className="text-foreground font-IRANYekanX block truncate text-sm font-medium"
        >
          {category.name_fa}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/products/categories/edit/${category.id}`}
          className={cn(
            customButtonVariants({
              intent: "info",
              variant: "soft",
            }),
            "h-10 min-w-[88px] gap-1.5 px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px] 3xl:h-10 3xl:min-w-[88px] 3xl:text-sm",
          )}
        >
          <Edit
            className="size-4 3xl:size-[17px]"
            strokeWidth={1.7}
          />

          <span>{t("actions.edit")}</span>
        </Link>

        <CustomHoldButton
          intent="destructive"
          variant="soft"
          duration={1200}
          onComplete={() => onDelete(category.id)}
          className="h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px] 3xl:h-10 3xl:min-w-[88px] 3xl:text-sm"
          leftSection={
            <Trash
              className="size-4 3xl:size-[17px]"
              strokeWidth={1.7}
            />
          }
        >
          {t("actions.delete")}
        </CustomHoldButton>
      </div>
    </div>
  );
};

export default ProductCategoryRow;
