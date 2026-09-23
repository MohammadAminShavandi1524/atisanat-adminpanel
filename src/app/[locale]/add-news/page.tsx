"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import AnimatedForm from "@/components/addNews/AnimatedForm";

import RootNewsForm from "@/components/addNews/forms/RootNewsForm";

import { Tab } from "@/components/addNews/Tab";

import CategoryForm from "@/components/addNews/forms/CategoryForm";

import ParentNewsForm from "@/components/addNews/forms/ParentNewsForm";

import NewsForm from "@/components/addNews/forms/NewsForm";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

const Page = () => {
  const tHeader = useTranslations("addNews.header");

  const [current, setCurrent] = useState<NewsTab>("category");

  const [previous, setPrevious] = useState<NewsTab>("category");

  const tabOrder: Record<NewsTab, number> = {
    category: 0,
    rootNews: 1,
    parentNews: 2,
    news: 3,
  };

  const direction = tabOrder[current] > tabOrder[previous] ? 1 : -1;

  const handleTabChange = (value: NewsTab) => {
    if (value === current) return;

    setPrevious(current);

    setCurrent(value);
  };

  const renderForm = () => {
    switch (current) {
      case "category":
        return <CategoryForm />;

      case "rootNews":
        return <RootNewsForm />;

      case "parentNews":
        return <ParentNewsForm />;

      case "news":
        return <NewsForm />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={tHeader(`${current}.title`)}
        descrption={tHeader(`${current}.description`)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6 3xl:px-8 3xl:py-6">
        {/* Tabs */}
        <div className="shrink-0">
          <div className="bg-secondary-bg border-border flex w-fit items-center gap-1 rounded-2xl border p-1.5">
            <Tab
              label="category"
              current={current}
              setCurrent={handleTabChange}
            />

            <Tab
              label="rootNews"
              current={current}
              setCurrent={handleTabChange}
            />

            <Tab
              label="parentNews"
              current={current}
              setCurrent={handleTabChange}
            />

            <Tab
              label="news"
              current={current}
              setCurrent={handleTabChange}
            />
          </div>
        </div>

        {/* Form */}
        <div className=" flex min-h-0 flex-1 flex-col overflow-hidden   ">
          <AnimatedForm formKey={current} direction={direction}>
            {renderForm()}
          </AnimatedForm>
        </div>
      </div>
    </div>
  );
};

export default Page;
