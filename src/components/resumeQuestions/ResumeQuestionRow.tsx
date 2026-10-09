"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { englishToPersianNumber } from "@/lib/utils";
import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import type { ResumeQuestion } from "./resumeQuestions.api";
import { deleteResumeQuestion } from "./delete-resume-question.api";
import {
  decreaseResumeQuestionIndex,
  increaseResumeQuestionIndex,
} from "./resume-question-index.api";

gsap.registerPlugin(useGSAP);

interface ResumeQuestionRowProps {
  question: ResumeQuestion;
  refreshQuestions: () => Promise<void>;
  animationIndex?: number;
  isFirst: boolean;
  isLast: boolean;
}

export default function ResumeQuestionRow({
  question,
  refreshQuestions,
  animationIndex = 0,
  isFirst,
  isLast,
}: ResumeQuestionRowProps) {
  const locale = useLocale();
  const router = useRouter();
  const toast = useCustomToast();
  const t = useTranslations("resumeQuestions");
  const rowRef = useRef<HTMLElement>(null);

  const isEn = locale === "en";

  const handleDelete = async () => {
    try {
      await deleteResumeQuestion(question.id);
      await refreshQuestions();
      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE RESUME QUESTION ERROR:", error);
      toast.error(t("toast.delete.error"));
    }
  };

  const handleMoveUp = async () => {
    try {
      await decreaseResumeQuestionIndex(question.id);
      await refreshQuestions();
    } catch (error) {
      console.error("DECREASE RESUME QUESTION INDEX ERROR:", error);
      toast.error(t("toast.order.error"));
    }
  };

  const handleMoveDown = async () => {
    try {
      await increaseResumeQuestionIndex(question.id);
      await refreshQuestions();
    } catch (error) {
      console.error("INCREASE RESUME QUESTION INDEX ERROR:", error);
      toast.error(t("toast.order.error"));
    }
  };

  useGSAP(
    () => {
      if (!rowRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        rowRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: Math.min(animationIndex, 8) * 0.04,
          ease: "power3.out",
        },
      );
    },
    { scope: rowRef },
  );

  return (
    <article
      ref={rowRef}
      className="group/question border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative rounded-md border transition-[background-color,border-color] duration-300"
    >
      <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/question:scale-y-100" />

      <div className="grid min-h-[94px] grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_300px] items-center gap-5 px-5 py-3">
        {/* Index */}
        <div className="text-muted-foreground text-sm font-medium">
          {locale === "fa"
            ? englishToPersianNumber(String(question.index))
            : question.index}
        </div>

        {/* Persian Question */}
        <div className="min-w-0">
          <p
            dir={isEn ? "ltr" : "rtl"}
            className="text-foreground line-clamp-3 text-sm leading-6"
          >
            <bdi dir="auto">{question.question_fa}</bdi>
          </p>
        </div>

        {/* English Question */}
        <div className="min-w-0">
          <p
            dir={isEn ? "ltr" : "rtl"}
            className="text-foreground line-clamp-3 text-sm leading-6"
          >
            <bdi dir="auto">{question.question_en}</bdi>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.75">
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleMoveUp}
              disabled={isFirst}
              aria-label={t("actions.moveUp")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronUp className="size-5" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={handleMoveDown}
              disabled={isLast}
              aria-label={t("actions.moveDown")}
              className="border-border-secondary text-muted-foreground hover:border-custom-primary/40 hover:text-custom-primary flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronDown className="size-5" strokeWidth={1.8} />
            </button>
          </div>

          <CustomButton
            type="button"
            variant="soft"
            intent="secondary"
            size="md"
            onClick={() => {
              router.push(`/${locale}/resume-questions/${question.id}/edit`);
            }}
            leftSection={<Pencil size={16} strokeWidth={1.8} />}
            className=""
          >
            {t("actions.edit")}
          </CustomButton>

          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            size="md"
            duration={800}
            onComplete={handleDelete}
            leftSection={<Trash2 size={16} strokeWidth={1.8} />}
            className=""
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
}
