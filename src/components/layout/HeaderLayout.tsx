"use client";

import { useRef } from "react";

import { LogOut } from "lucide-react";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { CustomButton } from "../ui/custom-button";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeButton } from "../theme/ThemeButton";

import { useHeaderLayoutAnimation } from "./useHeaderLayoutAnimation";

interface HeaderLayoutProps {
  title: string;
  descrption: string;
  className?: string;
}

export const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

const HeaderLayout = ({ title, descrption, className }: HeaderLayoutProps) => {
  const locale = useLocale();
  const router = useRouter();

  const headerRef = useRef<HTMLDivElement>(null);

  useHeaderLayoutAnimation(headerRef, locale);

  const handleLogout = async () => {
    await logout();

    router.replace(`/${locale}/login`);
    router.refresh();
  };

  return (
    <div
      ref={headerRef}
      className={cn(
        "border-b-border-secondary flex shrink-0 items-center justify-between border-b",
        "gap-3 px-4 py-4",
        "xl:gap-4 xl:px-5 xl:py-5",
        "2xl:px-6",
        "3xl:px-8 3xl:py-6",
        className,
      )}
    >
      {/* Page Info */}
      <div className="3xl:pe-6 min-w-0 pe-3 xl:pe-4">
        <h1 className="header-title 3xl:text-[26px] mb-1.5 text-[19px] leading-tight font-semibold xl:mb-2 xl:text-[22px] 2xl:text-[24px]">
          {title}
        </h1>

        <p className="header-description text-muted-foreground 3xl:text-lg text-[13px] leading-5 xl:text-base xl:leading-normal 2xl:text-[17px]">
          {descrption}
        </p>
      </div>

      {/* Controls */}
      <div className="3xl:pe-4 flex shrink-0 items-center gap-x-1.5 pe-0 2xl:gap-x-2">
        <div className="header-control">
          <ThemeButton />
        </div>

        <div className="header-control">
          <LanguageSwitcher defaultLocale={locale} />
        </div>

        <div className="header-control">
          <CustomButton
            intent="primary"
            variant="solid"
            size="lg"
            leftSection={
              <LogOut className="3xl:size-5 size-4 transition-transform duration-300 group-hover:-translate-x-0.5 xl:size-4.5 rtl:group-hover:translate-x-0.5" />
            }
            onClick={handleLogout}
            className="group 3xl:h-13 3xl:px-5 3xl:text-[15px] h-10 px-3 text-[12px] xl:h-11 xl:px-4 xl:text-sm 2xl:h-12"
          >
            {locale === "en" ? "Log out" : "خروج"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
