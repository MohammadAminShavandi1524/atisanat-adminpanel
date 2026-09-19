"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditFaqForm from "./EditFaqForm";

interface EditFaqPageProps {
  faqId: string;
}

const EditFaqPage = ({ faqId }: EditFaqPageProps) => {
  const t = useTranslations("editFaq");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <EditFaqForm faqId={faqId} />
        </div>
      </div>
    </div>
  );
};

export default EditFaqPage;
