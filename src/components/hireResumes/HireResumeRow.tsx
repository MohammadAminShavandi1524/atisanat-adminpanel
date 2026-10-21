"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

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

import { useHireResumeRowAnimation } from "./hire-resumes.animations";

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

  useHireResumeRowAnimation(rowRef, animationIndex);

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
      <div className="3xl:min-h-[92px] 3xl:grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_120px_100px] 3xl:gap-3 3xl:px-4 3xl:py-3 grid min-h-[66px] min-w-0 grid-cols-[34px_minmax(0,1.45fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)_88px_68px] items-center gap-1.5 px-2 py-2 xl:min-h-[76px] xl:grid-cols-[42px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_105px_86px] xl:gap-2 xl:px-3 xl:py-2.5 2xl:min-h-[84px] 2xl:grid-cols-[48px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_112px_94px] 2xl:gap-2.5 2xl:px-3.5">
        {/* ID */}
        <div className="text-muted-foreground 3xl:text-[15px] min-w-0 text-[10px] font-medium xl:text-[12px] 2xl:text-[13px]">
          {locale === "fa" ? toPersianDigits(resume.id) : resume.id}
        </div>

        {/* Applicant */}
        <div className="3xl:gap-3 flex min-w-0 items-center gap-1.5 xl:gap-2">
          {imageUrl ? (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={fullName}
              aria-label={fullName}
              className="border-border bg-card-secondary hover:border-custom-primary/60 3xl:h-[60px] 3xl:w-[45px] flex h-[40px] w-[30px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border transition-colors xl:h-[48px] xl:w-[36px] 2xl:h-[54px] 2xl:w-[40px]"
            >
              <img
                src={imageUrl}
                alt={fullName}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </a>
          ) : (
            <div className="border-border bg-card-secondary text-muted-foreground 3xl:h-[60px] 3xl:w-[45px] 3xl:text-[15px] flex h-[40px] w-[30px] shrink-0 items-center justify-center rounded-lg border text-[11px] font-semibold xl:h-[48px] xl:w-[36px] xl:text-[13px] 2xl:h-[54px] 2xl:w-[40px]">
              {initials || "—"}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-foreground 3xl:text-[14px] 3xl:leading-6 3xl:wrap-break-word 3xl:whitespace-normal truncate text-[10px] leading-4 font-semibold xl:text-[12px] xl:leading-5 2xl:text-[13px]">
              {fullName}
            </p>

            <p className="text-muted-foreground 3xl:mt-1 3xl:text-[12px] 3xl:leading-5 3xl:wrap-anywhere 3xl:whitespace-normal mt-0.5 truncate text-[9px] leading-4 xl:text-[11px]">
              {formatValue(resume.national_code)}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="text-muted-foreground 3xl:text-[13px] 3xl:leading-6 3xl:wrap-anywhere 3xl:whitespace-normal min-w-0 truncate text-[10px] leading-4 xl:text-[11px] xl:leading-5 2xl:text-[12px]">
          {formatValue(resume.phone_number)}
        </div>

        {/* Location */}
        <div className="text-muted-foreground 3xl:text-[13px] 3xl:leading-6 min-w-0 text-[10px] leading-4 wrap-anywhere xl:text-[11px] xl:leading-5 2xl:text-[12px]">
          {formatValue(location)}
        </div>

        {/* Job Interest */}
        <div className="text-foreground 3xl:text-[13px] 3xl:leading-6 min-w-0 text-[10px] leading-4 wrap-break-word xl:text-[11px] xl:leading-5 2xl:text-[12px]">
          {formatValue(resume.job_interest)}
        </div>

        {/* Expand */}
        <div className="flex min-w-0 justify-center">
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            size="sm"
            onClick={() => setExpanded((previous) => !previous)}
            rightSection={
              expanded ? (
                <ChevronUp
                  className="3xl:size-[15px] size-3 shrink-0"
                  strokeWidth={1.8}
                />
              ) : (
                <ChevronDown
                  className="3xl:size-[15px] size-3 shrink-0"
                  strokeWidth={1.8}
                />
              )
            }
            aria-expanded={expanded}
            aria-controls={`hire-resume-details-${resume.id}`}
            className="3xl:h-10 3xl:gap-2 3xl:px-2.5 3xl:text-[12px] h-8 w-full min-w-0 gap-0.5 px-1 text-[10px] xl:h-9 xl:gap-1 xl:text-[11px]"
          >
            {expanded ? t("actions.less") : t("actions.more")}
          </CustomButton>
        </div>

        {/* Delete */}
        <div className="flex min-w-0 justify-center">
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            disabled={deleting}
            onComplete={handleDelete}
            leftSection={
              <Trash2
                className="3xl:size-[15px] size-3 shrink-0"
                strokeWidth={1.8}
              />
            }
            className="3xl:h-10 3xl:px-2 3xl:text-[12px] h-8 w-full min-w-0 gap-0.5 px-1 text-[10px] xl:h-9 xl:text-[11px]"
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
