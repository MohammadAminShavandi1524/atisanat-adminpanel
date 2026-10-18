"use client";

import { useTransition } from "react";

import { useParams } from "next/navigation";

import { Earth } from "lucide-react";

import { type Locale, useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  defaultLocale: Locale;
};

const LanguageSwitcher = ({ defaultLocale }: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  const [isPending, startTransition] = useTransition();

  const nextLocale = defaultLocale === "fa" ? "en" : "fa";

  const handleToggle = () => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error next-intl typed routes
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={`Switch language to ${nextLocale}`}
      className={cn(
        "group border-border bg-background relative flex h-10 cursor-pointer items-center gap-x-1.5 overflow-hidden rounded-lg border px-2 pe-2.5",
        "shadow-[0_2px_8px_rgba(32,43,58,0.05)]",
        "transition-all duration-300",
        "hover:border-custom-primary/50 hover:bg-secondary-bg hover:shadow-[0_6px_18px_rgba(20,88,150,0.10)]",
        "active:scale-[0.97]",
        "xl:h-11 xl:gap-x-2 xl:px-2.5 xl:pe-3",
        "2xl:h-12 2xl:gap-x-2.5 2xl:px-3 2xl:pe-4",
        isPending && "pointer-events-none opacity-50",
      )}
    >
      <span className="border-border bg-secondary-bg group-hover:border-custom-primary/30 group-hover:bg-custom-primary/10 flex size-7 items-center justify-center rounded-md border transition-all duration-300 xl:size-7.5 2xl:size-8">
        <Earth
          className="text-foreground/70 group-hover:text-custom-primary size-[17px] transition-colors duration-300 xl:size-[19px] 2xl:size-5"
          strokeWidth={1.7}
        />
      </span>

      <span className="text-foreground group-hover:text-custom-primary text-[12px] font-semibold tracking-[0.04em] uppercase transition-colors duration-300 xl:text-[14px] 2xl:text-[16px]">
        {locale === "fa" ? "EN" : "FA"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
