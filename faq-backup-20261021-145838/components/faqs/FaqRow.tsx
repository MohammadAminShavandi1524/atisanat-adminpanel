"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { englishToPersianNumber } from "@/lib/utils";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteFaq,
  increaseFaqIndex,
  reduceFaqIndex,
  type Faq,
} from "./faqs.api";

gsap.registerPlugin(useGSAP);

interface FaqRowProps {
  faq: Faq;

  setFaqs: Dispatch<SetStateAction<Faq[]>>;

  refreshFaqs: () => Promise<void>;

  animationIndex?: number;
}

const FaqRow = ({
  faq,
  setFaqs,
  refreshFaqs,
  animationIndex = 0,
}: FaqRowProps) => {
  const locale = useLocale();

  const router = useRouter();

  const t = useTranslations("Faqs");

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const handleDelete = async () => {
    try {
      await deleteFaq(faq.id);

      setFaqs((prev) => prev.filter((item) => item.id !== faq.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE FAQ ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  const handleIncreaseIndex = async () => {
    try {
      await increaseFaqIndex(faq.id);

      await refreshFaqs();
    } catch (error) {
      console.error("INCREASE FAQ INDEX ERROR:", error);

      toast.error(t("toast.order.error"));
    }
  };

  const handleReduceIndex = async () => {
    try {
      await reduceFaqIndex(faq.id);

      await refreshFaqs();
    } catch (error) {
      console.error("REDUCE FAQ INDEX ERROR:", error);

      toast.error(t("toast.order.error"));
    }
  };

  useGSAP(
    () => {
      if (!rowRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: Math.min(animationIndex, 8) * 0.05,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );

  return (
    <article
      ref={rowRef}
      className="group/faq border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative rounded-lg border transition-[background-color,border-color] duration-300"
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/faq:scale-y-100" />

      <div className="3xl:min-h-[120px] 3xl:grid-cols-[70px_1.15fr_1.15fr_1.45fr_1.45fr_300px] 3xl:gap-5 3xl:px-5 3xl:py-4 grid min-h-[116px] grid-cols-[70px_1.15fr_1.15fr_1.45fr_1.45fr_300px] items-center gap-5 px-5 py-4 xl:min-h-[104px] xl:grid-cols-[52px_1fr_1fr_1.25fr_1.25fr_250px] xl:gap-3 xl:px-3 xl:py-3 2xl:min-h-[112px] 2xl:grid-cols-[60px_1.1fr_1.1fr_1.35fr_1.35fr_275px] 2xl:gap-4 2xl:px-4">
        {/* Index */}
        <div className="text-muted-foreground 3xl:text-sm text-sm font-medium xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa"
            ? englishToPersianNumber(String(faq.index))
            : faq.index}
        </div>

        {/* Question EN */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-sm 3xl:leading-6 line-clamp-3 text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-normal xl:text-[12px] xl:leading-5 2xl:text-[13px]">
            {faq.question_en}
          </p>
        </div>

        {/* Question FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-foreground 3xl:text-sm 3xl:leading-6 line-clamp-3 text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-normal xl:text-[12px] xl:leading-5 2xl:text-[13px]"
          >
            {faq.question_fa}
          </p>
        </div>

        {/* Answer EN */}
        <div className="min-w-0">
          <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-3 text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-normal xl:text-[12px] xl:leading-5 2xl:text-[13px]">
            {faq.answer_en}
          </p>
        </div>

        {/* Answer FA */}
        <div className="min-w-0">
          <p
            lang="fa"
            className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-3 text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-normal xl:text-[12px] xl:leading-5 2xl:text-[13px]"
          >
            {faq.answer_fa}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Order */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleReduceIndex}
              aria-label={t("actions.moveUp")}
              className="border-border text-muted-foreground hover:border-custom-primary/45 hover:bg-custom-primary/6 hover:text-custom-primary 3xl:size-10 flex size-10 cursor-pointer items-center justify-center rounded-s-lg border transition-[background-color,border-color,color] duration-200 xl:size-9 2xl:size-9.5"
            >
              <ChevronUp
                className="3xl:size-[19px] size-[18px] xl:size-[17px]"
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleIncreaseIndex}
              aria-label={t("actions.moveDown")}
              className="border-border text-muted-foreground hover:border-custom-primary/45 hover:bg-custom-primary/6 hover:text-custom-primary 3xl:size-10 flex size-10 cursor-pointer items-center justify-center rounded-e-lg border border-s-0 transition-[background-color,border-color,color] duration-200 xl:size-9 2xl:size-9.5"
            >
              <ChevronDown
                className="3xl:size-[19px] size-[18px] xl:size-[17px]"
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Edit */}
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            onClick={() => {
              router.push(`/${locale}/faq/${faq.id}/edit`);
            }}
            leftSection={
              <Pencil className="3xl:size-[17px] size-4" strokeWidth={1.8} />
            }
            className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
          >
            {t("actions.edit")}
          </CustomButton>

          {/* Delete */}
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            leftSection={
              <Trash2 className="3xl:size-[17px] size-4" strokeWidth={1.8} />
            }
            className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
};

export default FaqRow;
