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

import {
  createProduct,
  uploadProductImage,
} from "./add-product.api";

const AddProductForm = () => {
  const t = useTranslations("addProduct");

  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const [isFinalizing, setIsFinalizing] = useState(false);

  const [hasCategories, setHasCategories] = useState(true);

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

      const imageUrl = await uploadProductImage(
        data.image,
        (progress) => {
          setUploadProgress(progress);

          if (progress >= 100) {
            setIsFinalizing(true);
          }
        },
      );

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
      className="border-border bg-background grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr] 3xl:grid-cols-[0.36fr_1fr]"
    >
      {/* Information */}
      <div className="border-border bg-secondary-bg relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6 3xl:p-7">
        <div>
          <div className="border-border bg-background flex size-11 items-center justify-center rounded-lg border xl:size-10 3xl:size-11">
            <PackagePlus
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
      <div className="bg-background flex min-h-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3 3xl:p-8 3xl:pe-3">
        <ScrollArea
          data-lenis-prevent
          dir={locale === "en" ? "ltr" : "rtl"}
          className="min-h-0 flex-1 overflow-hidden pe-5 xl:pe-4 2xl:pe-4.5 3xl:pe-5"
          scrollBarClassName="me-0"
        >
          <div className="flex flex-col gap-y-8 pb-8 xl:gap-y-6 2xl:gap-y-7 3xl:gap-y-8">
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
            <div className="grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5 3xl:gap-6">
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
            <div className="grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5 3xl:gap-6">
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
        <div className="border-border bg-background mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5 3xl:mt-5 3xl:pt-6">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            disabled={isSubmitting || !hasCategories}
            loadingContent={
              <>
                <LoaderCircle
                  className="size-4 animate-spin xl:size-[15px] 3xl:size-4"
                  strokeWidth={1.8}
                />

                <span>
                  {isUploading
                    ? t("form.uploading")
                    : t("form.submitting")}
                </span>
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

export default AddProductForm;
