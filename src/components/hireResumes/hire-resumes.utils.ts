import type { HireResume, HireResumeFiltersState } from "./hire-resumes.types";

export type HireResumeLocale = "fa" | "en";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

const emptyLabels: Record<HireResumeLocale, string> = {
  fa: "ثبت نشده",
  en: "Not provided",
};

const booleanLabels: Record<HireResumeLocale, { yes: string; no: string }> = {
  fa: {
    yes: "بله",
    no: "خیر",
  },
  en: {
    yes: "Yes",
    no: "No",
  },
};

const dutyStatusLabels: Record<string, Record<HireResumeLocale, string>> = {
  served: {
    fa: "دارای کارت پایان خدمت",
    en: "Completed Military Service",
  },
  not_served: {
    fa: "مشمول خدمت",
    en: "Subject to Military Service",
  },
  exempt: {
    fa: "معاف از خدمت",
    en: "Exempt from Military Service",
  },
};

const normalizeSearch = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .trim();
};

export const toPersianDigits = (value: string | number): string => {
  return String(value).replace(/\d/g, (digit) => {
    return persianDigits[Number(digit)];
  });
};

export const formatHireResumeValue = (
  value: string | number | null | undefined,
  locale: HireResumeLocale,
): string => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return emptyLabels[locale];
  }

  return locale === "fa" ? toPersianDigits(value) : String(value);
};

export const formatHireResumeBoolean = (
  value: boolean | null | undefined,
  locale: HireResumeLocale,
): string => {
  if (typeof value !== "boolean") {
    return emptyLabels[locale];
  }

  return value ? booleanLabels[locale].yes : booleanLabels[locale].no;
};

export const formatHireResumeDutyStatus = (
  status: string | null | undefined,
  locale: HireResumeLocale,
): string => {
  if (!status) {
    return emptyLabels[locale];
  }

  return dutyStatusLabels[status]?.[locale] ?? status;
};

export const formatHireResumeDate = (
  value: string | null | undefined,
  locale: HireResumeLocale,
): string => {
  if (!value) {
    return emptyLabels[locale];
  }

  const datePart = value.slice(0, 10);

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

  if (!match) {
    return formatHireResumeValue(value, locale);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return formatHireResumeValue(value, locale);
  }

  return new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    },
  ).format(date);
};

export const formatHireResumeMoney = (
  value: string | number | null | undefined,
  locale: HireResumeLocale,
): string => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return emptyLabels[locale];
  }

  const normalized = String(value).replace(/,/g, "").trim();

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return formatHireResumeValue(value, locale);
  }

  const number = Number(normalized);

  if (!Number.isFinite(number)) {
    return formatHireResumeValue(value, locale);
  }

  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
    number,
  );
};

export const getHireResumeFullName = (
  resume: Pick<HireResume, "first_name" | "last_name">,
  locale: HireResumeLocale,
): string => {
  const fullName = [resume.first_name, resume.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || emptyLabels[locale];
};

export const hasHireResumeWorkExperience = (resume: HireResume): boolean => {
  return (
    Array.isArray(resume.work_experience) && resume.work_experience.length > 0
  );
};

export const getHireResumeArray = <T>(value: T[] | null | undefined): T[] => {
  return Array.isArray(value) ? value : [];
};

export const filterHireResumes = (
  resumes: HireResume[],
  filters: HireResumeFiltersState,
): HireResume[] => {
  const search = normalizeSearch(filters.search);
  const jobInterest = normalizeSearch(filters.jobInterest);

  return resumes
    .filter((resume) => {
      if (search) {
        const searchableValue = normalizeSearch(
          [
            resume.first_name,
            resume.last_name,
            `${resume.first_name ?? ""} ${resume.last_name ?? ""}`,
            resume.national_code,
            resume.phone_number,
          ].join(" "),
        );

        if (!searchableValue.includes(search)) {
          return false;
        }
      }

      if (filters.province && resume.province !== filters.province) {
        return false;
      }

      if (filters.city && resume.city !== filters.city) {
        return false;
      }

      if (
        jobInterest &&
        !normalizeSearch(resume.job_interest).includes(jobInterest)
      ) {
        return false;
      }

      if (filters.dutyStatus && resume.duty_status !== filters.dutyStatus) {
        return false;
      }

      const hasWork = hasHireResumeWorkExperience(resume);

      if (filters.workExperience === "hasWork" && !hasWork) {
        return false;
      }

      if (filters.workExperience === "noWork" && hasWork) {
        return false;
      }

      return true;
    })
    .sort((a, b) => (filters.sort === "newest" ? b.id - a.id : a.id - b.id));
};
