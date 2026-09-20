"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Search, Table2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getStandardTableParents,
  type StandardTableParent,
} from "./standard-tables.api";

import StandardTableParentRow from "./StandardTableParentRow";

gsap.registerPlugin(useGSAP);

const parentTableGridClass =
  "grid grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1.45fr)_290px] items-start gap-5 xl:grid-cols-[60px_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1.25fr)_minmax(0,1.25fr)_250px] xl:gap-3 2xl:grid-cols-[66px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1.35fr)_270px] 2xl:gap-4 3xl:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1.45fr)_290px] 3xl:gap-5";

const StandardTablesPage = () => {
  const t = useTranslations("StandardTables");
  const locale = useLocale();

  const pageRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<StandardTableParent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshParents = useCallback(async () => {
    try {
      const data = await getStandardTableParents();

      setItems(data);
    } catch (error) {
      console.error("GET STANDARD TABLE PARENTS ERROR:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshParents();
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshParents]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (!normalizedSearch) return true;

      return (
        item.name_en.toLowerCase().includes(normalizedSearch) ||
        item.name_fa.toLowerCase().includes(normalizedSearch) ||
        item.description_en.toLowerCase().includes(normalizedSearch) ||
        item.description_fa.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [items, search]);

  useGSAP(
    () => {
      if (!pageRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".standard-tables-panel",
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
        ".standard-tables-search",
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
        ".standard-tables-header",
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
        <section className="standard-tables-panel border-border bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Toolbar */}
          <div className="border-border 3xl:p-5 flex shrink-0 items-center border-b p-5 xl:p-4 2xl:p-4.5">
            <div className="standard-tables-search 3xl:max-w-[520px] relative w-full max-w-[520px] xl:max-w-[400px] 2xl:max-w-[460px]">
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
          </div>

          {/* Table */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="standard-tables-header border-border bg-card-secondary shrink-0 border-b">
              <div className="3xl:px-8 px-4 xl:px-3 2xl:px-3.5">
                <div className="3xl:py-4 py-4 xl:py-3">
                  <div
                    className={`${parentTableGridClass} text-muted-foreground 3xl:text-sm text-sm font-semibold xl:text-[12px] 2xl:text-[13px]`}
                  >
                    <div>{t("table.cover")}</div>

                    <div>{t("table.nameEn")}</div>

                    <div>{t("table.nameFa")}</div>

                    <div>{t("table.descriptionEn")}</div>

                    <div>{t("table.descriptionFa")}</div>

                    <div className="text-center">{t("table.actions")}</div>
                  </div>
                </div>
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
            ) : filteredItems.length > 0 ? (
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="min-h-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:space-y-3 3xl:p-4 space-y-3 p-4 xl:space-y-2.5 xl:p-3 2xl:p-3.5">
                  {filteredItems.map((item, index) => (
                    <StandardTableParentRow
                      key={item.id}
                      item={item}
                      setItems={setItems}
                      refreshParents={refreshParents}
                      animationIndex={index}
                      parentTableGridClass={parentTableGridClass}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="border-border bg-card-secondary 3xl:size-12 flex size-12 items-center justify-center rounded-lg border xl:size-11">
                  <Table2
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

export default StandardTablesPage;
