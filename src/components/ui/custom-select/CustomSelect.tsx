"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../scroll-area";
import CustomSelectItem from "./CustomSelectItem";
import { CustomSelectProps } from "./types";

const CustomSelect = <T extends string>({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className,
  labelClassName,
  triggerClassName,
  dropdownClassName,
}: CustomSelectProps<T> & { error?: FieldError }) => {
  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      {/* Label */}
      {(label?.trim() || error) && (
        <div className="flex min-h-5 items-center justify-between gap-2 px-1">
          {label?.trim() && (
            <label
              className={cn(
                "text-foreground text-[14px] font-semibold",
                labelClassName,
              )}
            >
              {label}
            </label>
          )}

          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}

      {/* Select */}
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "bg-background text-foreground relative flex h-13 w-full cursor-pointer items-center justify-between rounded-lg border px-4 text-[14px] outline-none",
            "transition-[border-color,background-color] duration-300",
            "hover:border-foreground/20",

            error
              ? "border-destructive"
              : open
                ? "border-custom-primary"
                : "border-border",

            disabled && "cursor-not-allowed opacity-50",
            triggerClassName,
          )}
        >
          <span
            className={cn(
              "min-w-0 truncate",
              selectedOption ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <ChevronDown
            className={cn(
              "ms-4 size-4 shrink-0 transition-[transform,color] duration-200",
              open ? "text-custom-primary rotate-180" : "text-muted-foreground",
            )}
            strokeWidth={1.7}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            role="listbox"
            className={cn(
              "border-border bg-background absolute z-50 mt-2 w-full overflow-hidden rounded-lg border shadow-xl",
              dropdownClassName,
            )}
          >
            <ScrollArea
              data-lenis-prevent
              dir={locale === "en" ? "ltr" : "rtl"}
              className={cn("h-auto", options.length > 5 && "h-64")}
            >
              <div className="flex flex-col p-2">
                {options.map((option) => (
                  <CustomSelectItem
                    key={option.value}
                    option={option}
                    selected={option.value === value}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue as T);

                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
