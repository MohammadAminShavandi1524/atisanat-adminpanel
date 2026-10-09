"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import ResumeQuestionForm from "@/components/addResumeQuestion/forms/ResumeQuestionForm";

const Page = () => {
  const t = useTranslations("addResumeQuestion");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ResumeQuestionForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
