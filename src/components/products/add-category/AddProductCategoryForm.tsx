"use client";

import { useMemo } from "react";

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

const AddProductCategoryForm = () => {
  const t = useTranslations("addProductCategory");

  const toast = useCustomToast();

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
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr] 3xl:grid-cols-[0.36fr_1fr]"
    >
      {/* Information */}
      <div className="border-border bg-secondary-bg relative flex min-h-0 flex-col overflow-hidden border-e p-7 xl:p-5 2xl:p-6 3xl:p-7">
        <div>
          <div className="border-border bg-background flex size-11 items-center justify-center rounded-lg border xl:size-10 3xl:size-11">
            <Tags
              className="text-custom-primary size-5 xl:size-[18px] 3xl:size-5"
              strokeWidth={1.6}
            />
          </div>

          <div className="mt-5 xl:mt-4 3xl:mt-5">
            <h2 className="text-foreground mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px] 3xl:mt-3 3xl:text-xl">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px] 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7">
              {t("header.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-background flex min-h-0 flex-col overflow-hidden p-8 xl:p-5 2xl:p-6 3xl:p-8">
        <div className="min-h-0 flex-1">
          <div className="grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5 3xl:gap-6">
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
        <div className="border-border bg-background mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5 3xl:mt-5 3xl:pt-6">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            loadingContent={
              <>
                <LoaderCircle
                  className="size-4 animate-spin xl:size-[15px] 3xl:size-4"
                  strokeWidth={1.8}
                />

                <span>{t("form.submitting")}</span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 h-11.5 min-w-[180px] px-5 text-sm xl:h-10.5 xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px] 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm"
          >
            {t("form.submit")}
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default AddProductCategoryForm;
