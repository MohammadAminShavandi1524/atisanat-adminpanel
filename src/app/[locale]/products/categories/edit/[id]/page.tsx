import { getTranslations } from "next-intl/server";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditProductCategoryForm from "@/components/products/categories/edit/EditProductCategoryForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const t = await getTranslations("editProductCategory");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <EditProductCategoryForm categoryId={id} />
      </div>
    </div>
  );
};

export default Page;
