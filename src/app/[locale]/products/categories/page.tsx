import { getTranslations } from "next-intl/server";

import HeaderLayout from "@/components/layout/HeaderLayout";

import ProductCategoriesTable from "@/components/products/categories/ProductCategoriesTable";

const Page = async () => {
  const t = await getTranslations("productCategories");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <ProductCategoriesTable />
      </div>
    </div>
  );
};

export default Page;
