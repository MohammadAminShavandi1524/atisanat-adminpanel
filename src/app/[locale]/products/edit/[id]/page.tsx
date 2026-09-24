import { getTranslations } from "next-intl/server";

import HeaderLayout from "@/components/layout/HeaderLayout";

import EditProductForm from "@/components/products/edit-product/EditProductForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const t = await getTranslations("editProduct");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6 3xl:px-8 3xl:py-6">
        <EditProductForm productId={id} />
      </div>
    </div>
  );
};

export default Page;
