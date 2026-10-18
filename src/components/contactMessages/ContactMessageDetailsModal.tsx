"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";

import { createPortal } from "react-dom";

import {
  Building2,
  CalendarDays,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import type { ContactMessage } from "./contact-messages.api";

import { formatContactDate, toPersianDigits } from "./contact-messages.utils";

import {
  animateContactModalClose,
  useContactModalEnterAnimation,
} from "./contact-messages.animations";

interface ContactMessageDetailsModalProps {
  open: boolean;
  onClose: () => void;
  message: ContactMessage;
}

const ContactMessageDetailsModal = ({
  open,
  onClose,
  message,
}: ContactMessageDetailsModalProps) => {
  const t = useTranslations("ContactMessages");
  const locale = useLocale();

  const isRTL = locale === "fa";

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const closingRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [renderModal, setRenderModal] = useState(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      closingRef.current = false;
      setRenderModal(true);
    }
  }, [open]);

  const closeModal = useCallback(() => {
    if (closingRef.current) return;

    closingRef.current = true;

    animateContactModalClose(modalRef.current, backdropRef.current, () => {
      setRenderModal(false);
      onClose();
      closingRef.current = false;
    });
  }, [onClose]);

  useEffect(() => {
    if (!renderModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [renderModal, closeModal]);

  useContactModalEnterAnimation({
    containerRef,
    backdropRef,
    modalRef,
    renderModal,
  });

  if (!mounted || !renderModal) {
    return null;
  }

  return createPortal(
    <div
      ref={containerRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="3xl:p-6 fixed inset-0 z-[9999] flex items-center justify-center p-3 xl:p-4 2xl:p-5"
      onClick={closeModal}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-message-details-title"
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card 3xl:max-w-[680px] 3xl:max-h-[calc(100dvh-48px)] relative z-10 max-h-[calc(100dvh-24px)] w-full max-w-[560px] overflow-x-hidden overflow-y-auto rounded-xl border shadow-2xl xl:max-h-[calc(100dvh-32px)] xl:max-w-[600px] 2xl:max-h-[calc(100dvh-40px)] 2xl:max-w-[640px]"
      >
        {/* Header */}
        <div className="contact-modal-item border-border 3xl:gap-6 3xl:px-7 3xl:py-6 flex items-start justify-between gap-4 border-b px-4 py-4 xl:px-5 xl:py-4.5 2xl:px-6 2xl:py-5">
          <div className="min-w-0">
            <div className="3xl:mb-2 3xl:gap-2.5 mb-1.5 flex items-center gap-2">
              <span className="bg-custom-primary 3xl:size-2 size-1.5 rounded-full" />

              <span className="text-custom-primary 3xl:text-xs text-[11px] font-semibold tracking-[0.08em]">
                {locale === "fa"
                  ? `${toPersianDigits(message.id)}#`
                  : `#${message.id}`}
              </span>
            </div>

            <h2
              id="contact-message-details-title"
              className="text-foreground 3xl:text-xl text-[17px] font-semibold xl:text-[18px] 2xl:text-[19px]"
            >
              {t("details.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-1.5 3xl:text-sm mt-1 text-[12px] xl:text-[13px]">
              {t("details.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label={t("details.close")}
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground 3xl:size-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-200"
          >
            <X strokeWidth={1.8} className="3xl:size-[19px] size-[17px]" />
          </button>
        </div>

        {/* Information */}
        <div className="border-border grid grid-cols-2 border-b">
          <DetailItem
            icon={UserRound}
            label={t("table.fullName")}
            value={message.full_name}
            className="contact-modal-item border-border border-e border-b"
          />

          <DetailItem
            icon={Building2}
            label={t("table.company")}
            value={message.company || t("table.emptyValue")}
            className="contact-modal-item border-border border-b"
          />

          <DetailItem
            icon={Phone}
            label={t("table.phoneNumber")}
            value={message.phone_number}
            dir="ltr"
            className="contact-modal-item border-border border-e"
          />

          <DetailItem
            icon={Mail}
            label={t("table.email")}
            value={message.email}
            dir="ltr"
            className="contact-modal-item"
          />
        </div>

        {/* Message */}
        <div className="contact-modal-item 3xl:px-7 3xl:py-6 px-4 py-4 xl:px-5 xl:py-4.5 2xl:px-6 2xl:py-5">
          <div className="3xl:mb-4 3xl:gap-2.5 mb-3 flex items-center gap-2">
            <MessageSquareText
              strokeWidth={1.8}
              className="text-custom-primary 3xl:size-[18px] size-4"
            />

            <h3 className="text-foreground 3xl:text-sm text-[13px] font-semibold">
              {t("details.message")}
            </h3>
          </div>

          <div className="border-border bg-secondary-bg 3xl:max-h-[220px] 3xl:px-5 3xl:py-4 max-h-[150px] overflow-x-hidden overflow-y-auto rounded-lg border px-3.5 py-3 xl:max-h-[180px] xl:px-4 2xl:max-h-[200px]">
            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-[12px] leading-5 [overflow-wrap:anywhere] break-words whitespace-pre-wrap xl:text-[13px] xl:leading-6">
              {message.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="contact-modal-item border-border bg-card-secondary/40 3xl:gap-5 3xl:px-7 3xl:py-5 flex items-center justify-between gap-3 border-t px-4 py-3 xl:px-5 xl:py-4 2xl:px-6">
          <div className="text-muted-foreground 3xl:text-sm flex min-w-0 items-center gap-2 text-[12px] xl:text-[13px]">
            <CalendarDays
              strokeWidth={1.8}
              className="3xl:size-4 size-3.5 shrink-0"
            />

            <span>{formatContactDate(message.created, locale)}</span>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="border-border text-foreground hover:border-border-secondary hover:bg-secondary-bg 3xl:h-10 3xl:px-4 3xl:text-sm h-9 shrink-0 cursor-pointer rounded-lg border px-3 text-[12px] font-medium transition-colors duration-300 xl:text-[13px]"
          >
            {t("details.close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

interface DetailItemProps {
  icon: ElementType;
  label: string;
  value: string;
  className?: string;
  dir?: "ltr" | "rtl";
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
  className,
  dir,
}: DetailItemProps) => {
  return (
    <div
      className={`3xl:px-7 3xl:py-5 min-w-0 px-4 py-3.5 xl:px-5 xl:py-4 2xl:px-6 ${
        className ?? ""
      }`}
    >
      <div className="text-muted-foreground 3xl:mb-2 3xl:text-xs mb-1.5 flex items-center gap-2 text-[11px] font-medium">
        <Icon strokeWidth={1.8} className="3xl:size-[15px] size-3.5" />

        <span>{label}</span>
      </div>

      <p
        dir={dir}
        className="text-foreground 3xl:text-sm text-[12px] font-medium [overflow-wrap:anywhere] break-words xl:text-[13px]"
      >
        {value}
      </p>
    </div>
  );
};

export default ContactMessageDetailsModal;
