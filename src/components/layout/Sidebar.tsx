
"use client";

import {
  BriefcaseBusiness,
  CircleHelp,
  FilePlus2,
  FolderPlus,
  Handshake,
  LayoutDashboard,
  Mail,
  Package,
  PackagePlus,
  Plus,
  Table2,
  Tags,
  Wrench,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";

import SidebarItem from "./SidebarItem";
import SideBarItemHeader from "./SideBarItemHeader";

const Sidebar = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  if (pathname === `/${locale}/login`) {
    return null;
  }

  return (
    <aside className="border-border-secondary bg-background flex h-screen w-[235px] shrink-0 flex-col border-e pb-3 xl:w-[255px] xl:pb-3.5 2xl:w-[270px] 3xl:w-[285px] 3xl:pb-4">
      {/* Header */}
      <div className="shrink-0 px-3 xl:px-3.5 3xl:px-4">
        <div className="border-border-secondary flex min-h-[70px] items-center border-b px-2 xl:min-h-[74px] 3xl:min-h-[78px]">
          <div className="flex min-w-0 flex-col">
            <div className="text-foreground truncate text-[17px] font-semibold xl:text-[18px] 2xl:text-[19px] 3xl:text-[20px]">
              {t("logoTitle")}
            </div>

            <div className="text-muted-foreground mt-0 truncate text-[13px] xl:text-[14px] 2xl:text-[15px] 3xl:text-[16px]">
              {t("logoSubtitle")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea
        data-lenis-prevent
        dir={locale === "fa" ? "rtl" : "ltr"}
        className="min-h-0 flex-1"
        scrollBarClassName="me-1"
      >
        <nav className="flex flex-col gap-y-2.5 px-3 pt-2.5 xl:gap-y-3 xl:px-3.5 3xl:px-4 3xl:pt-3">
          {/* Overview */}
          <div>
            <SideBarItemHeader label={t("overview")} />

            <SidebarItem
              href={`/${locale}`}
              title={t("dashboard")}
              icon={LayoutDashboard}
              active={pathname === `/${locale}`}
            />
          </div>

          {/* Requests */}
          <div>
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

          {/* Products */}
          <div>
            <SideBarItemHeader label={t("productsSection")} />

            <SidebarItem
              href={`/${locale}/products/categories`}
              title={t("productCategories")}
              icon={Tags}
              active={pathname.startsWith(`/${locale}/products/categories`)}
            />

            <SidebarItem
              href={`/${locale}/products/add-category`}
              title={t("addProductCategory")}
              icon={FolderPlus}
              active={pathname === `/${locale}/products/add-category`}
            />

            <SidebarItem
              href={`/${locale}/products`}
              title={t("products")}
              icon={Package}
              active={pathname === `/${locale}/products`}
            />

            <SidebarItem
              href={`/${locale}/products/add-product`}
              title={t("addProduct")}
              icon={PackagePlus}
              active={pathname.startsWith(`/${locale}/products/add-product`)}
            />
          </div>

          {/* Standard Tables */}
          <div>
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
          <div>
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
          <div>
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
