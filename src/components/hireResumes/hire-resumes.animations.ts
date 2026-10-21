"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useHireResumesPageAnimation = (
  pageRef: RefObject<HTMLDivElement | null>,
  locale: string,
) => {
  useGSAP(
    () => {
      if (!pageRef.current || prefersReducedMotion()) {
        return;
      }

      gsap.fromTo(
        ".hire-resumes-panel",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    },
    {
      scope: pageRef,
      dependencies: [locale],
      revertOnUpdate: true,
    },
  );
};

export const useHireResumeRowAnimation = (
  rowRef: RefObject<HTMLElement | null>,
  animationIndex: number,
) => {
  useGSAP(
    () => {
      if (!rowRef.current || prefersReducedMotion()) {
        return;
      }

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: Math.min(animationIndex, 8) * 0.045,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );
};
