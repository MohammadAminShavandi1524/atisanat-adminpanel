"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence } from "framer-motion";

import { getLenisInstance } from "@/lib/lenis-instance";

import { MobileSidebarContentProps } from "./mobile-sidebar.types";
import { MobileSidebarOverlay } from "./mobile-sidebar-overlay";
import { MobileSidebarPanel } from "./mobile-sidebar-panel";
import { useMobileSidebar } from "./use-mobile-sidebar";

export function MobileSidebarContent({
  children,
  width = 320,
  className,
  overlayClassName,
}: MobileSidebarContentProps) {
  const { open, closeSidebar } = useMobileSidebar();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !open) return;

    const body = document.body;
    const html = document.documentElement;

    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    const lenis = getLenisInstance();

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    lenis?.stop();

    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;

      lenis?.start();
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeSidebar]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <MobileSidebarOverlay
            onClose={closeSidebar}
            className={overlayClassName}
          />

          <MobileSidebarPanel width={width} className={className}>
            {children}
          </MobileSidebarPanel>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}