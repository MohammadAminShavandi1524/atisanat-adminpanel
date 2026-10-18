"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { LoaderCircle, PackagePlus } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import ProductCategorySelect from "./ProductCategorySelect";

import ProductImageUploadField from "./ProductImageUploadField";

import {
  createProductSchema,
  type ProductFormValues,
} from "./add-product.schema";

import { createProduct, uploadProductImage } from "./add-product.api";

import { useAddProductAnimation } from "./useAddProductAnimation";

const AddProductForm = () => {
  const t = useTranslations("addProduct");

  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const [isFinalizing, setIsFinalizing] = useState(false);

  const [hasCategories, setHasCategories] = useState(true);

  useAddProductAnimation(formRef);

  const schema = useMemo(
    () =>
      createProductSchema({
        categoryRequired: t("validation.categoryRequired"),

        nameEnRequired: t("validation.nameEnRequired"),

        nameFaRequired: t("validation.nameFaRequired"),

        descriptionEnRequired: t("validation.descriptionEnRequired"),

        descriptionFaRequired: t("validation.descriptionFaRequired"),

        imageRequired: t("validation.imageRequired"),

        imageSize: t("validation.imageSize"),

        imageType: t("validation.imageType"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      category: 0,
      name_en: "",
      name_fa: "",
      description_en: "",
      description_fa: "",
      image: undefined,
    },
  });

  const handleAvailabilityChange = useCallback((available: boolean) => {
    setHasCategories(available);
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsUploading(true);
      setIsFinalizing(false);
      setUploadProgress(0);

      const imageUrl = await uploadProductImage(data.image, (progress) => {
        setUploadProgress(progress);

        if (progress >= 100) {
          setIsFinalizing(true);
        }
      });

      setIsUploading(false);
      setIsFinalizing(false);

      await createProduct({
        category: data.category,

        name_en: data.name_en.trim(),

        name_fa: data.name_fa.trim(),

        description_en: data.description_en.trim(),

        description_fa: data.description_fa.trim(),

        image: imageUrl,
      });

      reset();

      setUploadProgress(0);

      toast.success(t("toast.success"));
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setIsUploading(false);
      setIsFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 min-w-0 flex-1 grid-cols-[0.26fr_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_minmax(0,1fr)] 2xl:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      {/* Information */}
      <div className="add-product-info border-border bg-secondary-bg 3xl:p-7 relative flex min-h-0 min-w-0 flex-col justify-between overflow-hidden border-e p-4 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border bg-background 3xl:size-11 flex size-9 items-center justify-center rounded-lg border xl:size-10">
            <PackagePlus
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
      <div className="add-product-fields bg-background 3xl:p-8 3xl:pe-3 flex min-h-0 min-w-0 flex-col overflow-hidden p-4 pe-2 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          data-lenis-prevent
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 min-w-0 flex-1 overflow-hidden pe-3 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-8 3xl:pb-8 flex min-w-0 flex-col gap-y-5 pb-5 xl:gap-y-6 xl:pb-6 2xl:gap-y-7 2xl:pb-7">
            {/* Category */}
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <ProductCategorySelect
                  field={field}
                  error={errors.category}
                  onAvailabilityChange={handleAvailabilityChange}
                />
              )}
            />

            {/* Names */}
            <div className="3xl:gap-6 grid min-w-0 grid-cols-2 gap-3 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.nameEn.label")}
                placeholder={t("form.nameEn.placeholder")}
                register={register("name_en")}
                error={errors.name_en}
                as="input"
                dir="ltr"
                lang="en"
              />

              <FormField
                label={t("form.nameFa.label")}
                placeholder={t("form.nameFa.placeholder")}
                register={register("name_fa")}
                error={errors.name_fa}
                as="input"
                dir="rtl"
                lang="fa"
              />
            </div>

            {/* Descriptions */}
            <div className="3xl:gap-6 grid min-w-0 grid-cols-2 gap-3 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.descriptionEn.label")}
                placeholder={t("form.descriptionEn.placeholder")}
                register={register("description_en")}
                error={errors.description_en}
                as="textarea"
                dir="ltr"
                lang="en"
              />

              <FormField
                label={t("form.descriptionFa.label")}
                placeholder={t("form.descriptionFa.placeholder")}
                register={register("description_fa")}
                error={errors.description_fa}
                as="textarea"
                dir="rtl"
                lang="fa"
              />
            </div>

            {/* Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ProductImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  progress={uploadProgress}
                  isUploading={isUploading}
                  isFinalizing={isFinalizing}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="border-border bg-background 3xl:mt-5 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            disabled={isSubmitting || !hasCategories}
            loadingContent={
              <>
                <LoaderCircle
                  className="3xl:size-4 size-4 animate-spin xl:size-[15px]"
                  strokeWidth={1.8}
                />

                <span>
                  {isUploading ? t("form.uploading") : t("form.submitting")}
                </span>
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

export default AddProductForm;
