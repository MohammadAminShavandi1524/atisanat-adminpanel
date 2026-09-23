"use client";

import { useRef } from "react";

import {
  BriefcaseBusiness,
  CircleHelp,
  FilePlus2,
  FolderPlus,
  Handshake,
  LayoutDashboard,
  Mail,
  Plus,
  Table2,
  Wrench,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { usePathname } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

gsap.registerPlugin(useGSAP);

const Sidebar = () => {
  const locale = useLocale();
  const pathname = usePathname();

  const t = useTranslations("Sidebar");

  const sidebarRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sidebarRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        sidebarRef.current,
        {
          opacity: 0,
          x: locale === "fa" ? 18 : -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
        },
      );

      timeline.fromTo(
        ".sidebar-brand",
        {
          opacity: 0,
          y: -8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".sidebar-section",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
        },
        "-=0.2",
      );
    },
    {
      scope: sidebarRef,
      dependencies: [locale],
    },
  );

  if (pathname === `/${locale}/login`) {
    return null;
  }

  return (
    <aside
      ref={sidebarRef}
      className="border-border-secondary bg-background flex h-screen w-[285px] shrink-0 flex-col border-e pb-4"
    >
      {/* Header */}
      <div className="sidebar-brand shrink-0 px-4">
        <div className="border-border-secondary flex min-h-[78px] items-center border-b px-2">
          <div className="flex min-w-0 flex-col">
            <div className="text-foreground truncate text-[18px] font-semibold">
              {t("logoTitle")}
            </div>

            <div className="text-muted-foreground mt-1 truncate text-[13px]">
              {t("logoSubtitle")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea
        dir={locale === "fa" ? "rtl" : "ltr"}
        className="min-h-0 flex-1"
        scrollBarClassName="me-1"
      >
        <nav className="flex flex-col gap-y-4 px-4 pt-5">
          {/* Overview */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("overview")} />

            <SidebarItem
              href={`/${locale}`}
              title={t("dashboard")}
              icon={LayoutDashboard}
              active={pathname === `/${locale}`}
            />
          </div>

          {/* Requests */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("requestsSection")} />

            <SidebarItem
              href={`/${locale}/contact-messages`}
              title={t("contactMessages")}
              icon={Mail}
              active={pathname.startsWith(`/${locale}/contact-messages`)}
            />

            <SidebarItem
              href={`/${locale}/hire-resumes`}
              title={t("hireResumes")}
              icon={BriefcaseBusiness}
              active={pathname.startsWith(`/${locale}/hire-resumes`)}
            />

            <SidebarItem
              href={`/${locale}/cooperation-requests`}
              title={t("cooperationRequests")}
              icon={Handshake}
              active={pathname.startsWith(`/${locale}/cooperation-requests`)}
            />
          </div>

          {/* Standard Tables */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("standardTablesSection")} />

            <SidebarItem
              href={`/${locale}/standard-tables`}
              title={t("standardTables")}
              icon={Table2}
              active={pathname === `/${locale}/standard-tables`}
            />

            <SidebarItem
              href={`/${locale}/standard-tables/add-parent`}
              title={t("addStandardTableParent")}
              icon={FolderPlus}
              active={pathname === `/${locale}/standard-tables/add-parent`}
            />

            <SidebarItem
              href={`/${locale}/standard-tables/add-child`}
              title={t("addStandardTableChild")}
              icon={FilePlus2}
              active={pathname === `/${locale}/standard-tables/add-child`}
            />
          </div>

          {/* Machining Challenges */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("machiningChallengesSection")} />

            <SidebarItem
              href={`/${locale}/news`}
              title={t("machiningChallenges")}
              icon={Wrench}
              active={pathname.startsWith(`/${locale}/news`)}
            />

            <SidebarItem
              href={`/${locale}/add-news`}
              title={t("addMachiningChallenge")}
              icon={Plus}
              active={pathname.startsWith(`/${locale}/add-news`)}
            />
          </div>

          {/* FAQ */}
          <div className="sidebar-section">
            <SideBarItemHeader label={t("faqSection")} />

            <SidebarItem
              href={`/${locale}/faq`}
              title={t("faq")}
              icon={CircleHelp}
              active={pathname === `/${locale}/faq`}
            />

            <SidebarItem
              href={`/${locale}/add-faq`}
              title={t("addFaq")}
              icon={Plus}
              active={pathname === `/${locale}/add-faq`}
            />
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
