"use client";

import Link from "next/link";

import { ArrowUpRight, Plus, type LucideIcon } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

interface DashboardStatCardProps {
  title: string;
  count: number | null;
  href: string;
  addHref?: string;
  icon: LucideIcon;
  loading?: boolean;
}

const DashboardStatCard = ({
  title,
  count,
  href,
  addHref,
  icon: Icon,
  loading = false,
}: DashboardStatCardProps) => {
  const locale = useLocale();

  const t = useTranslations("Dashboard");

  const formattedCount =
    count === null
      ? "—"
      : new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
          count,
        );

  return (
    <article className="group/card border-border bg-background hover:border-border-secondary hover:bg-card-secondary/30 relative flex min-h-[180px] min-w-0 flex-col overflow-hidden rounded-lg border transition-[background-color,border-color] duration-300">
      <span className="bg-custom-primary pointer-events-none absolute inset-y-0 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/card:scale-y-100" />

      <Link
        href={href}
        className="flex min-h-0 min-w-0 flex-1 flex-col px-5 pt-5 pb-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="border-border bg-card-secondary flex size-11 shrink-0 items-center justify-center rounded-lg border">
            <Icon size={21} strokeWidth={1.7} className="text-custom-primary" />
          </div>

          <ArrowUpRight
            size={18}
            strokeWidth={1.7}
            className="text-muted-foreground group-hover/card:text-custom-primary shrink-0 transition-colors duration-300"
          />
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <h3 className="text-foreground min-w-0 text-[14px] leading-6 font-medium">
            {title}
          </h3>

          {loading ? (
            <span className="bg-card-secondary h-8 w-12 shrink-0 animate-pulse rounded-md" />
          ) : (
            <span className="text-foreground shrink-0 text-[27px] leading-none font-semibold">
              {formattedCount}
            </span>
          )}
        </div>
      </Link>

      <div className="border-border flex items-center justify-between gap-3 border-t px-5 py-3">
        <Link
          href={href}
          className="text-muted-foreground hover:text-custom-primary flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-300"
        >
          {t("actions.view")}

          <ArrowUpRight size={14} strokeWidth={1.7} />
        </Link>

        {addHref ? (
          <Link
            href={addHref}
            className="border-border bg-card-secondary text-foreground hover:border-custom-primary/50 hover:text-custom-primary flex h-8 items-center gap-1.5 rounded-md border px-3 text-[12px] font-medium transition-[color,border-color] duration-300"
          >
            <Plus size={14} strokeWidth={1.8} />

            {t("actions.add")}
          </Link>
        ) : (
          <span className="text-muted-foreground text-[11px]">
            {t("actions.viewOnly")}
          </span>
        )}
      </div>
    </article>
  );
};

export default DashboardStatCard;
