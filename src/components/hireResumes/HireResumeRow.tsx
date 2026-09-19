"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { ExternalLink, FileText, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { deleteHireResume, type HireResume } from "./hire-resumes.api";

import { formatHireResumeDate, toPersianDigits } from "./hire-resumes.utils";

gsap.registerPlugin(useGSAP);

interface HireResumeRowProps {
  resume: HireResume;

  setResumes: Dispatch<SetStateAction<HireResume[]>>;

  animationIndex?: number;
}

const HireResumeRow = ({
  resume,
  setResumes,
  animationIndex = 0,
}: HireResumeRowProps) => {
  const locale = useLocale();

  const t = useTranslations("HireResumes");

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const formattedDate = formatHireResumeDate(resume.created, locale);

  const handleViewResume = () => {
    window.open(resume.resume, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    try {
      await deleteHireResume(String(resume.id));

      setResumes((prev) => prev.filter((item) => item.id !== resume.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE HIRE RESUME ERROR:", error);

      toast.error(t("toast.delete.error"));
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
          duration: 0.5,
          delay: Math.min(animationIndex, 8) * 0.055,
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
      className="group/resume border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative rounded-lg border transition-[background-color,border-color] duration-300"
    >
      <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/resume:scale-y-100" />

      <div className="3xl:min-h-[76px] 3xl:grid-cols-[60px_1.35fr_1.25fr_1.65fr_145px_145px_110px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[76px] grid-cols-[60px_1.35fr_1.25fr_1.65fr_145px_145px_110px] items-center gap-4 px-5 py-3 xl:min-h-[66px] xl:grid-cols-[46px_1.25fr_1.05fr_1.4fr_115px_112px_86px] xl:gap-2.5 xl:px-3 xl:py-2.5 2xl:min-h-[71px] 2xl:grid-cols-[52px_1.3fr_1.15fr_1.5fr_125px_125px_96px] 2xl:gap-3 2xl:px-4">
        {/* ID */}
        <div
          dir={locale === "fa" ? "rtl" : "ltr"}
          className="text-muted-foreground 3xl:text-sm font-mono text-sm xl:text-[12px] 2xl:text-[13px]"
        >
          {locale === "fa" ? `${toPersianDigits(resume.id)}#` : `#${resume.id}`}
        </div>

        {/* Full Name */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {resume.full_name}
          </p>
        </div>

        {/* Phone */}
        <div
          dir={locale === "fa" ? "rtl" : "ltr"}
          className="text-muted-foreground 3xl:text-sm min-w-0 truncate text-sm xl:text-[12px] 2xl:text-[13px]"
        >
          {resume.phone_number}
        </div>

        {/* Email */}
        <div className="min-w-0">
          <a
            href={`mailto:${resume.email}`}
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground hover:text-custom-primary 3xl:text-sm block truncate text-sm transition-colors duration-300 xl:text-[12px] 2xl:text-[13px]"
          >
            {resume.email}
          </a>
        </div>

        {/* Date */}
        <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
          {formattedDate}
        </div>

        {/* Resume */}
        <div className="flex justify-center">
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            onClick={handleViewResume}
            leftSection={
              <FileText
                strokeWidth={1.8}
                className="3xl:size-4 size-4 xl:size-3.5"
              />
            }
            rightSection={
              <ExternalLink
                strokeWidth={1.8}
                className="3xl:size-3.5 size-3.5 xl:size-3"
              />
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2.5 xl:text-[12px] 2xl:text-[13px]"
          >
            {t("actions.view")}
          </CustomButton>
        </div>

        {/* Delete */}
        <div className="flex justify-center">
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            leftSection={
              <Trash2
                strokeWidth={1.8}
                className="3xl:size-4 size-4 xl:size-3.5"
              />
            }
            className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2.5 xl:text-[12px] 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
};

export default HireResumeRow;
