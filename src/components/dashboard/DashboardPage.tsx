"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  BriefcaseBusiness,
  CircleHelp,
  FolderOpen,
  Handshake,
  Mail,
  Package,
  Table2,
  Tags,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import DashboardStatCard from "./DashboardStatCard";

import { getDashboardStats, type DashboardStats } from "./dashboard.api";

import { useDashboardAnimation } from "./useDashboardAnimation";

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

  const dashboardRef = useRef<HTMLElement>(null);

  const [stats, setStats] = useState<DashboardStats>(initialStats);

  const [loading, setLoading] = useState(true);

  useDashboardAnimation(dashboardRef, locale);

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
    <section ref={dashboardRef} className="min-w-0">
      {/* Dashboard Heading */}
      {/* <div className="dashboard-heading 3xl:mb-5 3xl:gap-4 mb-3 flex items-center justify-between gap-3 2xl:mb-4">
        <div className="min-w-0">
          <h2 className="text-foreground 3xl:text-[17px] text-[14px] font-semibold xl:text-[15px] 2xl:text-[16px]">
            {t("stats.title")}
          </h2>

          <p className="text-muted-foreground 3xl:text-[13px] mt-1 text-[11px] xl:text-[12px]">
            {t("stats.description")}
          </p>
        </div>

        {loading && (
          <span
            aria-label={t("loading")}
            className="border-custom-primary size-5 shrink-0 animate-spin rounded-full border-2 border-t-transparent"
          />
        )}
      </div> */}

      {/* Statistics Cards */}
      <div className="3xl:gap-4 grid min-w-0 grid-cols-3 gap-2.5 2xl:gap-3">
        {items.map((item) => (
          <div key={item.key} className="dashboard-stat-item min-w-0">
            <DashboardStatCard
              title={item.title}
              count={stats[item.key]}
              href={item.href}
              addHref={item.addHref}
              icon={item.icon}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
