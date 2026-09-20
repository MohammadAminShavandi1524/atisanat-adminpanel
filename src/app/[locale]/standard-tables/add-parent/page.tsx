"use client";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import AddStandardTableParentForm from "@/components/standardTables/addParent/AddStandardTableParentForm";

const AddStandardTableParentPage = () => {
  const t = useTranslations("addStandardTableParent");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <AddStandardTableParentForm />
      </div>
    </div>
  );
};

export default AddStandardTableParentPage;
