"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Page entrance animation
export const useContactMessagesPageAnimation = (
  pageRef: RefObject<HTMLDivElement | null>,
  locale: string,
) => {
  useGSAP(
    () => {
      if (!pageRef.current || prefersReducedMotion()) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".contact-messages-panel",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
      );

      timeline.fromTo(
        ".contact-messages-search",
        {
          opacity: 0,
          x: locale === "fa" ? 18 : -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
        },
        "-=0.35",
      );

      timeline.fromTo(
        ".contact-messages-sort",
        {
          opacity: 0,
          x: locale === "fa" ? -18 : 18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
        },
        "<",
      );

      timeline.fromTo(
        ".contact-messages-table-header",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.25",
      );
    },
    {
      scope: pageRef,
      dependencies: [locale],
      revertOnUpdate: true,
    },
  );
};

// Individual row entrance animation
export const useContactMessageRowAnimation = (
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
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: Math.min(animationIndex, 8) * 0.055,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );
};

interface ContactModalAnimationOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  backdropRef: RefObject<HTMLDivElement | null>;
  modalRef: RefObject<HTMLDivElement | null>;
  renderModal: boolean;
}

// Modal entrance animation
export const useContactModalEnterAnimation = ({
  containerRef,
  backdropRef,
  modalRef,
  renderModal,
}: ContactModalAnimationOptions) => {
  useGSAP(
    () => {
      if (
        !renderModal ||
        !containerRef.current ||
        !modalRef.current ||
        !backdropRef.current ||
        prefersReducedMotion()
      ) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        backdropRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        },
      );

      timeline.fromTo(
        modalRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
        },
        "-=0.18",
      );

      timeline.fromTo(
        ".contact-modal-item",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.045,
        },
        "-=0.2",
      );
    },
    {
      scope: containerRef,
      dependencies: [renderModal],
      revertOnUpdate: true,
    },
  );
};

// Modal exit animation
export const animateContactModalClose = (
  modal: HTMLDivElement | null,
  backdrop: HTMLDivElement | null,
  onComplete: () => void,
) => {
  if (!modal || !backdrop || prefersReducedMotion()) {
    onComplete();
    return;
  }

  gsap.killTweensOf([modal, backdrop]);

  const timeline = gsap.timeline({
    onComplete,
  });

  timeline.to(modal, {
    opacity: 0,
    y: 16,
    scale: 0.985,
    duration: 0.25,
    ease: "power2.in",
  });

  timeline.to(
    backdrop,
    {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    },
    "<",
  );
};
