"use client";

import { useMemo } from "react";
import { ArrowDownUp, RotateCcw, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CustomButton } from "@/components/ui/custom-button";

import {
  getCityLabel,
  getProvinceLabel,
  type ResumeLocale,
} from "./data/iran-locations";

import type {
  HireResume,
  HireResumeFiltersState,
  HireResumeWorkFilter,
} from "./hire-resumes.types";

interface HireResumeFiltersProps {
  resumes: HireResume[];
  filters: HireResumeFiltersState;
  onChange: (filters: HireResumeFiltersState) => void;
}

const dutyStatusOptions = [
  {
    value: "served",
    fa: "دارای کارت پایان خدمت",
    en: "Completed Military Service",
  },
  {
    value: "not_served",
    fa: "مشمول خدمت",
    en: "Subject to Military Service",
  },
  {
    value: "exempt",
    fa: "معاف از خدمت",
    en: "Exempt from Military Service",
  },
];

const HireResumeFilters = ({
  resumes,
  filters,
  onChange,
}: HireResumeFiltersProps) => {
  const currentLocale = useLocale();

  const locale: ResumeLocale = currentLocale === "fa" ? "fa" : "en";

  const t = useTranslations("HireResumes.filters");

  const isFa = locale === "fa";

  const provinces = useMemo(() => {
    return [
      ...new Set(
        resumes
          .map((resume) => resume.province)
          .filter((value): value is string => Boolean(value?.trim())),
      ),
    ].sort((a, b) =>
      getProvinceLabel(a, locale).localeCompare(
        getProvinceLabel(b, locale),
        locale,
      ),
    );
  }, [resumes, locale]);

  const cities = useMemo(() => {
    if (!filters.province) {
      return [];
    }

    return [
      ...new Set(
        resumes
          .filter((resume) => resume.province === filters.province)
          .map((resume) => resume.city)
          .filter((value): value is string => Boolean(value?.trim())),
      ),
    ].sort((a, b) =>
      getCityLabel(filters.province, a, locale).localeCompare(
        getCityLabel(filters.province, b, locale),
        locale,
      ),
    );
  }, [resumes, filters.province, locale]);

  const setFilter = <K extends keyof HireResumeFiltersState>(
    key: K,
    value: HireResumeFiltersState[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleProvinceChange = (province: string) => {
    onChange({
      ...filters,
      province,
      city: "",
    });
  };

  const handleReset = () => {
    onChange({
      search: "",
      province: "",
      city: "",
      jobInterest: "",
      dutyStatus: "",
      workExperience: "all",
      sort: "newest",
    });
  };

  const handleSort = () => {
    setFilter("sort", filters.sort === "newest" ? "oldest" : "newest");
  };

  const selectClassName =
    "border-border bg-background text-foreground focus:border-custom-primary focus:ring-custom-primary/10 h-11 w-full min-w-0 cursor-pointer rounded-lg border px-3 text-[13px] outline-none transition-[border-color,box-shadow] duration-300 focus:ring-2";

  const inputClassName =
    "border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 h-11 w-full min-w-0 rounded-lg border px-3 text-[13px] outline-none transition-[border-color,box-shadow] duration-300 focus:ring-2";

  return (
    <div className="border-border bg-card shrink-0 border-b p-4 2xl:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            strokeWidth={1.8}
            className="text-muted-foreground pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2"
          />

          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`${inputClassName} ps-10`}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            size="lg"
            onClick={handleSort}
            leftSection={<ArrowDownUp size={17} strokeWidth={1.8} />}
            className="h-11 shrink-0 px-4 text-[13px]"
          >
            {filters.sort === "newest" ? t("newestFirst") : t("oldestFirst")}
          </CustomButton>

          <button
            type="button"
            onClick={handleReset}
            className="bg-custom-primary text-primary-foreground inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-opacity duration-300 hover:opacity-90"
          >
            <RotateCcw size={15} strokeWidth={1.8} />
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="mt-3 grid min-w-0 grid-cols-5 gap-3">
        <div className="min-w-0">
          <label
            htmlFor="hire-resume-province"
            className="text-muted-foreground mb-1.5 block text-xs"
          >
            {t("province")}
          </label>

          <select
            id="hire-resume-province"
            value={filters.province}
            onChange={(event) => handleProvinceChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">{t("allProvinces")}</option>

            {provinces.map((province) => (
              <option key={province} value={province}>
                {getProvinceLabel(province, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="hire-resume-city"
            className="text-muted-foreground mb-1.5 block text-xs"
          >
            {t("city")}
          </label>

          <select
            id="hire-resume-city"
            value={filters.city}
            disabled={!filters.province}
            onChange={(event) => setFilter("city", event.target.value)}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="">
              {filters.province ? t("allCities") : t("selectProvinceFirst")}
            </option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {getCityLabel(filters.province, city, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="hire-resume-duty-status"
            className="text-muted-foreground mb-1.5 block text-xs"
          >
            {t("dutyStatus")}
          </label>

          <select
            id="hire-resume-duty-status"
            value={filters.dutyStatus}
            onChange={(event) => setFilter("dutyStatus", event.target.value)}
            className={selectClassName}
          >
            <option value="">{t("allDutyStatuses")}</option>

            {dutyStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {isFa ? option.fa : option.en}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="hire-resume-work-experience"
            className="text-muted-foreground mb-1.5 block text-xs"
          >
            {t("workExperience")}
          </label>

          <select
            id="hire-resume-work-experience"
            value={filters.workExperience}
            onChange={(event) =>
              setFilter(
                "workExperience",
                event.target.value as HireResumeWorkFilter,
              )
            }
            className={selectClassName}
          >
            <option value="all">{t("allWorkExperiences")}</option>

            <option value="hasWork">{t("hasWork")}</option>

            <option value="noWork">{t("noWork")}</option>
          </select>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="hire-resume-job-interest"
            className="text-muted-foreground mb-1.5 block text-xs"
          >
            {t("jobInterest")}
          </label>

          <input
            id="hire-resume-job-interest"
            type="search"
            value={filters.jobInterest}
            onChange={(event) => setFilter("jobInterest", event.target.value)}
            placeholder={t("jobInterestPlaceholder")}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
};

export default HireResumeFilters;
