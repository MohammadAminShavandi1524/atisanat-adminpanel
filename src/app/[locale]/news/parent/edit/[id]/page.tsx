"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { z } from "zod";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { FilePenLine } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { FormField } from "@/components/FormField";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

import { tags } from "@/components/addNews/data";

import { CategorySelect } from "@/components/addNews/CategorySelect";

import { TagSelector } from "@/components/addNews/TagSelector";

import ParentNewsImageUploadField from "@/components/addNews/forms/ParentNewsImageUploadField";

import { uploadParentNewsImage } from "@/components/addNews/forms/parent-news-upload";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ParentNews {
  id: number;
  title: string;
  description: string;
  image: string;

  category: {
    id: number;
    name: string;
  };

  root_blog: number;

  tags: string[];

  lang: string;
}

type NewsLang = "fa" | "en";

interface Category {
  id: number;
  name: string;
}

const Page = ({ params }: PageProps) => {
  const t = useTranslations("editParentNews");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  const [newsLang, setNewsLang] = useState<NewsLang>("fa");

  const [currentImage, setCurrentImage] = useState("");

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [isImageFinalizing, setIsImageFinalizing] = useState(false);

  const [parentMeta, setParentMeta] = useState<{
    root_blog: string;
    lang: NewsLang;
  } | null>(null);

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("form.validation.titleRequired"))
      .max(100, t("form.validation.titleMax")),

    description: z
      .string()
      .min(1, t("form.validation.descriptionRequired")),

    image: z
      .custom<File | undefined>()
      .optional()
      .refine(
        (file) =>
          file === undefined ||
          (file instanceof File && file.type.startsWith("image/")),
        {
          message: t("form.validation.imageInvalid"),
        },
      ),

    category: z
      .string()
      .min(1, t("form.validation.categoryRequired")),

    tags: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    ),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    control,
    reset,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: "",
      description: "",
      image: undefined,
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    const fetchNews = async () => {
      const { id } = await params;

      try {
        const res = await fetch(`/api/blog/parent/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error();
        }

        const data: ParentNews = await res.json();

        const lang: NewsLang = data.lang === "en" ? "en" : "fa";

        setNewsLang(lang);

        setCurrentImage(data.image ?? "");

        setParentMeta({
          root_blog: String(data.root_blog),
          lang,
        });

        const categoryRes = await fetch(`/api/blog/category/${lang}`, {
          cache: "no-store",
        });

        if (!categoryRes.ok) {
          throw new Error();
        }

        const categoryData: Category[] = await categoryRes.json();

        setCategories(categoryData);

        reset({
          title: data.title,
          description: data.description ?? "",
          image: undefined,
          category: String(data.category.id),

          tags:
            data.tags?.map((tag) => {
              const foundTag = tags[lang].find(
                (item) => item.label === tag,
              );

              return (
                foundTag ?? {
                  id: tag,
                  label: tag,
                }
              );
            }) ?? [],
        });
      } catch (error) {
        console.error(error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params, reset, t, toast]);

  const onSubmit = async (data: FormValues) => {
    const { id } = await params;

    if (!parentMeta) {
      toast.error(t("toast.error"));

      return;
    }

    try {
      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      let finalImageUrl = currentImage;

      if (data.image instanceof File) {
        finalImageUrl = await uploadParentNewsImage({
          file: data.image,
          onProgress: setImageUploadProgress,
          onFinalizing: setIsImageFinalizing,
        });
      }

      const payload = {
        title: data.title,
        description: data.description,
        image: finalImageUrl,
        tags: data.tags.map((item) => item.label),
        root_blog: parentMeta.root_blog,
        category: String(data.category),
        lang: parentMeta.lang,
      };

      const res = await fetch(`/api/blog/parent/update/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("UPDATE ERROR =>", result);

        toast.error(result?.error ?? t("toast.error"));

        return;
      }

      toast.success(t("toast.success"));

      router.push(`/${locale}/news`);
    } catch (error) {
      console.error(error);

      setImageUploadProgress(0);

      setIsImageFinalizing(false);

      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6 3xl:px-8 3xl:py-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-border bg-background grid min-h-0 w-full flex-1 grid-cols-[0.36fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-2xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr] 3xl:grid-cols-[0.36fr_1fr]"
        >
          {/* Information */}
          <div className="border-border bg-secondary-bg relative flex min-h-0 min-w-0 flex-col overflow-hidden border-e p-7 xl:p-5 2xl:p-6 3xl:p-7">
            <div className="min-w-0">
              <div className="border-border bg-background flex size-11 items-center justify-center rounded-xl border xl:size-10 3xl:size-11">
                <FilePenLine
                  className="text-custom-primary size-5 xl:size-[18px] 3xl:size-5"
                  strokeWidth={1.6}
                />
              </div>

              <div className="mt-5 xl:mt-4 3xl:mt-5">
                <h2 className="text-foreground text-xl font-semibold xl:text-[18px] 2xl:text-[19px] 3xl:text-xl">
                  {t("header.title")}
                </h2>

                <p className="text-muted-foreground mt-3 max-w-[280px] text-sm leading-7 xl:mt-2.5 xl:max-w-[240px] xl:text-[13px] xl:leading-6 2xl:max-w-[260px] 3xl:max-w-[280px] 3xl:text-sm 3xl:leading-7">
                  {t("header.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden p-8 pe-3 xl:p-5 xl:pe-2.5 2xl:p-6 2xl:pe-3 3xl:p-8 3xl:pe-3">
            <ScrollArea
              dir={locale === "en" ? "ltr" : "rtl"}
              data-lenis-prevent
              className="min-h-0 w-full flex-1 pe-5 xl:pe-4 2xl:pe-4.5 3xl:pe-5"
              scrollBarClassName="me-0"
            >
              <div className="flex min-w-0 flex-col gap-y-7 pb-8 xl:gap-y-5 2xl:gap-y-6 3xl:gap-y-7">
                {/* Category */}
                <div className="min-w-0">
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <CategorySelect
                        label={t("form.category.label")}
                        options={categories.map((item) => ({
                          label: item.name,
                          value: String(item.id),
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.category}
                      />
                    )}
                  />
                </div>

                {/* Tags */}
                <div className="min-w-0">
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field }) => (
                      <TagSelector
                        label={t("form.tags.label")}
                        options={tags[newsLang]}
                        lang={newsLang}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("form.tags.placeholder")}
                      />
                    )}
                  />
                </div>

                {/* Title */}
                <div className="min-w-0">
                  <FormField
                    label={t("form.title.label")}
                    placeholder={t("form.title.placeholder")}
                    register={register("title")}
                    error={errors.title}
                    as="input"
                  />
                </div>

                {/* Current Image */}
                {currentImage && (
                  <div className="min-w-0">
                    <label className="text-foreground mb-2 block text-sm font-medium xl:text-[13px] 2xl:text-sm">
                      {t("form.image.current")}
                    </label>

                    <div className="border-border bg-secondary-bg/40 flex items-center gap-4 rounded-xl border p-4">
                      <div className="border-border relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={currentImage}
                          alt={t("form.image.current")}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      </div>

                      <p className="text-muted-foreground text-sm leading-6 xl:text-[13px]">
                        {t("form.image.hint")}
                      </p>
                    </div>
                  </div>
                )}

                {/* New Image */}
                <div className="min-w-0">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <ParentNewsImageUploadField
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);

                          setImageUploadProgress(0);

                          setIsImageFinalizing(false);
                        }}
                        error={errors.image?.message as string | undefined}
                        progress={imageUploadProgress}
                        isUploading={isSubmitting}
                        isFinalizing={isImageFinalizing}
                      />
                    )}
                  />
                </div>

                {/* Description */}
                <div className="min-w-0">
                  <FormField
                    label={t("form.description.label")}
                    placeholder={t("form.description.placeholder")}
                    register={register("description")}
                    error={errors.description}
                    as="textarea"
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-border mt-5 flex shrink-0 justify-end border-t pt-6 xl:mt-4 xl:pt-4 2xl:mt-5 2xl:pt-5 3xl:pt-6">
              <CustomButton
                type="submit"
                intent="primary"
                variant="solid"
                disabled={loading || isSubmitting}
                className={cn(
                  "h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px] 3xl:h-10 3xl:min-w-[88px] 3xl:text-sm",
                  (loading || isSubmitting) &&
                    "cursor-not-allowed opacity-60",
                )}
              >
                {isImageFinalizing
                  ? t("form.actions.finalizing")
                  : isSubmitting
                    ? t("form.actions.saving")
                    : t("form.actions.saveChanges")}
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
