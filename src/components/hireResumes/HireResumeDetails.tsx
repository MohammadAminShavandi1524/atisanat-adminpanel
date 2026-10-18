"use client";

import type { ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import type { HireResume } from "./hire-resumes.types";

import { getCityLabel, getProvinceLabel } from "./data/iran-locations";

import {
  formatHireResumeBoolean,
  formatHireResumeDate,
  formatHireResumeDutyStatus,
  formatHireResumeMoney,
  formatHireResumeValue,
  getHireResumeArray,
  toPersianDigits,
  type HireResumeLocale,
} from "./hire-resumes.utils";

interface HireResumeDetailsProps {
  resume: HireResume;
}

interface DetailFieldProps {
  label: string;
  value: ReactNode;
  empty?: boolean;
  wide?: boolean;
}

interface DetailSectionProps {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
}

interface RepeatedSectionProps<T> {
  title: string;
  items: T[];
  itemLabel: string;
  emptyLabel: string;
  locale: HireResumeLocale;
  fullWidth?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
}

const selectLabels: Record<string, { fa: string; en: string }> = {
  islam: {
    fa: "اسلام",
    en: "Islam",
  },
  christianity: {
    fa: "مسیحیت",
    en: "Christianity",
  },
  judaism: {
    fa: "یهودیت",
    en: "Judaism",
  },
  zoroastrianism: {
    fa: "زرتشتی",
    en: "Zoroastrianism",
  },
  shia: {
    fa: "شیعه",
    en: "Shia",
  },
  sunni: {
    fa: "سنی",
    en: "Sunni",
  },
  child: {
    fa: "فرزند",
    en: "Child",
  },
  spouse: {
    fa: "همسر",
    en: "Spouse",
  },
  father: {
    fa: "پدر",
    en: "Father",
  },
  mother: {
    fa: "مادر",
    en: "Mother",
  },
  brother: {
    fa: "برادر",
    en: "Brother",
  },
  sister: {
    fa: "خواهر",
    en: "Sister",
  },
  beginner: {
    fa: "مبتدی",
    en: "Beginner",
  },
  basic: {
    fa: "پایه",
    en: "Basic",
  },
  intermediate: {
    fa: "متوسط",
    en: "Intermediate",
  },
  advanced: {
    fa: "پیشرفته",
    en: "Advanced",
  },
  fluent: {
    fa: "روان",
    en: "Fluent",
  },
  native: {
    fa: "زبان مادری",
    en: "Native",
  },
};

const DetailField = ({
  label,
  value,
  empty = false,
  wide = false,
}: DetailFieldProps) => {
  return (
    <div className={`min-w-0 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-muted-foreground mb-1.5 text-[12px] leading-5">
        {label}
      </dt>

      <dd
        className={`m-0 text-[13px] leading-7 wrap-break-word whitespace-pre-wrap ${
          empty
            ? "text-muted-foreground font-normal"
            : "text-foreground font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
};

const DetailSection = ({
  title,
  children,
  fullWidth = false,
}: DetailSectionProps) => {
  return (
    <section
      className={`border-border bg-background min-w-0 overflow-hidden rounded-xl border ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="border-border bg-card-secondary border-b px-5 py-3.5">
        <h3 className="text-foreground text-[14px] font-semibold">{title}</h3>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5">{children}</dl>
    </section>
  );
};

const RepeatedSection = <T,>({
  title,
  items,
  itemLabel,
  emptyLabel,
  locale,
  fullWidth = false,
  renderItem,
}: RepeatedSectionProps<T>) => {
  const formatIndex = (value: number) =>
    locale === "fa" ? toPersianDigits(value) : value;

  return (
    <section
      className={`border-border bg-background min-w-0 overflow-hidden rounded-xl border ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="border-border bg-card-secondary flex items-center justify-between gap-4 border-b px-5 py-3.5">
        <h3 className="text-foreground text-[14px] font-semibold">{title}</h3>

        <span className="border-border bg-background text-muted-foreground inline-flex min-w-7 items-center justify-center rounded-md border px-2 py-1 text-xs">
          {formatIndex(items.length)}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground px-5 py-6 text-[13px] leading-6">
          {emptyLabel}
        </p>
      ) : (
        <div className="divide-border divide-y">
          {items.map((item, index) => (
            <div key={index} className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="bg-custom-primary/10 text-custom-primary inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold">
                  {formatIndex(index + 1)}
                </span>

                <h4 className="text-foreground text-[13px] font-semibold">
                  {itemLabel}
                </h4>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                {renderItem(item, index)}
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const HireResumeDetails = ({ resume }: HireResumeDetailsProps) => {
  const currentLocale = useLocale();

  const locale: HireResumeLocale = currentLocale === "fa" ? "fa" : "en";

  const t = useTranslations("HireResumes.details");

  const text = (value: string | number | null | undefined) =>
    formatHireResumeValue(value, locale);

  const isEmpty = (value: string | number | null | undefined) =>
    value === null || value === undefined || String(value).trim() === "";

  const boolean = (value: boolean | null | undefined) =>
    formatHireResumeBoolean(value, locale);

  const date = (value: string | null | undefined) =>
    formatHireResumeDate(value, locale);

  const money = (value: string | number | null | undefined) =>
    formatHireResumeMoney(value, locale);

  const selectValue = (value: string | null | undefined) => {
    if (isEmpty(value)) {
      return text(value);
    }

    const key = value!.trim().toLowerCase();

    return selectLabels[key]?.[locale] ?? text(value);
  };

  const emptyList = t("emptyList");

  const fullName = [resume.first_name, resume.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const imageUrl = resume.image?.trim();

  return (
    <div className="border-border bg-card-secondary/30 min-w-0 border-t p-5">
      <div className="grid grid-cols-2 items-start gap-4">
        {/* Personal information */}
        <DetailSection title={t("personal.title")}>
          <div className="col-span-2 mb-1 flex items-start gap-5">
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-[17px] leading-7 font-semibold wrap-break-word">
                {fullName || text(null)}
              </p>

              <p className="text-muted-foreground mt-1 text-[12px] leading-5">
                {t("personal.nationalCode")}
              </p>

              <p className="text-foreground mt-1 text-[14px] font-medium">
                {text(resume.national_code)}
              </p>
            </div>

            {imageUrl ? (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fullName || t("personal.title")}
                title={fullName || t("personal.title")}
                className="border-border bg-card-secondary hover:border-custom-primary/60 block w-[105px] shrink-0 overflow-hidden rounded-xl border p-1.5 transition-colors"
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={fullName || t("personal.title")}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              </a>
            ) : (
              <div className="border-border bg-card-secondary text-muted-foreground flex aspect-[3/4] w-[105px] shrink-0 items-center justify-center rounded-xl border px-3 text-center text-xs leading-5">
                {text(null)}
              </div>
            )}
          </div>

          <DetailField
            label={t("personal.firstName")}
            value={text(resume.first_name)}
            empty={isEmpty(resume.first_name)}
          />

          <DetailField
            label={t("personal.lastName")}
            value={text(resume.last_name)}
            empty={isEmpty(resume.last_name)}
          />

          <DetailField
            label={t("personal.fatherName")}
            value={text(resume.father_name)}
            empty={isEmpty(resume.father_name)}
          />

          <DetailField
            label={t("personal.placeOfIssue")}
            value={text(resume.place_of_issue)}
            empty={isEmpty(resume.place_of_issue)}
          />

          <DetailField
            label={t("personal.dateOfBirth")}
            value={date(resume.date_of_birth)}
            empty={isEmpty(resume.date_of_birth)}
          />

          <DetailField
            label={t("personal.religion")}
            value={selectValue(resume.religion)}
            empty={isEmpty(resume.religion)}
          />

          <DetailField
            label={t("personal.mazhab")}
            value={selectValue(resume.mazhab)}
            empty={isEmpty(resume.mazhab)}
          />

          <DetailField
            label={t("personal.married")}
            value={boolean(resume.married)}
            empty={resume.married == null}
          />

          <DetailField
            label={t("personal.children")}
            value={text(resume.children)}
            empty={isEmpty(resume.children)}
          />
        </DetailSection>

        {/* Contact information */}
        <DetailSection title={t("contact.title")}>
          <DetailField
            label={t("contact.province")}
            value={text(getProvinceLabel(resume.province, locale))}
            empty={isEmpty(resume.province)}
          />

          <DetailField
            label={t("contact.city")}
            value={text(getCityLabel(resume.province, resume.city, locale))}
            empty={isEmpty(resume.city)}
          />

          <DetailField
            label={t("contact.email")}
            value={
              resume.email?.trim() ? (
                <a
                  href={`mailto:${resume.email}`}
                  className="text-custom-primary hover:underline"
                >
                  {resume.email}
                </a>
              ) : (
                text(null)
              )
            }
            empty={isEmpty(resume.email)}
          />

          <DetailField
            label={t("contact.phone")}
            value={text(resume.phone_number)}
            empty={isEmpty(resume.phone_number)}
          />

          <DetailField
            label={t("contact.address")}
            value={text(resume.address)}
            empty={isEmpty(resume.address)}
            wide
          />
        </DetailSection>

        {/* Dependents */}
        <RepeatedSection
          title={t("dependents.title")}
          items={getHireResumeArray(resume.dependents)}
          itemLabel={t("dependents.item")}
          emptyLabel={emptyList}
          locale={locale}
          renderItem={(item) => (
            <>
              <DetailField
                label={t("dependents.name")}
                value={text(item.name)}
                empty={isEmpty(item.name)}
              />

              <DetailField
                label={t("dependents.relation")}
                value={selectValue(item.relation)}
                empty={isEmpty(item.relation)}
              />
            </>
          )}
        />

        {/* Education */}
        <RepeatedSection
          title={t("education.title")}
          items={getHireResumeArray(resume.education)}
          itemLabel={t("education.item")}
          emptyLabel={emptyList}
          locale={locale}
          renderItem={(item) => (
            <>
              <DetailField
                label={t("education.place")}
                value={text(item.place)}
                empty={isEmpty(item.place)}
              />

              <DetailField
                label={t("education.major")}
                value={text(item.major)}
                empty={isEmpty(item.major)}
              />

              <DetailField
                label={t("education.licence")}
                value={text(item.licence)}
                empty={isEmpty(item.licence)}
              />

              <DetailField
                label={t("education.start")}
                value={date(item.start)}
                empty={isEmpty(item.start)}
              />

              <DetailField
                label={t("education.end")}
                value={date(item.end)}
                empty={isEmpty(item.end)}
              />
            </>
          )}
        />

        {/* Languages */}
        <RepeatedSection
          title={t("languages.title")}
          items={getHireResumeArray(resume.languages)}
          itemLabel={t("languages.item")}
          emptyLabel={emptyList}
          locale={locale}
          renderItem={(item) => (
            <>
              <DetailField
                label={t("languages.language")}
                value={text(item.language)}
                empty={isEmpty(item.language)}
              />

              <DetailField
                label={t("languages.read")}
                value={selectValue(item.read)}
                empty={isEmpty(item.read)}
              />

              <DetailField
                label={t("languages.write")}
                value={selectValue(item.write)}
                empty={isEmpty(item.write)}
              />

              <DetailField
                label={t("languages.speak")}
                value={selectValue(item.speak)}
                empty={isEmpty(item.speak)}
              />
            </>
          )}
        />

        {/* Work experience */}
        <RepeatedSection
          title={t("work.title")}
          items={getHireResumeArray(resume.work_experience)}
          itemLabel={t("work.item")}
          emptyLabel={emptyList}
          locale={locale}
          renderItem={(item) => (
            <>
              <DetailField
                label={t("work.place")}
                value={text(item.place)}
                empty={isEmpty(item.place)}
              />

              <DetailField
                label={t("work.job")}
                value={text(item.job)}
                empty={isEmpty(item.job)}
              />

              <DetailField
                label={t("work.start")}
                value={date(item.start)}
                empty={isEmpty(item.start)}
              />

              <DetailField
                label={t("work.end")}
                value={date(item.end)}
                empty={isEmpty(item.end)}
              />

              <DetailField
                label={t("work.salary")}
                value={money(item.salary)}
                empty={isEmpty(item.salary)}
              />

              <DetailField
                label={t("work.leaveReason")}
                value={text(item.leave_reasone)}
                empty={isEmpty(item.leave_reasone)}
                wide
              />
            </>
          )}
        />

        {/* Employment information */}
        <DetailSection title={t("employment.title")}>
          <DetailField
            label={t("employment.dutyStatus")}
            value={formatHireResumeDutyStatus(resume.duty_status, locale)}
            empty={isEmpty(resume.duty_status)}
          />

          <DetailField
            label={t("employment.offDutyReason")}
            value={text(resume.off_duty_reason)}
            empty={isEmpty(resume.off_duty_reason)}
          />

          <DetailField
            label={t("employment.criminalConviction")}
            value={boolean(resume.criminal_conviction)}
            empty={resume.criminal_conviction == null}
          />

          <DetailField
            label={t("employment.grantee")}
            value={boolean(resume.grantee)}
            empty={resume.grantee == null}
          />

          <DetailField
            label={t("employment.jobInterest")}
            value={text(resume.job_interest)}
            empty={isEmpty(resume.job_interest)}
            wide
          />

          <DetailField
            label={t("employment.introducer")}
            value={text(resume.introducer)}
            empty={isEmpty(resume.introducer)}
          />

          <DetailField
            label={t("employment.startWork")}
            value={date(resume.start_work)}
            empty={isEmpty(resume.start_work)}
          />

          <DetailField
            label={t("employment.salaryRequest")}
            value={money(resume.salary_request)}
            empty={isEmpty(resume.salary_request)}
          />

          <DetailField
            label={t("employment.anotherJob")}
            value={boolean(resume.another_job)}
            empty={resume.another_job == null}
          />

          <DetailField
            label={t("employment.askLastBoss")}
            value={boolean(resume.ask_last_boss)}
            empty={resume.ask_last_boss == null}
          />

          <DetailField
            label={t("employment.lastBossName")}
            value={text(resume.last_boss_name)}
            empty={isEmpty(resume.last_boss_name)}
          />

          <DetailField
            label={t("employment.lastBossPhone")}
            value={text(resume.last_boss_phone_number)}
            empty={isEmpty(resume.last_boss_phone_number)}
          />

          <DetailField
            label={t("employment.lastBossAddress")}
            value={text(resume.last_boss_address)}
            empty={isEmpty(resume.last_boss_address)}
            wide
          />

          <DetailField
            label={t("employment.physicalHealth")}
            value={text(resume.physical_health)}
            empty={isEmpty(resume.physical_health)}
            wide
          />
        </DetailSection>

        {/* Close contacts */}
        <RepeatedSection
          title={t("contacts.title")}
          items={getHireResumeArray(resume.close_people_contact)}
          itemLabel={t("contacts.item")}
          emptyLabel={emptyList}
          locale={locale}
          renderItem={(item) => (
            <>
              <DetailField
                label={t("contacts.name")}
                value={text(item.name)}
                empty={isEmpty(item.name)}
              />

              <DetailField
                label={t("contacts.number")}
                value={text(item.number)}
                empty={isEmpty(item.number)}
              />

              <DetailField
                label={t("contacts.address")}
                value={text(item.address)}
                empty={isEmpty(item.address)}
                wide
              />
            </>
          )}
        />

        {/* Additional information */}
        <DetailSection title={t("additional.title")} fullWidth>
          <DetailField
            label={t("additional.research")}
            value={text(resume.research)}
            empty={isEmpty(resume.research)}
            wide
          />

          <DetailField
            label={t("additional.extra")}
            value={text(resume.extra)}
            empty={isEmpty(resume.extra)}
            wide
          />
        </DetailSection>
      </div>
    </div>
  );
};

export default HireResumeDetails;
