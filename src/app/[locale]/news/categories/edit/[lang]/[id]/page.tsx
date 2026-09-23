"use client";

import { useEffect, useState } from "react";

import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Tags } from "lucide-react";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { FormField } from "@/components/FormField";

import { CustomButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

const Page = ({ params }: PageProps) => {
  const t = useTranslations("editCategory");

  const locale = useLocale();

  const router = useRouter();

  const toast = useCustomToast();

  const [loading, setLoading] = useState(true);

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, t("form.validation.required"))
      .max(30, t("form.validation.max")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    reset,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const getCategory = async () => {
      const { lang, id } = await params;

      try {
        const res = await fetch(`/api/blog/category/${lang}`);

        if (!res.ok) {
          throw new Error();
        }

        const data: Category[] = await res.json();

        const category = data.find((item) => item.id === Number(id));

        if (category) {
          reset({
            name: category.name,
          });
        }
      } catch (error) {
        console.error(error);

        toast.error(t("toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [params, reset, t]);

  const onSubmit = async (data: FormValues) => {
    const { lang, id } = await params;

    try {
      const res = await fetch(`/api/blog/category/update/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: data.name,
          lang,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(t("toast.success"));

      router.push(`/${locale}/news`);
    } catch (error) {
      console.error(error);

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
                <Tags
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
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden p-8 xl:p-5 2xl:p-6 3xl:p-8">
            <div className="min-h-0 w-full flex-1">
              <div className="min-w-0">
                <FormField
                  label={t("form.name.label")}
                  placeholder={t("form.name.placeholder")}
                  register={register("name")}
                  error={errors.name}
                  as="input"
                />
              </div>
            </div>

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
                {isSubmitting
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
