"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowDownUp, Search } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getContactMessages,
  type ContactMessage,
} from "./contact-messages.api";

import ContactMessageRow from "./ContactMessageRow";

gsap.registerPlugin(useGSAP);

type SortType = "newest" | "oldest";

const ContactMessagesPage = () => {
  const t = useTranslations("ContactMessages");

  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortType>("newest");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getContactMessages();

        setMessages(data);
      } catch (error) {
        console.error("GET CONTACT MESSAGES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...messages]
      .filter((message) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          message.full_name.toLowerCase().includes(normalizedSearch) ||
          message.phone_number.toLowerCase().includes(normalizedSearch) ||
          message.email.toLowerCase().includes(normalizedSearch) ||
          (message.company ?? "").toLowerCase().includes(normalizedSearch) ||
          message.message.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const firstDate = new Date(a.created).getTime();

        const secondDate = new Date(b.created).getTime();

        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [messages, search, sort]);

  const handleSort = () => {
    setSort((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  useGSAP(
    () => {
      if (!pageRef.current) {
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
    },
  );

  return (
    <div ref={pageRef} className="flex min-h-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        <section className="contact-messages-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Toolbar */}
          <div className="border-border 3xl:gap-5 3xl:p-5 flex shrink-0 items-center justify-between gap-5 border-b p-5 xl:gap-3 xl:p-4 2xl:gap-4 2xl:p-4.5">
            {/* Search */}
            <div className="contact-messages-search 3xl:max-w-[520px] relative w-full max-w-[520px] xl:max-w-[400px] 2xl:max-w-[460px]">
              <Search
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-4 top-1/2 size-[19px] -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir={locale === "fa" ? "rtl" : "ltr"}
                placeholder={t("filters.searchPlaceholder")}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:text-[15px] h-12 w-full rounded-lg border ps-11 pe-4 text-[15px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:ps-10 xl:pe-3.5 xl:text-[14px] 2xl:h-11.5"
              />
            </div>

            {/* Sort */}
            <div className="contact-messages-sort shrink-0">
              <button
                type="button"
                onClick={handleSort}
                className="border-border bg-background text-foreground hover:border-border-secondary hover:bg-secondary-bg 3xl:h-12 3xl:px-5 3xl:text-[15px] flex h-12 cursor-pointer items-center gap-2 rounded-lg border px-5 text-[15px] font-medium transition-colors duration-300 xl:h-11 xl:px-4 xl:text-[14px] 2xl:h-11.5"
              >
                <ArrowDownUp
                  strokeWidth={1.8}
                  className="3xl:size-[18px] size-[18px] xl:size-4"
                />

                {sort === "newest"
                  ? t("filters.newestFirst")
                  : t("filters.oldestFirst")}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Table Header */}
            <div className="contact-messages-table-header border-border bg-card-secondary 3xl:ps-9 3xl:pe-11 shrink-0 border-b ps-9 pe-11 xl:ps-6 xl:pe-8 2xl:ps-7 2xl:pe-9">
              <div className="text-muted-foreground 3xl:h-13 3xl:grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] 3xl:gap-4 3xl:text-sm grid h-13 grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] items-center gap-4 text-sm font-semibold xl:h-11 xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1fr_1.55fr_110px_86px] xl:gap-2.5 xl:text-[12px] 2xl:h-12 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.05fr_1.75fr_120px_96px] 2xl:gap-3 2xl:text-[13px]">
                <div>{t("table.id")}</div>

                <div>{t("table.fullName")}</div>

                <div>{t("table.phoneNumber")}</div>

                <div>{t("table.email")}</div>

                <div>{t("table.company")}</div>

                <div>{t("table.message")}</div>

                <div>{t("table.date")}</div>

                <div className="text-center">{t("table.actions")}</div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                  <span className="text-muted-foreground text-sm">
                    {t("loading")}
                  </span>
                </div>
              </div>
            ) : filteredMessages.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:space-y-2.5 3xl:p-4 3xl:pe-6 space-y-2.5 p-4 pe-6 xl:space-y-2 xl:p-3 xl:pe-4.5 2xl:p-3.5 2xl:pe-5">
                  {filteredMessages.map((message, index) => (
                    <ContactMessageRow
                      key={message.id}
                      message={message}
                      setMessages={setMessages}
                      animationIndex={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="border-border bg-card-secondary 3xl:size-12 flex size-12 items-center justify-center rounded-lg border xl:size-11">
                  <Search
                    strokeWidth={1.7}
                    className="text-muted-foreground 3xl:size-[21px] size-[21px] xl:size-[19px]"
                  />
                </div>

                <h3 className="text-foreground 3xl:mt-4 3xl:text-base mt-4 text-base font-semibold xl:mt-3 xl:text-[15px]">
                  {t("empty.title")}
                </h3>

                <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 mt-1.5 max-w-sm text-sm leading-6 xl:text-[13px] xl:leading-5">
                  {t("empty.description")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactMessagesPage;
