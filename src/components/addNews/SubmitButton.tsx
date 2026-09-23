"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton } from "../ui/custom-button";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

interface SubmitButtonProps {
  current: NewsTab;
  disabled?: boolean;
  className?: string;
}

const SubmitButton = ({
  current,
  disabled = false,
  className,
}: SubmitButtonProps) => {
  const t = useTranslations("addNews.submitButton");

  return (
    <CustomButton
      type="submit"
      intent="primary"
      variant="solid"
      disabled={disabled}
      className={cn(
        "3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {t(current)}
    </CustomButton>
  );
};

export default SubmitButton;
