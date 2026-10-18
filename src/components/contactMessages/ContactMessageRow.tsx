"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { CustomHoldButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteContactMessage,
  type ContactMessage,
} from "./contact-messages.api";

import { formatContactDate, toPersianDigits } from "./contact-messages.utils";

import ContactMessageDetailsModal from "./ContactMessageDetailsModal";

import { useContactMessageRowAnimation } from "./contact-messages.animations";

interface ContactMessageRowProps {
  message: ContactMessage;
  setMessages: Dispatch<SetStateAction<ContactMessage[]>>;
  animationIndex?: number;
}

const ContactMessageRow = ({
  message,
  setMessages,
  animationIndex = 0,
}: ContactMessageRowProps) => {
  const locale = useLocale();
  const t = useTranslations("ContactMessages");
  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const formattedDate = formatContactDate(message.created, locale);

  useContactMessageRowAnimation(rowRef, animationIndex);

  const handleDelete = async () => {
    try {
      await deleteContactMessage(String(message.id));

      setMessages((prev) => prev.filter((item) => item.id !== message.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE CONTACT MESSAGE ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  return (
    <>
      <article
        ref={rowRef}
        onClick={() => setDetailsOpen(true)}
        className="group/message border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative min-w-0 cursor-pointer rounded-lg border transition-[background-color,border-color] duration-300"
      >
        <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/message:scale-y-100" />

        <div className="3xl:min-h-[76px] 3xl:grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[60px] min-w-0 grid-cols-[34px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.25fr)_74px_62px] items-center gap-1.5 px-2 py-2 xl:min-h-[66px] xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1fr_1.55fr_110px_86px] xl:gap-2.5 xl:px-3 xl:py-2.5 2xl:min-h-[71px] 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.05fr_1.75fr_120px_96px] 2xl:gap-3 2xl:px-4">
          {/* ID */}
          <div
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground 3xl:text-sm min-w-0 text-[10px] xl:text-[12px] 2xl:text-[13px]"
          >
            {locale === "fa"
              ? `${toPersianDigits(message.id)}#`
              : `#${message.id}`}
          </div>

          {/* Full Name */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-[15px] truncate text-[11px] font-medium xl:text-[13px] 2xl:text-[14px]">
              {message.full_name}
            </p>
          </div>

          {/* Phone */}
          <div
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground 3xl:text-sm min-w-0 truncate text-[10px] xl:text-[12px] 2xl:text-[13px]"
          >
            {message.phone_number}
          </div>

          {/* Email */}
          <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
            <a
              href={`mailto:${message.email}`}
              dir={locale === "fa" ? "rtl" : "ltr"}
              className="text-muted-foreground hover:text-custom-primary 3xl:text-sm block min-w-0 truncate text-[10px] transition-colors duration-300 xl:text-[12px] 2xl:text-[13px]"
            >
              {message.email}
            </a>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-sm truncate text-[10px] xl:text-[12px] 2xl:text-[13px]">
              {message.company || t("table.emptyValue")}
            </p>
          </div>

          {/* Message */}
          <div className="3xl:pe-3 min-w-0 pe-0.5 xl:pe-1 2xl:pe-2">
            <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-[10px] leading-4 xl:text-[12px] xl:leading-5 2xl:text-[13px]">
              {message.message}
            </p>
          </div>

          {/* Date */}
          <div className="text-muted-foreground 3xl:text-sm min-w-0 text-[10px] leading-4 xl:text-[12px] 2xl:text-[13px]">
            {formattedDate}
          </div>

          {/* Actions */}
          <div
            className="flex min-w-0 justify-center"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <CustomHoldButton
              type="button"
              intent="destructive"
              variant="soft"
              duration={800}
              onComplete={handleDelete}
              leftSection={
                <Trash2
                  className="3xl:size-[17px] size-3 xl:size-4"
                  strokeWidth={1.8}
                />
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:px-3.5 3xl:text-sm h-8 w-full min-w-0 gap-1 px-1 text-[10px] xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              {t("actions.delete")}
            </CustomHoldButton>
          </div>
        </div>
      </article>

      <ContactMessageDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        message={message}
      />
    </>
  );
};

export default ContactMessageRow;
