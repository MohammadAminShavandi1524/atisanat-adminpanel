"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BriefcaseBusiness, RefreshCw, SearchX } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

gsap.registerPlugin(useGSAP);

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

  useGSAP(
    () => {
      if (!pageRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        ".hire-resumes-panel",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    },
    {
      scope: pageRef,
      dependencies: [locale],
    },
  );

  const totalCount =
    locale === "fa" ? toPersianDigits(resumes.length) : resumes.length;

  const filteredCount =
    locale === "fa"
      ? toPersianDigits(filteredResumes.length)
      : filteredResumes.length;

  return (
    <div ref={pageRef} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HeaderLayout title={t("header.title")} descrption="" />

      <div className="3xl:p-8 flex min-h-0 min-w-0 flex-1 flex-col p-5 2xl:p-6">
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
            <div className="hire-resumes-table-header border-border bg-card-secondary shrink-0 border-b ps-[29px] pe-[37px]">
              <div className="text-muted-foreground grid h-12 grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_120px_100px] items-center gap-3 text-[13px] font-semibold">
                <div>{t("table.id")}</div>

                <div>{t("table.applicant")}</div>

                <div>{t("table.phone")}</div>

                <div>{t("table.location")}</div>

                <div>{t("table.jobInterest")}</div>

                <div className="text-center">{t("table.details")}</div>

                <div className="text-center">{t("table.actions")}</div>
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
                <div className="space-y-2.5 py-3.5 ps-3 pe-5">
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
