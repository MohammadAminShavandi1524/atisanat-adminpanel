"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronDown,
  FolderTree,
} from "lucide-react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import { cn } from "@/lib/utils";

import {
  CustomButton,
  CustomHoldButton,
} from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { useCustomToast } from "@/components/ui/custom-toast";

import ParentNewsRow from "./ParentNewsRow";

import type {
  ParentNews,
  RootNews,
} from "./types";

import {
  NEWS_HIERARCHY_ACTION_BUTTON,
  NEWS_HIERARCHY_GRID,
  NEWS_HIERARCHY_ROW_PADDING,
} from "./newsHierarchyLayout";

interface Props {
  news: RootNews;
  parents: ParentNews[];
}

const RootNewsRow = ({
  news,
  parents,
}: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const [isOpen, setIsOpen] =
    useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/blog/root/delete/${news.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        t("toast.rootNewsDeleteSuccess"),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(
        t("toast.rootNewsDeleteError"),
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
      transition={{
        duration: 0.2,
      }}
      className="min-w-0 last:mb-0"
    >
      {/* Root */}
      <div
        className={cn(
          "border-border bg-background hover:border-custom-primary/25 hover:bg-secondary-bg/50 relative min-w-0 items-center rounded-xl border py-4 transition-colors duration-200 xl:py-3 2xl:py-3.5 3xl:py-4",
          NEWS_HIERARCHY_GRID,
          NEWS_HIERARCHY_ROW_PADDING,
        )}
      >
        {/* ID */}
        <div className="text-muted-foreground font-mono text-sm xl:text-xs 2xl:text-[13px] 3xl:text-sm">
          #{news.id}
        </div>

        {/* Title */}
        <div className="flex min-w-0 items-center gap-4 xl:gap-2.5 2xl:gap-3 3xl:gap-4">
          <div className="border-border bg-secondary-bg flex size-10 shrink-0 items-center justify-center rounded-lg border xl:size-8 2xl:size-9 3xl:size-10">
            <FolderTree
              className="text-custom-primary size-4.5 xl:size-4 3xl:size-4.5"
              strokeWidth={1.6}
            />
          </div>

          <p className="text-foreground min-w-0 truncate text-sm font-semibold xl:text-[13px] 3xl:text-sm">
            {news.title}
          </p>
        </div>

        {/* Actions */}
        <div className="flex min-w-0 items-center gap-2 xl:gap-1.5 3xl:gap-2">
          <Link
            href={`/${locale}/news/root/edit/${news.id}`}
            className={cn(
              customButtonVariants({
                intent: "info",
                variant: "soft",
              }),
              NEWS_HIERARCHY_ACTION_BUTTON,
            )}
          >
            {t("actions.edit")}
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

          {parents.length > 0 && (
            <CustomButton
              intent="info"
              variant="soft"
              onClick={() =>
                setIsOpen(
                  (prev) => !prev,
                )
              }
              rightSection={
                <ChevronDown
                  className={cn(
                    "size-4.5 transition-transform duration-200 xl:size-4 3xl:size-4.5",
                    isOpen &&
                      "rotate-180",
                  )}
                />
              }
              className={
                NEWS_HIERARCHY_ACTION_BUTTON
              }
            >
              {t("actions.more")}
            </CustomButton>
          )}
        </div>
      </div>

      {/* Parents */}
      <AnimatePresence initial={false}>
        {isOpen &&
          parents.length > 0 && (
            <motion.div
              key="parents"
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                height: {
                  duration: 0.3,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                },

                opacity: {
                  duration: 0.2,
                },
              }}
              className="min-w-0 overflow-hidden"
            >
              <div className="relative ms-6 mt-3 min-w-0 space-y-3 xl:ms-4 xl:mt-2 xl:space-y-2 2xl:ms-5 2xl:mt-2.5 2xl:space-y-2.5 3xl:ms-6 3xl:mt-3 3xl:space-y-3">
                {parents.map(
                  (parent) => (
                    <ParentNewsRow
                      key={parent.id}
                      news={parent}
                    />
                  ),
                )}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RootNewsRow;
