"use client";

import Link from "next/link";

import { Edit, Package, Trash } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import type { Product } from "./products.api";

interface ProductRowProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductRow = ({ product, onDelete }: ProductRowProps) => {
  const locale = useLocale();

  const t = useTranslations("products");

  const categoryLabel =
    typeof product.category === "number"
      ? `#${product.category}`
      : locale === "fa"
        ? product.category?.name_fa || product.category?.name_en || "-"
        : product.category?.name_en || product.category?.name_fa || "-";

  const getCreatedDate = () => {
    if (!product.created) {
      return "-";
    }

    const date = new Date(product.created);

    if (Number.isNaN(date.getTime())) {
      return product.created;
    }

    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="border-border bg-background hover:border-custom-primary/25 3xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(150px,0.8fr)_90px_140px_200px] 3xl:min-h-[82px] 3xl:px-5 mb-2 grid min-h-[64px] min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_50px_80px_136px] items-center rounded-xl border px-[11px] transition-colors duration-200 last:mb-0 xl:min-h-[72px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_130px_74px_120px_180px] xl:px-[15px] 2xl:min-h-[78px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_82px_130px_190px] 2xl:px-[19px]">
      {/* English Name */}
      <div className="min-w-0 pe-2 xl:pe-5">
        <span
          lang="en"
          className="text-foreground block truncate text-[11px] font-medium xl:text-sm"
        >
          {product.name_en}
        </span>
      </div>

      {/* Persian Name */}
      <div className="min-w-0 pe-2 xl:pe-5">
        <span
          lang="fa"
          className="text-foreground font-IRANYekanX block truncate text-[11px] font-medium xl:text-sm"
        >
          {product.name_fa}
        </span>
      </div>

      {/* Category */}
      <div className="min-w-0 pe-1 xl:pe-4">
        <span className="text-muted-foreground block truncate text-[11px] xl:text-sm">
          {categoryLabel}
        </span>
      </div>

      {/* Image */}
      <div className="flex min-w-0 items-center">
        {product.image ? (
          <a
            href={product.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("actions.viewImage")}
            className="border-border bg-secondary-bg 3xl:size-14 block size-9 shrink-0 overflow-hidden rounded-lg border xl:size-12 2xl:size-[52px]"
          >
            <img
              src={product.image}
              alt={product.name_en}
              className="size-full object-cover"
            />
          </a>
        ) : (
          <div className="border-border bg-secondary-bg 3xl:size-14 flex size-9 shrink-0 items-center justify-center rounded-lg border xl:size-12 2xl:size-[52px]">
            <Package
              className="text-muted-foreground size-4 xl:size-5"
              strokeWidth={1.6}
            />
          </div>
        )}
      </div>

      {/* Created */}
      <div className="min-w-0 pe-1 xl:pe-4">
        <span className="text-muted-foreground block truncate text-[10px] xl:text-[13px]">
          {getCreatedDate()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex min-w-0 items-center justify-center gap-1 xl:gap-2">
        <Link
          href={`/${locale}/products/edit/${product.id}`}
          className={cn(
            customButtonVariants({
              intent: "info",
              variant: "soft",
            }),
            "3xl:h-10 3xl:min-w-[88px] 3xl:px-3.5 3xl:text-sm h-8 min-w-0 flex-1 gap-1 px-1 text-[10px] xl:h-9 xl:min-w-[78px] xl:flex-none xl:gap-1.5 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]",
          )}
        >
          <Edit
            className="3xl:size-[17px] size-3 shrink-0 xl:size-4"
            strokeWidth={1.7}
          />

          <span>{t("actions.edit")}</span>
        </Link>

        <CustomHoldButton
          intent="destructive"
          variant="soft"
          duration={1200}
          onComplete={() => onDelete(product.id)}
          className="3xl:h-10 3xl:min-w-[88px] 3xl:px-3.5 3xl:text-sm h-8 min-w-0 flex-1 gap-1 px-1 text-[10px] xl:h-9 xl:min-w-[78px] xl:flex-none xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
          leftSection={
            <Trash
              className="3xl:size-[17px] size-3 shrink-0 xl:size-4"
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

export default ProductRow;
