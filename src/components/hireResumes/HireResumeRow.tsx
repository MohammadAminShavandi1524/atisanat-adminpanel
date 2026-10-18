"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import { deleteHireResume } from "./hire-resumes.api";

import type { HireResume } from "./hire-resumes.types";

import { getCityLabel, getProvinceLabel } from "./data/iran-locations";

import {
  formatHireResumeValue,
  getHireResumeFullName,
  toPersianDigits,
  type HireResumeLocale,
} from "./hire-resumes.utils";

import HireResumeDetails from "./HireResumeDetails";

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
  const currentLocale = useLocale();
  const t = useTranslations("HireResumes");

  const locale: HireResumeLocale = currentLocale === "fa" ? "fa" : "en";

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fullName = getHireResumeFullName(resume, locale);

  const formatValue = (value: string | number | null | undefined) =>
    formatHireResumeValue(value, locale);

  const location = [
    getProvinceLabel(resume.province, locale),
    getCityLabel(resume.province, resume.city, locale),
  ]
    .filter((value) => value.trim() !== "")
    .join(" / ");

  const initials = [resume.first_name, resume.last_name]
    .filter(Boolean)
    .map((value) => value.charAt(0))
    .join("");

  const imageUrl = resume.image?.trim();

  const handleDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      await deleteHireResume(resume.id);

      setResumes((previous) =>
        previous.filter((item) => item.id !== resume.id),
      );

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE HIRE RESUME ERROR:", error);

      toast.error(t("toast.delete.error"));
    } finally {
      setDeleting(false);
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
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: Math.min(animationIndex, 8) * 0.045,
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
      dir={locale === "en" ? "ltr" : "rtl"}
      ref={rowRef}
      className="group/resume border-border bg-background hover:border-border-secondary relative min-w-0 rounded-lg border transition-[border-color,background-color] duration-300"
    >
      <span
        aria-hidden="true"
        className={`bg-custom-primary pointer-events-none absolute inset-y-2 start-0 w-[3px] origin-center rounded-e-full transition-transform duration-300 ${
          expanded ? "scale-y-0" : "scale-y-0 group-hover/resume:scale-y-100"
        }`}
      />

      {/* Summary Row */}
      <div className="grid min-h-[92px] grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_120px_100px] items-center gap-3 px-4 py-3">
        {/* ID */}
        <div className="text-muted-foreground text-[15px] font-medium">
          {locale === "fa" ? toPersianDigits(resume.id) : resume.id}
        </div>

        {/* Applicant */}
        <div className="flex min-w-0 items-center gap-3">
          {imageUrl ? (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={fullName}
              aria-label={fullName}
              className="border-border bg-card-secondary hover:border-custom-primary/60 flex h-[60px] w-[45px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border transition-colors"
            >
              <img
                src={imageUrl}
                alt={fullName}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </a>
          ) : (
            <div className="border-border bg-card-secondary text-muted-foreground flex h-[60px] w-[45px] shrink-0 items-center justify-center rounded-lg border text-[15px] font-semibold">
              {initials || "—"}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-foreground text-[14px] leading-6 font-semibold wrap-break-word">
              {fullName}
            </p>

            <p className="text-muted-foreground mt-1 text-[12px] leading-5 wrap-anywhere">
              {formatValue(resume.national_code)}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="text-muted-foreground min-w-0 text-[13px] leading-6 wrap-anywhere">
          {formatValue(resume.phone_number)}
        </div>

        {/* Location */}
        <div className="text-muted-foreground min-w-0 text-[13px] leading-6 wrap-anywhere">
          {formatValue(location)}
        </div>

        {/* Job Interest */}
        <div className="text-foreground min-w-0 text-[13px] leading-6 wrap-break-word">
          {formatValue(resume.job_interest)}
        </div>

        {/* Expand */}
        <div className="flex justify-center">
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            size="sm"
            onClick={() => setExpanded((previous) => !previous)}
            rightSection={
              expanded ? (
                <ChevronUp size={15} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={15} strokeWidth={1.8} />
              )
            }
            aria-expanded={expanded}
            aria-controls={`hire-resume-details-${resume.id}`}
            className="h-10 w-full px-2.5 text-[12px]"
          >
            {expanded ? t("actions.less") : t("actions.more")}
          </CustomButton>
        </div>

        {/* Delete */}
        <div className="flex justify-center">
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            disabled={deleting}
            onComplete={handleDelete}
            leftSection={<Trash2 size={15} strokeWidth={1.8} />}
            className="h-10 w-full px-2 text-[12px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div id={`hire-resume-details-${resume.id}`}>
          <HireResumeDetails resume={resume} />
        </div>
      )}
    </article>
  );
};

export default HireResumeRow;
