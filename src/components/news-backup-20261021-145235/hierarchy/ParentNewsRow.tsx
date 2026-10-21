"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Tag,
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

import ChildNewsRow from "./ChildNewsRow";

import type {
  ChildNews,
  ParentNews,
} from "./types";

import { NEWS_HIERARCHY_ACTION_BUTTON } from "./newsHierarchyLayout";

interface Props {
  news: ParentNews;
  onDelete?: (id: number) => void;
}

const ParentNewsRow = ({
  news,
  onDelete,
}: Props) => {
  const locale = useLocale();

  const t = useTranslations("news");

  const toast = useCustomToast();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  const [children, setChildren] =
    useState<ChildNews[]>([]);

  const imagePath = news.image
    ? news.image.split("arvanstorage.ir/")[1]
    : null;

  const imageUrl = imagePath
    ? `/api/media/${imagePath}`
    : null;

  const handleToggle = async () => {
    if (!loaded) {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/blog/child/${news.id}`,
          {
            cache: "no-store",
          },
        );

        const data = await res.json();

        setChildren(
          Array.isArray(data) ? data : [],
        );

        setLoaded(true);
      } catch (error) {
        console.error(error);

        setChildren([]);
      } finally {
        setLoading(false);
      }
    }

    setOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/blog/parent/delete/${news.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      onDelete?.(news.id);

      toast.success(
        t("toast.parentNewsDeleteSuccess"),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch {
      toast.error(
        t("toast.parentNewsDeleteError"),
      );
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(
        `/api/blog/publish/${news.id}`,
        {
          method: "PATCH",
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        news.published
          ? t(
              "toast.newsUnpublishedSuccess",
            )
          : t(
              "toast.newsPublishedSuccess",
            ),
      );

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch {
      toast.error(
        t("toast.newsPublishError"),
      );
    }
  };

  return (
    <motion.div className="min-w-0">
      {/* Parent */}
      <div className="border-border bg-background hover:border-custom-primary/25 hover:bg-secondary-bg/50 relative min-w-0 rounded-xl border px-5 py-4 transition-colors duration-200 xl:px-3 xl:py-3 2xl:px-4 2xl:py-3.5 3xl:px-5 3xl:py-4">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 xl:gap-3 2xl:gap-4 3xl:gap-5">
          {/* Content */}
          <div className="flex min-w-0 items-center gap-4 xl:gap-2.5 2xl:gap-3 3xl:gap-4">
            <div className="border-border bg-secondary-bg flex size-10 shrink-0 items-center justify-center rounded-lg border xl:size-8 2xl:size-9 3xl:size-10">
              <FileText
                className="text-custom-primary size-4.5 xl:size-4 3xl:size-4.5"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0 space-y-2 xl:space-y-1.5 3xl:space-y-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2 xl:gap-1.5 3xl:gap-2">
                <p
                  lang={news.lang}
                  className={cn(
                    "text-foreground min-w-0 truncate font-semibold xl:text-[13px] 3xl:text-base",
                    news.lang === "fa" &&
                      "font-IRANYekanX",
                  )}
                >
                  {news.title}
                </p>

                {news.published ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-lg border border-green-500/20 bg-green-500/[0.07] px-2 py-1 text-xs text-green-600 xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:text-[11px] 3xl:px-2 3xl:py-1 3xl:text-xs">
                    <Eye className="size-3 xl:size-2.5 3xl:size-3" />

                    {t(
                      "hierarchy.published",
                    )}
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1 rounded-lg border border-orange-500/20 bg-orange-500/[0.07] px-2 py-1 text-xs text-orange-600 xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:text-[11px] 3xl:px-2 3xl:py-1 3xl:text-xs">
                    <EyeOff className="size-3 xl:size-2.5 3xl:size-3" />

                    {t("hierarchy.draft")}
                  </span>
                )}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs xl:gap-x-2.5 xl:text-[10px] 2xl:gap-x-3 2xl:text-[11px] 3xl:gap-x-4 3xl:text-xs">
                <span className="flex items-center gap-1">
                  <Globe className="size-3 xl:size-2.5 3xl:size-3" />

                  {news.lang.toUpperCase()}
                </span>

                <span className="truncate">
                  {t(
                    "hierarchy.category",
                  )}
                  : {news.category.name}
                </span>

                <span>
                  {t("hierarchy.id")}: #
                  {news.id}
                </span>
              </div>

              {news.tags?.length > 0 && (
                <div className="flex min-w-0 items-center gap-2 xl:gap-1.5 3xl:gap-2">
                  <Tag className="text-muted-foreground size-3 shrink-0 xl:size-2.5 3xl:size-3" />

                  <div className="flex min-w-0 flex-wrap gap-1">
                    {news.tags
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          lang={news.lang}
                          className={cn(
                            "border-border bg-secondary-bg max-w-[180px] truncate rounded-lg border px-2 py-1 text-xs xl:max-w-[120px] xl:px-1.5 xl:py-0.5 xl:text-[10px] 2xl:max-w-[150px] 2xl:text-[11px] 3xl:max-w-[180px] 3xl:px-2 3xl:py-1 3xl:text-xs",
                            news.lang ===
                              "fa" &&
                              "font-IRANYekanX",
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 xl:gap-1.5 3xl:gap-2">
            <Link
              href={`/${locale}/news/parent/edit/${news.id}`}
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

            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  customButtonVariants({
                    intent: "info",
                    variant: "soft",
                  }),
                  NEWS_HIERARCHY_ACTION_BUTTON,
                )}
              >
                <span>
                  {t(
                    "actions.downloadImage",
                  )}
                </span>
              </a>
            )}

            <CustomButton
              onClick={handlePublish}
              intent="success"
              variant="soft"
              className={
                NEWS_HIERARCHY_ACTION_BUTTON
              }
            >
              {news.published
                ? t("actions.unpublish")
                : t("actions.publish")}
            </CustomButton>

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

            <CustomButton
              intent="info"
              variant="soft"
              loading={loading}
              onClick={handleToggle}
              rightSection={
                <ChevronDown
                  className={cn(
                    "size-4.5 transition-transform duration-200 xl:size-4 3xl:size-4.5",
                    open && "rotate-180",
                  )}
                />
              }
              className={
                NEWS_HIERARCHY_ACTION_BUTTON
              }
            >
              {t("actions.more")}
            </CustomButton>
          </div>
        </div>

        {/* Description */}
        {news.description && (
          <div className="text-muted-foreground border-border mt-4 min-w-0 border-t pt-3 text-sm xl:mt-3 xl:pt-2.5 xl:text-[12px] 2xl:text-[13px] 3xl:mt-4 3xl:pt-3 3xl:text-sm">
            <p
              dir={
                news.lang === "fa"
                  ? "rtl"
                  : "ltr"
              }
              className={cn(
                "min-w-0 leading-7 break-words xl:leading-5 2xl:leading-6 3xl:leading-7",
                news.lang === "fa" &&
                  "font-IRANYekanX text-justify",
              )}
            >
              {news.description}
            </p>
          </div>
        )}
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="children"
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
              {children.length > 0 ? (
                children.map((child) => (
                  <ChildNewsRow
                    key={child.id}
                    parentLang={
                      news.lang
                    }
                    parentId={news.id}
                    news={child}
                  />
                ))
              ) : (
                <div className="border-border bg-secondary-bg text-muted-foreground rounded-xl border p-4 text-sm xl:p-3 xl:text-[12px] 2xl:text-[13px] 3xl:p-4 3xl:text-sm">
                  {t(
                    "hierarchy.noChildNews",
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ParentNewsRow;
