"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BriefcaseBusiness, RefreshCw, SearchX } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";

import { getHireResumes } from "./hire-resumes.api";

import {
  initialHireResumeFilters,
  type HireResume,
  type HireResumeFiltersState,
} from "./hire-resumes.types";

import { filterHireResumes, toPersianDigits } from "./hire-resumes.utils";

import HireResumeFilters from "./HireResumeFilters";
import HireResumeRow from "./HireResumeRow";

import { useHireResumesPageAnimation } from "./hire-resumes.animations";

const HireResumesPage = () => {
  const locale = useLocale();
  const t = useTranslations("HireResumes");

  const pageRef = useRef<HTMLDivElement>(null);

  const [resumes, setResumes] = useState<HireResume[]>([]);

  const [filters, setFilters] = useState<HireResumeFiltersState>(
    initialHireResumeFilters,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useHireResumesPageAnimation(pageRef, locale);

  const filteredResumes = useMemo(
    () => filterHireResumes(resumes, filters),
    [resumes, filters],
  );

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.province !== "" ||
    filters.city !== "" ||
    filters.jobInterest.trim() !== "" ||
    filters.dutyStatus !== "" ||
    filters.workExperience !== "all";

  const fetchResumes = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getHireResumes();
      setResumes(data);
    } catch (fetchError) {
      console.error("GET HIRE RESUMES ERROR:", fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchResumes();
  }, []);

  const totalCount =
    locale === "fa" ? toPersianDigits(resumes.length) : resumes.length;

  const filteredCount =
    locale === "fa"
      ? toPersianDigits(filteredResumes.length)
      : filteredResumes.length;

  return (
    <div ref={pageRef} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HeaderLayout title={t("header.title")} descrption="" />

      <div className="3xl:p-8 flex min-h-0 min-w-0 flex-1 flex-col p-3 xl:p-5 2xl:p-6">
        <section className="hire-resumes-panel border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Filters */}
          <HireResumeFilters
            resumes={resumes}
            filters={filters}
            onChange={setFilters}
          />

          {/* Preserved hidden result toolbar */}
          <div className="border-border bg-card-secondary hidden h-12 shrink-0 items-center justify-between gap-4 border-b px-5">
            <div className="text-muted-foreground flex items-center gap-2 text-[13px]">
              <BriefcaseBusiness size={17} strokeWidth={1.8} />

              <span>
                {t("list.total")}:{" "}
                <strong className="text-foreground font-semibold">
                  {totalCount}
                </strong>
              </span>

              {hasActiveFilters && (
                <>
                  <span className="text-border-secondary mx-1">/</span>

                  <span>
                    {t("list.filtered")}:{" "}
                    <strong className="text-foreground font-semibold">
                      {filteredCount}
                    </strong>
                  </span>
                </>
              )}
            </div>

            {!loading && (
              <CustomButton
                type="button"
                variant="ghost"
                intent="secondary"
                size="sm"
                onClick={() => void fetchResumes()}
                leftSection={<RefreshCw size={15} strokeWidth={1.8} />}
                className="h-9 px-3 text-xs"
              >
                {t("actions.refresh")}
              </CustomButton>
            )}
          </div>

          {/* Table */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {/* Table Header */}
            <div className="hire-resumes-table-header border-border bg-card-secondary 3xl:ps-[29px] 3xl:pe-[37px] shrink-0 border-b ps-[21px] pe-[29px] xl:ps-[25px] xl:pe-[33px] 2xl:ps-[27px] 2xl:pe-[35px]">
              <div className="text-muted-foreground 3xl:h-12 3xl:grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_120px_100px] 3xl:gap-3 3xl:text-[13px] grid h-10 min-w-0 grid-cols-[34px_minmax(0,1.45fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)_88px_68px] items-center gap-1.5 text-[10px] font-semibold xl:h-11 xl:grid-cols-[42px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_105px_86px] xl:gap-2 xl:text-[11px] 2xl:h-11.5 2xl:grid-cols-[48px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_112px_94px] 2xl:gap-2.5 2xl:text-[12px]">
                <div className="min-w-0">{t("table.id")}</div>

                <div className="min-w-0">{t("table.applicant")}</div>

                <div className="min-w-0">{t("table.phone")}</div>

                <div className="min-w-0">{t("table.location")}</div>

                <div className="min-w-0">{t("table.jobInterest")}</div>

                <div className="min-w-0 text-center">{t("table.details")}</div>

                <div className="min-w-0 text-center">{t("table.actions")}</div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center gap-3">
                <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                <span className="text-muted-foreground text-sm">
                  {t("loading")}
                </span>
              </div>
            ) : error ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="border-border bg-card-secondary flex size-12 items-center justify-center rounded-lg border">
                  <RefreshCw
                    size={22}
                    strokeWidth={1.7}
                    className="text-muted-foreground"
                  />
                </div>

                <div>
                  <h3 className="text-foreground text-base font-semibold">
                    {t("error.title")}
                  </h3>

                  <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">
                    {t("error.description")}
                  </p>
                </div>

                <CustomButton
                  type="button"
                  variant="outline"
                  intent="secondary"
                  size="lg"
                  onClick={() => void fetchResumes()}
                >
                  {t("actions.retry")}
                </CustomButton>
              </div>
            ) : filteredResumes.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                data-lenis-prevent
                className="min-h-0 min-w-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:py-3.5 space-y-2 py-2.5 ps-3 pe-5 xl:space-y-2.5 xl:py-3">
                  {filteredResumes.map((resume, index) => (
                    <HireResumeRow
                      key={resume.id}
                      resume={resume}
                      setResumes={setResumes}
                      animationIndex={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="border-border bg-card-secondary flex size-12 items-center justify-center rounded-lg border">
                  {hasActiveFilters ? (
                    <SearchX
                      size={22}
                      strokeWidth={1.7}
                      className="text-muted-foreground"
                    />
                  ) : (
                    <BriefcaseBusiness
                      size={22}
                      strokeWidth={1.7}
                      className="text-muted-foreground"
                    />
                  )}
                </div>

                <h3 className="text-foreground mt-4 text-base font-semibold">
                  {hasActiveFilters
                    ? t("empty.filteredTitle")
                    : t("empty.title")}
                </h3>

                <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-6">
                  {hasActiveFilters
                    ? t("empty.filteredDescription")
                    : t("empty.description")}
                </p>

                {hasActiveFilters && (
                  <CustomButton
                    type="button"
                    variant="outline"
                    intent="secondary"
                    size="lg"
                    onClick={() => setFilters(initialHireResumeFilters)}
                    className="mt-5"
                  >
                    {t("filters.reset")}
                  </CustomButton>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HireResumesPage;
