"use client";

import { ReactNode } from "react";

interface MobileSidebarBodyProps {
  children: ReactNode;
}

export function MobileSidebarBody({
  children,
}: MobileSidebarBodyProps) {
  return (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5"
    >
      {children}
    </div>
  );
}