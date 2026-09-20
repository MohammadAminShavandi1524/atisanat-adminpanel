"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Download, Pencil, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteStandardTableChild,
  deleteStandardTableParent,
  getStandardTableChildrenByParent,
  type StandardTableChild,
  type StandardTableParent,
} from "./standard-tables.api";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface StandardTableParentRowProps {
  item: StandardTableParent;
  setItems: Dispatch<SetStateAction<StandardTableParent[]>>;
  refreshParents: () => Promise<void>;
  animationIndex?: number;
  parentTableGridClass: string;
}

const childTableGridClass =
  "grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_110px_250px] items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_88px_210px] xl:gap-3 2xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.05fr)_96px_225px] 2xl:gap-4 3xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_110px_250px] 3xl:gap-5";

const StandardTableParentRow = ({
  item,
  setItems,
  refreshParents,
  animationIndex = 0,
  parentTableGridClass,
}: StandardTableParentRowProps) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("StandardTables");
  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);

  const [open, setOpen] = useState(false);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [childrenError, setChildrenError] = useState(false);
  const [children, setChildren] = useState<StandardTableChild[]>([]);

  const handleDeleteParent = async () => {
    try {
      await deleteStandardTableParent(item.id);

      setItems((prev) => prev.filter((parent) => parent.id !== item.id));

      toast.success(t("toast.parentDeleteSuccess"));
    } catch (error) {
      console.error("DELETE STANDARD TABLE PARENT ERROR:", error);

      toast.error(t("toast.parentDeleteError"));
    }
  };

  const handleDeleteChild = async (childId: number) => {
    try {
      await deleteStandardTableChild(childId);

      setChildren((prev) => prev.filter((child) => child.id !== childId));

      toast.success(t("toast.childDeleteSuccess"));
    } catch (error) {
      console.error("DELETE STANDARD TABLE CHILD ERROR:", error);

      toast.error(t("toast.childDeleteError"));
    }
  };

  const handleToggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    if (children.length > 0 || childrenLoading) return;

    try {
      setChildrenLoading(true);
      setChildrenError(false);

      const data = await getStandardTableChildrenByParent(item.id);

      setChildren(data);
    } catch (error) {
      console.error("GET STANDARD TABLE CHILDREN ERROR:", error);

      setChildrenError(true);
    } finally {
      setChildrenLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
  }, [open]);

  useGSAP(
    () => {
      if (!rowRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: Math.min(animationIndex, 8) * 0.05,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );

  return (
    <article
      ref={rowRef}
      className="border-border bg-background overflow-hidden rounded-xl border"
    >
      {/* Parent Row */}
      <div className="3xl:px-4 3xl:py-4 px-4 py-4 xl:px-3 xl:py-3 2xl:px-3.5">
        <div className={cn(parentTableGridClass , "items-center")  }>
          {/* Cover */}
          <div className="flex items-start">
            <div className="border-border bg-card 3xl:h-20 3xl:w-[60px] relative h-20 w-[60px] shrink-0 overflow-hidden rounded-lg border xl:h-[72px] xl:w-[54px] 2xl:h-[76px] 2xl:w-[57px]">
              <Image
                src={item.image}
                alt={item.name_en}
                fill
                sizes="60px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Name EN */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
              {item.name_en}
            </p>
          </div>

          {/* Name FA */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
              {item.name_fa}
            </p>
          </div>

          {/* Description EN */}
          <div className="min-w-0">
            <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
              {item.description_en}
            </p>
          </div>

          {/* Description FA */}
          <div className="min-w-0">
            <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
              {item.description_fa}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-start justify-center gap-2">
            <CustomButton
              type="button"
              variant="outline"
              intent="secondary"
              onClick={handleToggle}
              rightSection={
                open ? (
                  <ChevronUp
                    className="3xl:size-[17px] size-4"
                    strokeWidth={1.8}
                  />
                ) : (
                  <ChevronDown
                    className="3xl:size-[17px] size-4"
                    strokeWidth={1.8}
                  />
                )
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              {open ? t("actions.less") : t("actions.more")}
            </CustomButton>

            <CustomButton
              type="button"
              variant="outline"
              intent="secondary"
              onClick={() => {
                router.push(
                  `/${locale}/standard-tables/parent/${item.id}/edit`,
                );
              }}
              leftSection={
                <Pencil className="3xl:size-[17px] size-4" strokeWidth={1.8} />
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              {t("actions.edit")}
            </CustomButton>

            <CustomHoldButton
              type="button"
              intent="destructive"
              variant="soft"
              duration={800}
              onComplete={handleDeleteParent}
              leftSection={
                <Trash2 className="3xl:size-[17px] size-4" strokeWidth={1.8} />
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              {t("actions.delete")}
            </CustomHoldButton>
          </div>
        </div>
      </div>

      {/* Children */}
      {open && (
        <div className="border-border border-t">
          <div className="3xl:px-4 3xl:py-4 px-4 py-4 xl:px-3 xl:py-3 2xl:px-3.5">
            {childrenLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
                  <span className="text-muted-foreground text-sm">
                    {t("children.loading")}
                  </span>
                </div>
              </div>
            ) : childrenError ? (
              <div className="py-8 text-center">
                <p className="text-destructive text-sm">
                  {t("children.error")}
                </p>
              </div>
            ) : children.length === 0 ? (
              <div className="py-8 text-center">
                <h3 className="text-foreground text-sm font-semibold">
                  {t("children.empty.title")}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {t("children.empty.description")}
                </p>
              </div>
            ) : (
              <>
                <div className="border-border bg-card-secondary rounded-lg border">
                  <div className="3xl:px-4 3xl:py-4 px-4 py-4 xl:px-3 xl:py-3 2xl:px-3.5">
                    <div
                      className={`${childTableGridClass} text-muted-foreground 3xl:text-sm text-sm font-semibold xl:text-[12px] 2xl:text-[13px]`}
                    >
                      <div>{t("children.table.nameEn")}</div>
                      <div>{t("children.table.nameFa")}</div>
                      <div>{t("children.table.size")}</div>
                      <div className="text-center">
                        {t("children.table.actions")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="3xl:mt-3 mt-3 space-y-3 xl:mt-2.5 xl:space-y-2.5">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className="border-border bg-card rounded-lg border"
                    >
                      <div className="3xl:px-4 3xl:py-4 px-4 py-4 xl:px-3 xl:py-3 2xl:px-3.5">
                        <div className={cn(childTableGridClass,"items-center")  }>
                          <div className="min-w-0">
                            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
                              {child.name_en}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 break-words xl:text-[12px] xl:leading-6 2xl:text-[13px]">
                              {child.name_fa}
                            </p>
                          </div>

                          <div>
                            <p className="text-foreground 3xl:text-sm text-sm font-medium xl:text-[12px] 2xl:text-[13px]">
                              {child.size}
                            </p>
                          </div>

                          <div className="flex items-start justify-end gap-2">
                            <CustomButton
                              type="button"
                              variant="outline"
                              intent="secondary"
                              onClick={() => window.open(child.file, "_blank")}
                            
                              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
                            >
                              {t("actions.download")}
                            </CustomButton>

                            <CustomButton
                              type="button"
                              variant="outline"
                              intent="secondary"
                              onClick={() => {
                                router.push(
                                  `/${locale}/standard-tables/child/${child.id}/edit`,
                                );
                              }}
                              leftSection={
                                <Pencil
                                  className="3xl:size-[17px] size-4"
                                  strokeWidth={1.8}
                                />
                              }
                              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
                            >
                              {t("actions.edit")}
                            </CustomButton>

                            <CustomHoldButton
                              type="button"
                              intent="destructive"
                              variant="soft"
                              duration={800}
                              onComplete={() => handleDeleteChild(child.id)}
                              leftSection={
                                <Trash2
                                  className="3xl:size-[17px] size-4"
                                  strokeWidth={1.8}
                                />
                              }
                              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
                            >
                              {t("actions.delete")}
                            </CustomHoldButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default StandardTableParentRow;
