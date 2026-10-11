"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { englishToPersianNumber } from "@/lib/utils";
import { CustomHoldButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteDynamicResumeAnswer,
  type DynamicResumeSubmission,
} from "./dynamicResumes.api";

gsap.registerPlugin(useGSAP);

interface DynamicResumeRowProps {
  submission: DynamicResumeSubmission;
  refreshAnswers: () => Promise<void>;
  animationIndex?: number;
}

export default function DynamicResumeRow({
  submission,
  refreshAnswers,
  animationIndex = 0,
}: DynamicResumeRowProps) {
  const locale = useLocale();
  const t = useTranslations("dynamicResumes");
  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const formatNumber = (value: number) =>
    locale === "fa" ? englishToPersianNumber(String(value)) : String(value);

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleDelete = async () => {
    try {
      await deleteDynamicResumeAnswer(submission.id);
      await refreshAnswers();

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE DYNAMIC RESUME ANSWER ERROR:", error);
      toast.error(t("toast.delete.error"));
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
      className="border-border bg-background hover:bg-card-secondary/30 relative overflow-hidden rounded-lg border p-5 transition-colors duration-300 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="text-muted-foreground text-xs">
              {t("metadata.id")}
            </span>

            <p className="text-foreground mt-1 text-sm font-semibold">
              <bdi dir="ltr">#{formatNumber(submission.id)}</bdi>
            </p>
          </div>

          <div>
            <span className="text-muted-foreground text-xs">
              {t("metadata.created")}
            </span>

            <p className="text-foreground mt-1 text-sm">
              <time dateTime={submission.created}>
                {formatDate(submission.created)}
              </time>
            </p>
          </div>
        </div>

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

      <div className="border-border mt-5 border-t pt-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {submission.answers.map((item, index) => (
            <div
              key={`${submission.id}-${index}`}
              className="border-border bg-card-secondary/40 min-w-0 rounded-md border p-4"
            >
              <p lang="fa" className="text-foreground text-sm leading-7 font-medium">
                <span className="text-muted-foreground me-2">
                  {formatNumber(index + 1)}.
                </span>

                <bdi dir="auto">{item.question}</bdi>
              </p>

              <div className="text-muted-foreground border-border mt-3 border-t pt-3 text-sm leading-7">
                <p  className="text-foreground mb-1 text-xs font-medium">
                  {t("answers.answer")}
                </p>

                <p lang="fa" className="break-words whitespace-pre-wrap">
                  <bdi dir="auto">{item.answer}</bdi>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
