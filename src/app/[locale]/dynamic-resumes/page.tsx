"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getDynamicResumeAnswers,
  type DynamicResumeSubmission,
} from "@/components/dynamicResumes/dynamicResumes.api";

import DynamicResumeRow from "@/components/dynamicResumes/DynamicResumeRow";

gsap.registerPlugin(useGSAP);

export default function DynamicResumesPage() {
  const t = useTranslations("dynamicResumes");
  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [submissions, setSubmissions] = useState<DynamicResumeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = useCallback(async () => {
    const data = await getDynamicResumeAnswers();

    setSubmissions(
      [...data].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      ),
    );
  }, []);

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        await fetchAnswers();
      } catch (error) {
        console.error("GET DYNAMIC RESUME ANSWERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadAnswers();
  }, [fetchAnswers]);

  useGSAP(
    () => {
      if (!pageRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        ".dynamic-resumes-panel",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".dynamic-resumes-header",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.15,
          ease: "power3.out",
        },
      );
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <section className="dynamic-resumes-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
          <div className="dynamic-resumes-header border-border bg-card-secondary flex shrink-0 items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-foreground text-sm font-semibold">
                {t("list.title")}
              </h2>

              <p className="text-muted-foreground mt-1 text-xs">
                {t("list.count", {
                  count: submissions.length,
                })}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                <span className="text-muted-foreground text-sm">
                  {t("loading")}
                </span>
              </div>
            </div>
          ) : submissions.length > 0 ? (
            <ScrollArea
              dir={locale === "fa" ? "rtl" : "ltr"}
              className="min-h-0 flex-1"
              scrollBarClassName="me-1.75"
              data-lenis-prevent-wheel
            >
              <div className="space-y-4 p-4 sm:p-5">
                {submissions.map((submission, index) => (
                  <DynamicResumeRow
                    key={submission.id}
                    submission={submission}
                    refreshAnswers={fetchAnswers}
                    animationIndex={index}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <ClipboardList
                size={26}
                strokeWidth={1.7}
                className="text-muted-foreground"
              />

              <h3 className="text-foreground mt-4 text-base font-semibold">
                {t("empty.title")}
              </h3>

              <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-6">
                {t("empty.description")}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
