"use client";

import { useEffect, useState } from "react";

import type { ControllerRenderProps, FieldError } from "react-hook-form";

import { useLocale, useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

import {
  getProductCategories,
  type ProductCategory,
} from "./edit-product.api";

import type { EditProductFormValues } from "./edit-product.schema";

interface EditProductCategorySelectProps {
  field: ControllerRenderProps<EditProductFormValues, "category">;
  error?: FieldError;
  onAvailabilityChange?: (hasCategories: boolean) => void;
}

const EditProductCategorySelect = ({
  field,
  error,
  onAvailabilityChange,
}: EditProductCategorySelectProps) => {
  const t = useTranslations("editProduct");

  const locale = useLocale();

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchError(false);

        const data = await getProductCategories();

        setCategories(data);

        onAvailabilityChange?.(data.length > 0);
      } catch (error) {
        console.error("GET PRODUCT CATEGORIES ERROR:", error);

        setCategories([]);

        setFetchError(true);

        onAvailabilityChange?.(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onAvailabilityChange]);

  const options = categories.map((category) => ({
    label:
      locale === "fa"
        ? category.name_fa || category.name_en
        : category.name_en || category.name_fa,

    value: String(category.id),
  }));

  const getPlaceholder = () => {
    if (loading) {
      return t("form.category.loading");
    }

    if (fetchError) {
      return t("form.category.error");
    }

    if (categories.length === 0) {
      return t("form.category.empty");
    }

    return t("form.category.placeholder");
  };

  return (
    <div>
      <CustomSelect
        label={t("form.category.label")}
        placeholder={getPlaceholder()}
        value={field.value ? String(field.value) : ""}
        onChange={(value) => field.onChange(Number(value))}
        options={options}
        disabled={loading || fetchError || categories.length === 0}
        error={error}
      />

      {!loading && !fetchError && categories.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs leading-5">
          {t("form.category.emptyDescription")}
        </p>
      )}

      {!loading && fetchError && (
        <p className="text-destructive mt-2 px-1 text-xs leading-5">
          {t("form.category.fetchError")}
        </p>
      )}
    </div>
  );
};

export default EditProductCategorySelect;
