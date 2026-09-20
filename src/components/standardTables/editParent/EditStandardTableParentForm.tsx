"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LoaderCircle, Table2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { uploadChartCover } from "@/components/standardTables/addParent/add-parent-chart.api";

import EditChartCoverUploadField from "./EditChartCoverUploadField";

import {
  editParentChartSchema,
  type EditParentChartFormValues,
} from "./edit-parent-chart.schema";

import { getParentChartById, updateParentChart } from "./edit-parent-chart.api";

interface EditStandardTableParentFormProps {
  parentId: string;
}

const EditStandardTableParentForm = ({
  parentId,
}: EditStandardTableParentFormProps) => {
  const t = useTranslations("editStandardTableParent");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(true);

  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const [isFinalizing, setIsFinalizing] = useState(false);

  const schema = useMemo(
    () =>
      editParentChartSchema({
        nameEnRequired: t("validation.nameEnRequired"),

        nameEnMax: t("validation.nameEnMax"),

        nameFaRequired: t("validation.nameFaRequired"),

        nameFaMax: t("validation.nameFaMax"),

        descriptionEnRequired: t("validation.descriptionEnRequired"),

        descriptionFaRequired: t("validation.descriptionFaRequired"),

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
  } = useForm<EditParentChartFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name_en: "",
      name_fa: "",
      description_en: "",
      description_fa: "",
      image: undefined,
    },
  });

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const data = await getParentChartById(parentId);

        setExistingImageUrl(data.image);

        reset({
          name_en: data.name_en,
          name_fa: data.name_fa,

          description_en: data.description_en,

          description_fa: data.description_fa,

          image: undefined,
        });
      } catch (error) {
        console.error("GET PARENT CHART ERROR:", error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, [parentId, reset, t, toast]);

  const onSubmit = async (data: EditParentChartFormValues) => {
    try {
      const payload: {
        name_en: string;
        name_fa: string;
        description_en: string;
        description_fa: string;
        image?: string;
      } = {
        name_en: data.name_en.trim(),
        name_fa: data.name_fa.trim(),
        description_en: data.description_en.trim(),
        description_fa: data.description_fa.trim(),
      };

      if (data.image) {
        setIsUploading(true);
        setIsFinalizing(false);
        setUploadProgress(0);

        const imageUrl = await uploadChartCover(data.image, (progress) => {
          setUploadProgress(progress);

          if (progress >= 100) {
            setIsFinalizing(true);
          }
        });

        payload.image = imageUrl;

        setIsUploading(false);
        setIsFinalizing(false);
      }

      await updateParentChart(parentId, payload);

      toast.success(t("toast.success"));

      router.push(`/${locale}/standard-tables`);
    } catch (error) {
      console.error("UPDATE PARENT CHART ERROR:", error);

      setIsUploading(false);
      setIsFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  if (loading) {
    return (
      <div className="border-border bg-background flex min-h-0 flex-1 items-center justify-center rounded-xl border">
        <div className="flex items-center gap-3">
          <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

          <span className="text-muted-foreground text-sm">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="border-border bg-secondary-bg 3xl:p-7 relative flex min-h-0 flex-col justify-between overflow-hidden border-e p-7 xl:p-5 2xl:p-6">
        <div>
          <div className="border-border bg-background 3xl:size-11 flex size-11 items-center justify-center rounded-lg border xl:size-10">
            <Table2
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
      <div className="bg-background 3xl:p-8 3xl:pe-3 flex min-h-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3">
        <ScrollArea
          data-lenis-prevent
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 overflow-hidden pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-8 flex flex-col gap-y-8 pb-8 xl:gap-y-6 2xl:gap-y-7">
            {/* Names */}
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.nameEn.label")}
                placeholder={t("form.nameEn.placeholder")}
                register={register("name_en")}
                error={errors.name_en}
                as="input"
                dir="ltr"
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
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.descriptionEn.label")}
                placeholder={t("form.descriptionEn.placeholder")}
                register={register("description_en")}
                error={errors.description_en}
                as="textarea"
                dir="ltr"
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

            {/* Cover */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <EditChartCoverUploadField
                  value={field.value}
                  existingImageUrl={existingImageUrl}
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

                <span>
                  {isUploading ? t("form.uploading") : t("form.submitting")}
                </span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm h-11.5 min-w-[180px] px-5 text-sm xl:h-10.5 xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px]"
          >
            {t("form.submit")}
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default EditStandardTableParentForm;
