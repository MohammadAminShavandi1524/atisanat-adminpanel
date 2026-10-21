"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import FaqForm from "@/components/addFaq/forms/FaqForm";

const Page = () => {
  const t = useTranslations("addFaq");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-3 py-3 xl:px-5 xl:py-5 2xl:px-6 3xl:px-8 3xl:py-6">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <FaqForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
