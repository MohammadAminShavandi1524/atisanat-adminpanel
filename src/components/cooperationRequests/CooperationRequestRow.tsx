"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";

import { ExternalLink, FileText, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteCooperationRequest,
  type CooperationRequest,
} from "./cooperation-requests.api";

import {
  formatCooperationRequestDate,
  toPersianDigits,
} from "./cooperation-requests.utils";

import { useCooperationRequestRowAnimation } from "./cooperation-requests.animations";

interface CooperationRequestRowProps {
  request: CooperationRequest;

  setRequests: Dispatch<SetStateAction<CooperationRequest[]>>;

  animationIndex?: number;
}

const CooperationRequestRow = ({
  request,
  setRequests,
  animationIndex = 0,
}: CooperationRequestRowProps) => {
  const locale = useLocale();

  const t = useTranslations("CooperationRequests");

  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const formattedDate = formatCooperationRequestDate(request.created, locale);

  useCooperationRequestRowAnimation(rowRef, animationIndex);

  const handleViewResume = () => {
    window.open(request.resume, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    try {
      await deleteCooperationRequest(String(request.id));

      setRequests((prev) => prev.filter((item) => item.id !== request.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE COOPERATION REQUEST ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  return (
    <article
      ref={rowRef}
      className="group/request border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative min-w-0 rounded-lg border transition-[background-color,border-color] duration-300"
    >
      <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/request:scale-y-100" />

      <div className="3xl:min-h-[76px] 3xl:grid-cols-[60px_1.25fr_1.1fr_1.45fr_1.1fr_130px_130px_100px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[60px] min-w-0 grid-cols-[34px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.85fr)_76px_78px_74px] items-center gap-1.5 px-2 py-2 xl:min-h-[66px] xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1fr_105px_105px_82px] xl:gap-2.5 xl:px-3 xl:py-2.5 2xl:min-h-[71px] 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.05fr_115px_115px_90px] 2xl:gap-3 2xl:px-4">
        {/* ID */}
        <div
          dir={locale === "fa" ? "rtl" : "ltr"}
          className="text-muted-foreground 3xl:text-sm min-w-0 text-[10px] xl:text-[12px] 2xl:text-[13px]"
        >
          {locale === "fa"
            ? `${toPersianDigits(request.id)}#`
            : `#${request.id}`}
        </div>

        {/* Full Name */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-[15px] truncate text-[11px] font-medium xl:text-[13px] 2xl:text-[14px]">
            {request.full_name}
          </p>
        </div>

        {/* Phone */}
        <div
          dir={locale === "fa" ? "rtl" : "ltr"}
          className="text-muted-foreground 3xl:text-sm min-w-0 truncate text-[10px] xl:text-[12px] 2xl:text-[13px]"
        >
          {request.phone_number}
        </div>

        {/* Email */}
        <div className="min-w-0">
          <a
            href={`mailto:${request.email}`}
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground hover:text-custom-primary 3xl:text-sm block min-w-0 truncate text-[10px] transition-colors duration-300 xl:text-[12px] 2xl:text-[13px]"
          >
            {request.email}
          </a>
        </div>

        {/* Company */}
        <div className="min-w-0">
          <p className="text-foreground 3xl:text-sm truncate text-[10px] xl:text-[12px] 2xl:text-[13px]">
            {request.company || t("table.emptyValue")}
          </p>
        </div>

        {/* Date */}
        <div className="text-muted-foreground 3xl:text-sm min-w-0 text-[10px] leading-4 xl:text-[12px] 2xl:text-[13px]">
          {formattedDate}
        </div>

        {/* Resume */}
        <div className="flex min-w-0 justify-center">
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            onClick={handleViewResume}
            leftSection={
              <FileText
                className="3xl:size-[17px] size-3 shrink-0 xl:size-4"
                strokeWidth={1.8}
              />
            }
            rightSection={
              <ExternalLink
                className="3xl:size-[15px] size-2.5 shrink-0 xl:size-3.5"
                strokeWidth={1.8}
              />
            }
            className="3xl:h-10 3xl:min-w-[88px] 3xl:px-3.5 3xl:text-sm h-8 w-full min-w-0 gap-1 px-1 text-[10px] xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
          >
            {t("actions.view")}
          </CustomButton>
        </div>

        {/* Delete */}
        <div className="flex min-w-0 justify-center">
          <CustomHoldButton
            type="button"
            intent="destructive"
            variant="soft"
            duration={800}
            onComplete={handleDelete}
            leftSection={
              <Trash2
                className="3xl:size-[17px] size-3 shrink-0 xl:size-4"
                strokeWidth={1.8}
              />
            }
            className="3xl:h-10 3xl:min-w-[88px] 3xl:px-3.5 3xl:text-sm h-8 w-full min-w-0 gap-1 px-1 text-[10px] xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
          >
            {t("actions.delete")}
          </CustomHoldButton>
        </div>
      </div>
    </article>
  );
};

export default CooperationRequestRow;
