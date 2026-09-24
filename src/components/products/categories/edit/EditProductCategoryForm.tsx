"use client";

import { useEffect, useMemo, useState } from "react";

import { LoaderCircle, Tags } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/FormField";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  editProductCategorySchema,
  type EditProductCategoryFormValues,
} from "./edit-product-category.schema";

import {
  getProductCategory,
  updateProductCategory,
} from "./edit-product-category.api";

interface EditProductCategoryFormProps {
  categoryId: string;
}

const EditProductCategoryForm = ({
  categoryId,
}: EditProductCategoryFormProps) => {
  const t = useTranslations("editProductCategory");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const schema = useMemo(
    () =>
      editProductCategorySchema({
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
  } = useForm<EditProductCategoryFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",
    },
  });

  useEffect(() => {
    let active = true;

    const loadCategory = async () => {
      try {
        setLoading(true);

        const category = await getProductCategory(categoryId);

        if (!active) {
          return;
        }

        reset({
          name_en: category.name_en ?? "",
          name_fa: category.name_fa ?? "",
        });
      } catch (error) {
        console.error("GET PRODUCT CATEGORY ERROR:", error);

        if (active) {
          toast.error(t("toast.loadError"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategory();

    return () => {
      active = false;
    };
  }, [categoryId, reset, t, toast]);

  const onSubmit = async (data: EditProductCategoryFormValues) => {
    try {
      await updateProductCategory(categoryId, {
        name_en: data.name_en.trim(),
        name_fa: data.name_fa.trim(),
      });

      toast.success(t("toast.success"));

      router.push(`/${locale}/products/categories`);
    } catch (error) {
      console.error("UPDATE PRODUCT CATEGORY ERROR:", error);

      toast.error(t("toast.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="border-border bg-secondary-bg 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border bg-background 3xl:size-11 flex size-11 items-center justify-center rounded-lg border xl:size-10">
            <Tags
              className="text-custom-primary 3xl:size-5 size-5 xl:size-[18px]"
              strokeWidth={1.6}
            />
          </div>

          <div className="3xl:mt-5 mt-5 xl:mt-4">
            <h2 className="text-foreground 3xl:mt-3 3xl:text-xl mt-3 text-xl font-semibold xl:mt-2 xl:text-[18px] 2xl:text-[19px]">
              {t("header.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7 mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px]">
              {t("header.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-background 3xl:p-8 flex min-h-0 flex-col overflow-hidden p-8 xl:p-5 2xl:p-6">
        {loading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="flex items-center gap-2">
              <LoaderCircle
                className="text-custom-primary size-5 animate-spin"
                strokeWidth={1.8}
              />

              <span className="text-muted-foreground text-sm">
                {t("form.loading")}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1">
              <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
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
            </div>

            {/* Submit */}
            <div className="border-border bg-background 3xl:mt-5 3xl:pt-6 mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
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
                className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm h-11.5 min-w-[180px] px-5 text-sm xl:h-10.5 xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px]"
              >
                {t("form.submit")}
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default EditProductCategoryForm;
