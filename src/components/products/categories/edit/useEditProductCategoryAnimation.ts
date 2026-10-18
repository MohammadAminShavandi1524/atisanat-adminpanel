
"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useEditProductCategoryAnimation = (
  formRef: RefObject<HTMLFormElement | null>,
  loading: boolean,
) => {
  useGSAP(
    () => {
      if (!formRef.current) return;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );

      gsap.fromTo(
        ".edit-category-info",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: 0.2,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    },
    {
      scope: formRef,
    },
  );

  useGSAP(
    () => {
      if (!formRef.current || loading) return;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      });

      timeline.fromTo(
        ".edit-category-fields > div:first-child",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
      );

      timeline.fromTo(
        ".edit-category-submit",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.2",
      );
    },
    {
      scope: formRef,
      dependencies: [loading],
      revertOnUpdate: true,
    },
  );
};
