"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

interface TabProps {
  label: NewsTab;
  current: NewsTab;
  setCurrent: (value: NewsTab) => void;
  disabled?: boolean;
}

export const Tab = ({
  label,
  current,
  setCurrent,
  disabled = false,
}: TabProps) => {
  const t = useTranslations("addNews.tabs");

  const active = label === current;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setCurrent(label)}
      className={cn(
        "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
        active && "bg-custom-primary text-white",
        !active &&
          !disabled &&
          "text-muted-foreground hover:bg-secondary-bg hover:text-foreground",
        disabled && "text-muted-foreground/40 cursor-not-allowed",
      )}
    >
      {t(label)}
    </button>
  );
};
