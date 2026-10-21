"use client";

import { useMemo, useRef } from "react";

import { CircleHelp, LoaderCircle } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useCustomToast } from "@/components/ui/custom-toast";

import { createFaq } from "../faq.api";

import { createFaqSchema, type FaqFormValues } from "../faq.schema";
import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";

const FaqForm = () => {
  const t = useTranslations("addFaq");
  const locale = useLocale();

  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const schema = useMemo(
    () =>
      createFaqSchema({
        questionEnRequired: t("validation.questionEnRequired"),
        questionEnMax: t("validation.questionEnMax"),

        questionFaRequired: t("validation.questionFaRequired"),
        questionFaMax: t("validation.questionFaMax"),

        answerEnRequired: t("validation.answerEnRequired"),
        answerFaRequired: t("validation.answerFaRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      question_en: "",
      question_fa: "",
      answer_en: "",
      answer_fa: "",
    },
  });

  const onSubmit = async (data: FaqFormValues) => {
    try {
      await createFaq(data);

      reset();

      toast.success(t("toast.success"));
    } catch (error) {
      console.error("CREATE FAQ ERROR:", error);

      toast.error(t("toast.error"));
    }
  };

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
            <CircleHelp
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
          dir={locale === "en" ? "ltr" : "rtl"}
          className="3xl:pe-5 min-h-0 flex-1 overflow-hidden pe-5 xl:pe-4 2xl:pe-4.5"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-y-8 flex flex-col gap-y-8 pb-8 xl:gap-y-6 2xl:gap-y-7">
            {/* Questions */}
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.questionEn.label")}
                placeholder={t("form.questionEn.placeholder")}
                register={register("question_en")}
                error={errors.question_en}
                as="input"
                dir="ltr"
              />

              <FormField
                label={t("form.questionFa.label")}
                placeholder={t("form.questionFa.placeholder")}
                register={register("question_fa")}
                error={errors.question_fa}
                as="input"
                dir="rtl"
                lang="fa"
              />
            </div>

            {/* Answers */}
            <div className="3xl:gap-6 grid grid-cols-2 gap-6 xl:gap-4 2xl:gap-5">
              <FormField
                label={t("form.answerEn.label")}
                placeholder={t("form.answerEn.placeholder")}
                register={register("answer_en")}
                error={errors.answer_en}
                as="textarea"
                dir="ltr"
              />

              <FormField
                label={t("form.answerFa.label")}
                placeholder={t("form.answerFa.placeholder")}
                register={register("answer_fa")}
                error={errors.answer_fa}
                as="textarea"
                dir="rtl"
                lang="fa"
              />
            </div>
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

                <span>{t("form.submitting")}</span>
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

export default FaqForm;
