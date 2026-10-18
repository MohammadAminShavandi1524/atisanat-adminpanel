"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  CircleHelp,
  Handshake,
  Mail,
  Package,
  Table2,
  Tags,
  Wrench,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import DashboardStatCard from "./DashboardStatCard";

import { getDashboardStats, type DashboardStats } from "./dashboard.api";

interface DashboardItem {
  key: keyof DashboardStats;
  title: string;
  href: string;
  addHref?: string;
  icon: LucideIcon;
}

const initialStats: DashboardStats = {
  contactMessages: null,
  hireResumes: null,
  cooperationRequests: null,
  productCategories: null,
  products: null,
  machiningChallenges: null,
  standardTableParents: null,
  standardTables: null,
  faqs: null,
};

const DashboardPage = () => {
  const locale = useLocale();

  const t = useTranslations("Dashboard");

  const [stats, setStats] = useState<DashboardStats>(initialStats);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        if (active) {
          setStats(data);
        }
      } catch (error) {
        console.error("GET DASHBOARD STATS ERROR:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const items = useMemo<DashboardItem[]>(
    () => [
      {
        key: "contactMessages",
        title: t("cards.contactMessages"),
        href: `/${locale}/contact-messages`,
        icon: Mail,
      },
      {
        key: "hireResumes",
        title: t("cards.hireResumes"),
        href: `/${locale}/hire-resumes`,
        icon: BriefcaseBusiness,
      },
      {
        key: "cooperationRequests",
        title: t("cards.cooperationRequests"),
        href: `/${locale}/cooperation-requests`,
        icon: Handshake,
      },
      {
        key: "productCategories",
        title: t("cards.productCategories"),
        href: `/${locale}/products/categories`,
        addHref: `/${locale}/products/add-category`,
        icon: Tags,
      },
      {
        key: "products",
        title: t("cards.products"),
        href: `/${locale}/products`,
        addHref: `/${locale}/products/add-product`,
        icon: Package,
      },
      {
        key: "machiningChallenges",
        title: t("cards.machiningChallenges"),
        href: `/${locale}/news`,
        addHref: `/${locale}/add-news`,
        icon: Wrench,
      },
      {
        key: "standardTableParents",
        title: t("cards.standardTableParents"),
        href: `/${locale}/standard-tables`,
        addHref: `/${locale}/standard-tables/add-parent`,
        icon: FolderOpen,
      },
      {
        key: "standardTables",
        title: t("cards.standardTables"),
        href: `/${locale}/standard-tables`,
        addHref: `/${locale}/standard-tables/add-child`,
        icon: Table2,
      },
      {
        key: "faqs",
        title: t("cards.faqs"),
        href: `/${locale}/faq`,
        addHref: `/${locale}/add-faq`,
        icon: CircleHelp,
      },
    ],
    [locale, t],
  );

  return (
    <section className="min-w-0">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-foreground text-[17px] font-semibold">
            {t("stats.title")}
          </h2>

          <p className="text-muted-foreground mt-1 text-[13px]">
            {t("stats.description")}
          </p>
        </div>

        {loading && (
          <span
            aria-label={t("loading")}
            className="border-custom-primary size-5 shrink-0 animate-spin rounded-full border-2 border-t-transparent"
          />
        )}
      </div>

      <div className="grid min-w-0 grid-cols-3 gap-4">
        {items.map((item) => (
          <DashboardStatCard
            key={item.key}
            title={item.title}
            count={stats[item.key]}
            href={item.href}
            addHref={item.addHref}
            icon={item.icon}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
