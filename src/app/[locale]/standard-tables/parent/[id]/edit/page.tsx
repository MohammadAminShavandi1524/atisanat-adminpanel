"use client";

import { use } from "react";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditStandardTableParentForm from "@/components/standardTables/editParent/EditStandardTableParentForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditStandardTableParentPage = ({
  params,
}: PageProps) => {
  const { id } = use(params);

  const t = useTranslations(
    "editStandardTableParent",
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t(
          "header.description",
        )}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <EditStandardTableParentForm
          parentId={id}
        />
      </div>
    </div>
  );
};

export default EditStandardTableParentPage;