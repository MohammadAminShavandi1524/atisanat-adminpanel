"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {
  const pathname = usePathname();
  const locale = useLocale();

  if (pathname === `/${locale}/login`) {
    return null;
  }
  return <div className="min-w-75">Sidebar</div>;
};

export default Sidebar;
