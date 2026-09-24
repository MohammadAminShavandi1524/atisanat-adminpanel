"use client";

import { useCallback, useEffect, useState } from "react";

import { FolderX, LoaderCircle } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import ProductCategoryRow from "./ProductCategoryRow";

import {
  deleteProductCategory,
  getProductCategories,
  type ProductCategory,
} from "./product-categories.api";

const ProductCategoriesTable = () => {
  const t = useTranslations("productCategories");

  const locale = useLocale();

  const toast = useCustomToast();

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProductCategories();

      setCategories(data);
    } catch (error) {
      console.error("GET PRODUCT CATEGORIES ERROR:", error);

      setCategories([]);

      toast.error(t("toast.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProductCategory(id);

      setCategories((prev) => prev.filter((category) => category.id !== id));

      toast.success(t("toast.deleteSuccess"));
    } catch (error) {
      console.error("DELETE PRODUCT CATEGORY ERROR:", error);

      toast.error(t("toast.deleteError"));
    }
  };

  return (
    <section className="border-border bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="border-border bg-secondary-bg 3xl:px-5 shrink-0 border-b px-5 xl:px-4 2xl:px-5">
        <div className="text-muted-foreground 3xl:h-14 3xl:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_260px] 3xl:px-5 grid h-14 grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_260px] items-center px-5 text-xs font-medium tracking-[0.04em] xl:h-11 xl:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_220px] xl:px-4 xl:text-[11px] 2xl:h-12 2xl:grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_240px] 2xl:px-5 2xl:text-xs">
          <div>{t("table.id")}</div>

          <div>{t("table.nameEn")}</div>

          <div>{t("table.nameFa")}</div>

          <div>{t("table.actions")}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
            <LoaderCircle
              className="text-custom-primary size-6 animate-spin"
              strokeWidth={1.7}
            />

            <p className="text-muted-foreground text-sm">{t("loading")}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
            <div className="border-border bg-secondary-bg 3xl:size-14 flex size-14 items-center justify-center rounded-xl border xl:size-11 2xl:size-12">
              <FolderX
                className="text-muted-foreground 3xl:size-6 size-6 xl:size-5"
                strokeWidth={1.6}
              />
            </div>

            <h3 className="text-foreground 3xl:text-base text-base font-semibold xl:text-sm 2xl:text-[15px]">
              {t("empty.title")}
            </h3>

            <p className="text-muted-foreground text-center text-sm">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <ScrollArea
            data-lenis-prevent
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="min-h-0 flex-1"
            scrollBarClassName="me-0"
          >
            <div className="3xl:p-5 w-full p-5 xl:p-4 2xl:p-5">
              {categories.map((category) => (
                <ProductCategoryRow
                  key={category.id}
                  category={category}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </section>
  );
};

export default ProductCategoriesTable;
