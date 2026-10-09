"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ListOrdered } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getResumeQuestions,
  type ResumeQuestion,
} from "@/components/resumeQuestions/resumeQuestions.api";

import ResumeQuestionRow from "@/components/resumeQuestions/ResumeQuestionRow";

gsap.registerPlugin(useGSAP);

export default function ResumeQuestionsPage() {
  const t = useTranslations("resumeQuestions");
  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [questions, setQuestions] = useState<ResumeQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    const data = await getResumeQuestions();

    setQuestions([...data].sort((a, b) => a.index - b.index));
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await fetchQuestions();
      } catch (error) {
        console.error("GET RESUME QUESTIONS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadQuestions();
  }, []);

  useGSAP(
    () => {
      if (!pageRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        ".resume-questions-panel",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".resume-questions-header",
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
        <section className="resume-questions-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Horizontal overflow on narrower screens */}
            <div className="min-h-0 flex-1 overflow-x-auto">
              <div className="flex h-full min-w-[900px] flex-col">
                {/* Table Header */}
                <div className="resume-questions-header border-border bg-card-secondary shrink-0 border-b px-5 ps-9 pe-11">
                  <div className="text-muted-foreground grid h-13 grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_300px] items-center gap-5 text-sm font-medium">
                    <div>{t("table.index")}</div>
                    <div>{t("table.questionFa")}</div>
                    <div>{t("table.questionEn")}</div>
                    <div className="text-center">{t("table.actions")}</div>
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
                ) : questions.length > 0 ? (
                  <ScrollArea
                    dir={locale === "fa" ? "rtl" : "ltr"}
                    className="min-h-0 flex-1"
                    scrollBarClassName="me-1.75"
                    data-lenis-prevent-wheel
                  >
                    <div className="space-y-2.5 p-4 pe-6">
                      {questions.map((question, index) => (
                        <ResumeQuestionRow
                          key={question.id}
                          question={question}
                          refreshQuestions={fetchQuestions}
                          animationIndex={index}
                          isFirst={index === 0}
                          isLast={index === questions.length - 1}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <ListOrdered
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
