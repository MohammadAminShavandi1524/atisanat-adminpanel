"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import EditResumeQuestionForm from "@/components/editResumeQuestion/EditResumeQuestionForm";

export default function EditResumeQuestionPage() {
  const t = useTranslations("editResumeQuestion");
  const params = useParams<{ question_id: string }>();

  const questionId = Number(params.question_id);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("page.title")}
        descrption={t("page.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <EditResumeQuestionForm key={questionId} questionId={questionId} />
      </div>
    </div>
  );
}
