import { getTranslations } from "next-intl/server";

import HeaderLayout from "@/components/layout/HeaderLayout";

import AddProductCategoryForm from "@/components/products/add-category/AddProductCategoryForm";

const Page = async () => {
  const t = await getTranslations("addProductCategory");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6 3xl:px-8 3xl:py-6">
        <AddProductCategoryForm />
      </div>
    </div>
  );
};

export default Page;
