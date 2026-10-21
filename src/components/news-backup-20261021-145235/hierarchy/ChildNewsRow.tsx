"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { useCustomToast } from "@/components/ui/custom-toast";

import type { ChildNews } from "./types";

import { NEWS_HIERARCHY_ACTION_BUTTON } from "./newsHierarchyLayout";

interface Props {
  news: ChildNews;
  parentLang: string;
  parentId: number;
}

const ChildNewsRow = ({
  news,
  parentLang,
  parentId,
}: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const imageAvailable = Boolean(news.image);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/blog/child/delete/${news.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        t("toast.childNewsDeleteSuccess"),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(
        t("toast.childNewsDeleteError"),
      );
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className="min-w-0"
    >
      <div className="border-border bg-background hover:border-custom-primary/25 hover:bg-secondary-bg/50 relative min-w-0 rounded-xl border px-5 py-4 transition-colors duration-200 xl:px-3 xl:py-3 2xl:px-4 2xl:py-3.5 3xl:px-5 3xl:py-4">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-6 xl:gap-3 2xl:gap-4 3xl:gap-6">
          {/* Content */}
          <div className="flex min-w-0 items-start gap-4 xl:gap-2.5 2xl:gap-3 3xl:gap-4">
            <div className="border-border bg-secondary-bg flex size-10 shrink-0 items-center justify-center rounded-lg border xl:size-8 2xl:size-9 3xl:size-10">
              <FileText
                className="text-custom-primary size-4.5 xl:size-4 3xl:size-4.5"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2 xl:space-y-1.5 3xl:space-y-2">
              <p
                dir={
                  parentLang === "fa"
                    ? "rtl"
                    : "ltr"
                }
                className={cn(
                  "min-w-0 font-semibold break-words xl:text-[13px] 3xl:text-base",
                  parentLang === "fa" &&
                    "font-IRANYekanX",
                )}
              >
                {news.title}
              </p>

              <p
                dir={
                  parentLang === "fa"
                    ? "rtl"
                    : "ltr"
                }
                className={cn(
                  "text-muted-foreground min-w-0 text-sm leading-6 break-words xl:text-[12px] xl:leading-5 2xl:text-[13px] 2xl:leading-6 3xl:text-sm",
                  parentLang === "fa" &&
                    "font-IRANYekanX text-justify",
                )}
              >
                {news.description}
              </p>

              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs xl:gap-1.5 xl:text-[10px] 2xl:text-[11px] 3xl:gap-2 3xl:text-xs">
                <span>
                  {t("hierarchy.id")}: #{news.id}
                </span>

                {imageAvailable && (
                  <>
                    <span>•</span>

                    <span className="text-custom-primary flex items-center gap-1">
                      <ImageIcon className="size-3.5 xl:size-3 3xl:size-3.5" />

                      {t(
                        "hierarchy.imageAttached",
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 xl:gap-1.5 3xl:gap-2">
            <Link
              href={`/${locale}/news/child/edit/${parentId}/${news.id}`}
              className={cn(
                customButtonVariants({
                  intent: "info",
                  variant: "soft",
                }),
                NEWS_HIERARCHY_ACTION_BUTTON,
              )}
            >
              <span>
                {t("actions.edit")}
              </span>
            </Link>

            <CustomHoldButton
              intent="destructive"
              variant="soft"
              duration={1200}
              onComplete={handleDelete}
              className={
                NEWS_HIERARCHY_ACTION_BUTTON
              }
            >
              {t("actions.delete")}
            </CustomHoldButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChildNewsRow;
