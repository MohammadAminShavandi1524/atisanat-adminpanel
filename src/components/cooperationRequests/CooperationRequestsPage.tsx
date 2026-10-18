"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowDownUp, Handshake, Search } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";

import {
  getCooperationRequests,
  type CooperationRequest,
} from "./cooperation-requests.api";

import CooperationRequestRow from "./CooperationRequestRow";

import { useCooperationRequestsPageAnimation } from "./cooperation-requests.animations";

type SortType = "newest" | "oldest";

const CooperationRequestsPage = () => {
  const t = useTranslations("CooperationRequests");

  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [requests, setRequests] = useState<CooperationRequest[]>([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortType>("newest");

  const [loading, setLoading] = useState(true);

  useCooperationRequestsPageAnimation(pageRef, locale);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getCooperationRequests();

        setRequests(data);
      } catch (error) {
        console.error("GET COOPERATION REQUESTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...requests]
      .filter((request) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          request.full_name.toLowerCase().includes(normalizedSearch) ||
          request.phone_number.toLowerCase().includes(normalizedSearch) ||
          request.email.toLowerCase().includes(normalizedSearch) ||
          (request.company ?? "").toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const firstDate = new Date(a.created).getTime();

        const secondDate = new Date(b.created).getTime();

        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [requests, search, sort]);

  const handleSort = () => {
    setSort((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  return (
    <div ref={pageRef} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <section className="cooperation-requests-panel border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Toolbar */}
          <div className="border-border 3xl:gap-5 3xl:p-5 flex shrink-0 items-center justify-between gap-3 border-b p-3 xl:gap-3 xl:p-4 2xl:gap-4 2xl:p-4.5">
            {/* Search */}
            <div className="cooperation-requests-search 3xl:max-w-[520px] relative w-full max-w-[340px] min-w-0 xl:max-w-[400px] 2xl:max-w-[460px]">
              <Search
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir={locale === "fa" ? "rtl" : "ltr"}
                placeholder={t("filters.searchPlaceholder")}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-10 w-full min-w-0 rounded-lg border ps-9 pe-3 text-[12px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:ps-10 xl:pe-3.5 xl:text-[14px] 2xl:h-11.5"
              />
            </div>

            {/* Sort */}
            <div className="cooperation-requests-sort shrink-0">
              <CustomButton
                type="button"
                variant="outline"
                intent="secondary"
                size="lg"
                onClick={handleSort}
                leftSection={
                  <ArrowDownUp
                    strokeWidth={1.8}
                    className="3xl:size-[18px] size-3.5 shrink-0 xl:size-4"
                  />
                }
                className="3xl:h-12 3xl:px-5 3xl:text-[15px] h-10 px-2.5 text-[12px] xl:h-11 xl:px-4 xl:text-[14px] 2xl:h-11.5"
              >
                {sort === "newest"
                  ? t("filters.newestFirst")
                  : t("filters.oldestFirst")}
              </CustomButton>
            </div>
          </div>

          {/* Table */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {/* Table Header */}
            <div className="cooperation-requests-table-header border-border bg-card-secondary 3xl:ps-9 3xl:pe-11 shrink-0 border-b ps-[21px] pe-[27px] xl:ps-[25px] xl:pe-[31px] 2xl:ps-[31px] 2xl:pe-[37px]">
              <div className="text-muted-foreground 3xl:h-13 3xl:grid-cols-[60px_1.25fr_1.1fr_1.45fr_1.1fr_130px_130px_100px] 3xl:gap-4 3xl:text-sm grid h-10 grid-cols-[34px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.85fr)_76px_78px_74px] items-center gap-1.5 text-[10px] font-semibold xl:h-11 xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1fr_105px_105px_82px] xl:gap-2.5 xl:text-[12px] 2xl:h-12 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.05fr_115px_115px_90px] 2xl:gap-3 2xl:text-[13px]">
                <div className="min-w-0">{t("table.id")}</div>

                <div className="min-w-0">{t("table.fullName")}</div>

                <div className="min-w-0">{t("table.phoneNumber")}</div>

                <div className="min-w-0">{t("table.email")}</div>

                <div className="min-w-0">{t("table.company")}</div>

                <div className="min-w-0">{t("table.date")}</div>

                <div className="min-w-0 text-center">{t("table.resume")}</div>

                <div className="min-w-0 text-center">{t("table.actions")}</div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />

                  <span className="text-muted-foreground text-sm">
                    {t("loading")}
                  </span>
                </div>
              </div>
            ) : filteredRequests.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 min-w-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:space-y-2.5 3xl:p-4 3xl:pe-6 space-y-2 p-2.5 ps-3 pe-[18px] xl:p-3 xl:pe-4.5 2xl:space-y-2.5 2xl:p-3.5 2xl:pe-5">
                  {filteredRequests.map((request, index) => (
                    <CooperationRequestRow
                      key={request.id}
                      request={request}
                      setRequests={setRequests}
                      animationIndex={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="border-border bg-card-secondary 3xl:size-12 flex size-11 items-center justify-center rounded-lg border">
                  <Handshake
                    strokeWidth={1.7}
                    className="text-muted-foreground 3xl:size-[21px] size-[19px]"
                  />
                </div>

                <h3 className="text-foreground 3xl:mt-4 3xl:text-base mt-3 text-[15px] font-semibold">
                  {t("empty.title")}
                </h3>

                <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 mt-1.5 max-w-sm text-[13px] leading-5">
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

export default CooperationRequestsPage;
