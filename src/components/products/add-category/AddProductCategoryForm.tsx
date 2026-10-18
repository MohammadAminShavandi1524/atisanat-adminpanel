"use client";

import { useMemo, useRef } from "react";

import { LoaderCircle, Tags } from "lucide-react";

import { useTranslations } from "next-intl";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/FormField";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  createProductCategorySchema,
  type ProductCategoryFormValues,
} from "./add-product-category.schema";

import { createProductCategory } from "./add-product-category.api";

import { useAddProductCategoryAnimation } from "./useAddProductCategoryAnimation";

const AddProductCategoryForm = () => {
  const t = useTranslations("addProductCategory");

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  useAddProductCategoryAnimation(formRef);

  const schema = useMemo(
    () =>
      createProductCategorySchema({
        nameEnRequired: t("validation.nameEnRequired"),
        nameEnMax: t("validation.nameEnMax"),

        nameFaRequired: t("validation.nameFaRequired"),
        nameFaMax: t("validation.nameFaMax"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",
    },
  });

  const onSubmit = async (data: ProductCategoryFormValues) => {
    try {
      await createProductCategory({
        name_en: data.name_en.trim(),
        name_fa: data.name_fa.trim(),
      });

      reset();

      toast.success(t("toast.success"));
    } catch (error) {
      console.error("CREATE PRODUCT CATEGORY ERROR:", error);

      toast.error(t("toast.error"));
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 min-w-0 flex-1 grid-cols-[0.26fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="add-category-info border-border bg-secondary-bg 3xl:p-7 relative flex min-h-0 min-w-0 flex-col overflow-hidden border-e p-4 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border bg-background 3xl:size-11 flex size-9 items-center justify-center rounded-lg border xl:size-10">
            <Tags
              className="text-custom-primary 3xl:size-5 size-4 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="3xl:mt-5 mt-3 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-2 text-[16px] font-semibold xl:text-[18px] 2xl:text-[19px]">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-2 max-w-[220px] text-[12px] leading-5 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="add-category-fields bg-background 3xl:p-8 flex min-h-0 min-w-0 flex-col overflow-hidden p-4 xl:p-5 2xl:p-6">
        <div className="min-h-0 min-w-0 flex-1">
          <div className="3xl:gap-6 grid min-w-0 grid-cols-2 gap-3 xl:gap-4 2xl:gap-5">
            <FormField
              label={t("form.nameEn.label")}
              placeholder={t("form.nameEn.placeholder")}
              register={register("name_en")}
              error={errors.name_en}
              as="input"
              lang="en"
              dir="ltr"
            />

            <FormField
              label={t("form.nameFa.label")}
              placeholder={t("form.nameFa.placeholder")}
              register={register("name_fa")}
              error={errors.name_fa}
              as="input"
              lang="fa"
              dir="rtl"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="add-category-submit border-border bg-background 3xl:mt-5 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            loadingContent={
              <>
                <LoaderCircle
                  className="3xl:size-4 size-4 animate-spin xl:size-[15px]"
                  strokeWidth={1.8}
                />

                <span>{t("form.submitting")}</span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm h-10 min-w-[150px] px-3 text-[12px] xl:h-10.5 xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px]"
          >
            {t("form.submit")}
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default AddProductCategoryForm;
