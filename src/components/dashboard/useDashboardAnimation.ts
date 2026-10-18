"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useDashboardAnimation = (
  dashboardRef: RefObject<HTMLElement | null>,
  locale: string,
) => {
  useGSAP(
    () => {
      if (!dashboardRef.current) {
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
        ".dashboard-heading",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          clearProps: "opacity,transform",
        },
      );

      timeline.fromTo(
        ".dashboard-stat-item",
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.045,
          clearProps: "opacity,transform",
        },
        "-=0.22",
      );
    },
    {
      scope: dashboardRef,
      dependencies: [locale],
    },
  );
};
