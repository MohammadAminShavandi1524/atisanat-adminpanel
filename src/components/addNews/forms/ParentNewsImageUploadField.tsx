"use client";

import { ImagePlus, X } from "lucide-react";

import { useTranslations } from "next-intl";

interface ParentNewsImageUploadFieldProps {
  value?: File;
  onChange: (file?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  isFinalizing: boolean;
}

export default function ParentNewsImageUploadField({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
}: ParentNewsImageUploadFieldProps) {
  const t = useTranslations("addNews");

  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-medium xl:text-[13px] 2xl:text-sm">
        {t("forms.parentNews.featuredImage")}
      </label>

      <div className="border-border bg-secondary-bg/40 3xl:min-h-[150px] 3xl:p-5 relative min-h-[150px] overflow-hidden rounded-xl border p-5 xl:min-h-[130px] xl:p-4 2xl:min-h-[140px] 2xl:p-4.5">
        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];

            onChange(file);

            event.target.value = "";
          }}
          className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        <div className="3xl:min-h-[110px] flex h-full min-h-[110px] flex-col items-center justify-center text-center xl:min-h-[96px] 2xl:min-h-[102px]">
          <div className="border-border bg-background flex size-10 items-center justify-center rounded-xl border">
            <ImagePlus
              className="text-custom-primary size-5"
              strokeWidth={1.6}
            />
          </div>

          {value ? (
            <>
              <p className="text-foreground 3xl:mt-3 3xl:text-sm mt-3 max-w-full truncate text-sm font-medium xl:mt-2.5 xl:text-[13px]">
                {value.name}
              </p>

              <p className="text-muted-foreground 3xl:text-xs mt-1 text-xs xl:text-[11px]">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-foreground 3xl:mt-3 3xl:text-sm mt-3 text-sm font-medium xl:mt-2.5 xl:text-[13px]">
                {t("forms.parentNews.featuredImagePlaceholder")}
              </p>

              <p className="text-muted-foreground 3xl:text-xs mt-1 text-xs xl:text-[11px]">
                JPG, PNG, WEBP
              </p>
            </>
          )}
        </div>

        {value && !isUploading && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              onChange(undefined);
            }}
            className="text-muted-foreground hover:bg-background hover:text-destructive absolute end-3 top-3 z-20 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors xl:end-2.5 xl:top-2.5"
          >
            <X className="size-4" strokeWidth={1.7} />
          </button>
        )}
      </div>

      {isUploading && (
        <div className="3xl:mt-3 mt-3 xl:mt-2.5">
          <div className="bg-border-secondary h-1 overflow-hidden rounded-full">
            <div
              className="bg-custom-primary h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="text-muted-foreground 3xl:text-xs mt-2 flex items-center justify-between text-xs xl:text-[11px]">
            <span>
              {isFinalizing
                ? t("forms.parentNews.imageFinalizing")
                : t("forms.parentNews.imageUploading")}
            </span>

            <span>{progress}%</span>
          </div>
        </div>
      )}

      <div className="mt-2 min-h-5">
        {error && (
          <p className="text-destructive 3xl:text-xs text-xs xl:text-[11px]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
