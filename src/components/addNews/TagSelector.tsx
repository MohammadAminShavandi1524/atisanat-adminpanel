"use client";

import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown, Plus, X } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../ui/scroll-area";

export interface TagOption {
  id: string;
  label: string;
}

interface TagSelectorProps {
  label: string;
  options: TagOption[];
  value: TagOption[];
  onChange: (tags: TagOption[]) => void;
  placeholder: string;
  className?: string;
  lang?: "fa" | "en";
}

export const TagSelector = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
  lang = "fa",
}: TagSelectorProps) => {
  const locale = useLocale();

  const t = useTranslations("addNews");

  const [open, setOpen] = useState(false);

  const [availableTags, setAvailableTags] = useState<TagOption[]>(options);

  const [creating, setCreating] = useState(false);

  const [newTag, setNewTag] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableTags(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setCreating(false);
        setNewTag("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSelected = (tag: TagOption) => {
    return value.some((item) => item.id === tag.id);
  };

  const toggleTag = (tag: TagOption) => {
    if (isSelected(tag)) {
      onChange(value.filter((item) => item.id !== tag.id));

      return;
    }

    onChange([...value, tag]);
  };

  const removeTag = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const createTag = () => {
    const text = newTag.trim();

    if (!text) return;

    const exists = availableTags.find(
      (item) => item.label.toLowerCase() === text.toLowerCase(),
    );

    if (exists) {
      if (!isSelected(exists)) {
        onChange([...value, exists]);
      }

      setNewTag("");
      setCreating(false);

      return;
    }

    const created: TagOption = {
      id: crypto.randomUUID(),
      label: text,
    };

    setAvailableTags((prev) => [...prev, created]);

    onChange([...value, created]);

    setNewTag("");
    setCreating(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex flex-col gap-2.5", className)}
    >
      {label?.trim() && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div className="relative">
        {/* Trigger */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();

              setOpen((prev) => !prev);
            }
          }}
          className={cn(
            "border-border bg-background relative flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-2 outline-none",
            "transition-colors duration-200",
            "hover:border-foreground/20",
            open && "border-custom-primary",
          )}
        >
          {/* Selected Tags */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {value.length === 0 && (
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
            )}

            {value.map((tag) => (
              <div
                key={tag.id}
                lang={lang}
                className="border-custom-primary/20 bg-custom-primary/[0.06] text-foreground flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs"
              >
                <span className="max-w-[180px] truncate">{tag.label}</span>

                <button
                  type="button"
                  aria-label={`Remove ${tag.label}`}
                  onClick={(event) => {
                    event.stopPropagation();

                    removeTag(tag.id);
                  }}
                  className="text-muted-foreground hover:text-destructive flex cursor-pointer items-center justify-center transition-colors"
                >
                  <X className="size-3.5" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>

          <ChevronDown
            className={cn(
              "ms-3 size-4 shrink-0 transition-[transform,color] duration-200",
              open ? "text-custom-primary rotate-180" : "text-muted-foreground",
            )}
            strokeWidth={1.7}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="border-border bg-background absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border shadow-xl">
            <ScrollArea
              dir={locale === "fa" ? "rtl" : "ltr"}
              data-lenis-prevent
              className="h-52"
            >
              <div className="flex flex-col p-2">
                {availableTags.map((tag) => {
                  const selected = isSelected(tag);

                  return (
                    <button
                      lang={lang}
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                        selected
                          ? "bg-custom-primary/8 text-foreground"
                          : "text-muted-foreground hover:bg-secondary-bg hover:text-foreground",
                      )}
                    >
                      <span className="truncate">{tag.label}</span>

                      <Check
                        className={cn(
                          "size-4 shrink-0 transition-opacity duration-200",
                          selected
                            ? "text-custom-primary opacity-100"
                            : "opacity-0",
                        )}
                        strokeWidth={1.8}
                      />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Create Tag */}
            <div className="border-border border-t p-2">
              {!creating ? (
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="text-custom-primary hover:bg-custom-primary/[0.06] flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors"
                >
                  <Plus className="size-4" strokeWidth={1.7} />

                  {t("forms.parentNews.createTag")}
                </button>
              ) : (
                <div className="space-y-3 p-1">
                  <input
                    lang={lang}
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();

                        createTag();
                      }

                      if (event.key === "Escape") {
                        setCreating(false);
                        setNewTag("");
                      }
                    }}
                    autoFocus
                    placeholder={t("forms.parentNews.tagNamePlaceholder")}
                    className="border-border bg-background text-foreground focus:border-custom-primary h-11 w-full rounded-lg border px-3 text-sm transition-colors outline-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(false);
                        setNewTag("");
                      }}
                      className="border-border text-muted-foreground hover:bg-secondary-bg hover:text-foreground cursor-pointer rounded-lg border px-4 py-2 text-xs transition-colors"
                    >
                      {t("forms.parentNews.cancel")}
                    </button>

                    <button
                      type="button"
                      onClick={createTag}
                      disabled={!newTag.trim()}
                      className={cn(
                        "bg-custom-primary rounded-lg px-4 py-2 text-xs font-semibold text-white transition-opacity",
                        !newTag.trim()
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer hover:opacity-90",
                      )}
                    >
                      {t("forms.parentNews.save")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
