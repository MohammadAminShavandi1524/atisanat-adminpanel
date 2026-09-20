"use client";

import { type ChangeEvent, type DragEvent, useEffect, useRef } from "react";

import { ExternalLink, FileText, UploadCloud, X } from "lucide-react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton } from "@/components/ui/custom-button";

interface EditChartPdfUploadFieldProps {
  value?: File;

  existingFileUrl: string;

  onChange: (file?: File) => void;

  error?: string;

  progress: number;

  isUploading: boolean;

  isFinalizing: boolean;

  disabled?: boolean;
}

const EditChartPdfUploadField = ({
  value,
  existingFileUrl,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
  disabled = false,
}: EditChartPdfUploadFieldProps) => {
  const t = useTranslations("editStandardTableChild");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  const handleFile = (file?: File) => {
    if (!file || disabled) {
      return;
    }

    onChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    if (disabled) {
      return;
    }

    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showProgress = isUploading && (progress > 0 || isFinalizing);

  return (
    <div>
      <div className="mb-2.5 flex min-h-5 items-center justify-between gap-3 px-1">
        <label className="text-foreground text-[14px] font-semibold">
          {t("form.file.label")}
        </label>

        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />

      {!value ? (
        <div className="border-border bg-secondary-bg/25 rounded-xl border p-5">
          <div className="flex items-center gap-4">
            <div className="border-border bg-background flex size-12 shrink-0 items-center justify-center rounded-xl border">
              <FileText
                size={21}
                strokeWidth={1.6}
                className="text-custom-primary"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground text-[14px] font-medium">
                {t("form.file.currentFile")}
              </p>

              <span className="text-muted-foreground mt-1 block text-xs">
                PDF
              </span>
            </div>

            <CustomButton
              type="button"
              variant="outline"
              intent="secondary"
              onClick={() =>
                window.open(existingFileUrl, "_blank", "noopener,noreferrer")
              }
              rightSection={
                <ExternalLink
                  className="3xl:size-[15px] size-3.5"
                  strokeWidth={1.8}
                />
              }
              className="3xl:h-10 3xl:min-w-[88px] 3xl:text-sm h-10 min-w-[88px] px-3.5 text-sm xl:h-9 xl:min-w-[78px] xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:min-w-[82px] 2xl:text-[13px]"
            >
              {t("form.file.view")}
            </CustomButton>
          </div>

          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={() => {
              if (!disabled) {
                inputRef.current?.click();
              }
            }}
            onKeyDown={(event) => {
              if (disabled || (event.key !== "Enter" && event.key !== " ")) {
                return;
              }

              inputRef.current?.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className={cn(
              "border-border mt-5 flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-5 text-center transition-[border-color,background-color] duration-300",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:border-custom-primary/60 hover:bg-custom-primary/[0.025] cursor-pointer",
            )}
          >
            <UploadCloud
              size={21}
              strokeWidth={1.6}
              className="text-custom-primary"
            />

            <p className="text-foreground mt-3 text-[13px] font-medium">
              {t("form.file.replace")}
            </p>

            <span className="text-muted-foreground mt-1 text-xs">PDF</span>
          </div>
        </div>
      ) : (
        <div className="border-border bg-secondary-bg/25 rounded-xl border p-5">
          <div className="flex items-center gap-4">
            <div className="border-border bg-background flex size-12 shrink-0 items-center justify-center rounded-xl border">
              <FileText
                size={21}
                strokeWidth={1.6}
                className="text-custom-primary"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-[14px] font-medium">
                {value.name}
              </p>

              <span className="text-muted-foreground mt-1 block text-xs">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            {!isUploading && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label={t("form.file.remove")}
                className="text-muted-foreground hover:text-destructive flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            )}
          </div>

          {showProgress && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">
                  {isFinalizing
                    ? t("form.file.finalizing")
                    : t("form.file.uploading")}
                </span>

                <span className="text-muted-foreground text-xs">
                  {progress}%
                </span>
              </div>

              <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-custom-primary h-full transition-[width] duration-200"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditChartPdfUploadField;
