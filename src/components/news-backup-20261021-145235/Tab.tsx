"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type NewsTabs =
  | "categories"
  | "news";

interface TabProps {
  label: NewsTabs;
  current: NewsTabs;
  setCurrent: (value: NewsTabs) => void;
}

export const Tab = ({
  label,
  current,
  setCurrent,
}: TabProps) => {
  const t = useTranslations("news.tabs");

  const active = label === current;

  return (
    <button
      type="button"
      onClick={() => setCurrent(label)}
      className={cn(
        "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
        active &&
          "bg-custom-primary text-white",
        !active &&
          "text-muted-foreground hover:bg-secondary-bg hover:text-foreground",
      )}
    >
      {t(label)}
    </button>
  );
};
