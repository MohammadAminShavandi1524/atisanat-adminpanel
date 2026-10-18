"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { ImageIcon, UploadCloud, X } from "lucide-react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface ProductImageUploadFieldProps {
  value?: File;
  onChange: (file?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  isFinalizing: boolean;
  disabled?: boolean;
}

const ProductImageUploadField = ({
  value,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
  disabled = false,
}: ProductImageUploadFieldProps) => {
  const t = useTranslations("addProduct");

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);

      return;
    }

    const url = URL.createObjectURL(value);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
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
    <div className="min-w-0">
      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
        <label className="text-foreground 3xl:text-[14px] text-[12px] font-semibold xl:text-[13px]">
          {t("form.image.label")}
        </label>

        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="3xl:grid-cols-[220px_minmax(0,1fr)] 3xl:gap-5 grid min-w-0 grid-cols-1 items-stretch gap-3 xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-4 2xl:grid-cols-[200px_minmax(0,1fr)]">
        {/* Image Preview */}
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

            event.preventDefault();
            inputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={handleDrop}
          className={cn(
            "border-border bg-secondary-bg/25 3xl:min-h-[250px] relative h-full min-h-[180px] min-w-0 overflow-hidden rounded-xl border border-dashed transition-[border-color,background-color] duration-300 xl:min-h-[210px] 2xl:min-h-[230px]",
            disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:border-custom-primary/60 hover:bg-custom-primary/[0.025] cursor-pointer",
          )}
        >
          {!previewUrl ? (
            <div className="3xl:px-5 absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <div className="border-border bg-background 3xl:size-12 flex size-10 items-center justify-center rounded-xl border xl:size-11">
                <UploadCloud
                  strokeWidth={1.6}
                  className="text-custom-primary 3xl:size-[22px] size-5"
                />
              </div>

              <p className="text-foreground 3xl:mt-4 3xl:text-[14px] mt-3 text-[12px] font-medium xl:text-[13px]">
                {t("form.image.placeholder")}
              </p>

              <span className="text-muted-foreground mt-2 text-xs">
                JPG, JPEG, PNG, WEBP
              </span>
            </div>
          ) : (
            <>
              <img
                src={previewUrl}
                alt={value?.name ?? ""}
                className="size-full object-cover"
              />

              {!disabled && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    handleRemove();
                  }}
                  aria-label={t("form.image.remove")}
                  className="border-border bg-background text-muted-foreground hover:text-destructive absolute end-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-300"
                >
                  <X size={18} strokeWidth={1.7} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Image Information */}
        <div className="border-border bg-secondary-bg/25 3xl:min-h-[250px] 3xl:p-5 flex min-h-[180px] min-w-0 flex-col justify-between rounded-xl border p-3.5 xl:min-h-[210px] xl:p-4 2xl:min-h-[230px]">
          <div>
            <div className="border-border bg-background 3xl:size-11 flex size-9 items-center justify-center rounded-lg border xl:size-10">
              <ImageIcon
                className="text-custom-primary 3xl:size-5 size-4 xl:size-[18px]"
                strokeWidth={1.6}
              />
            </div>

            <h3 className="text-foreground 3xl:mt-4 3xl:text-sm mt-3 text-[12px] font-semibold xl:text-[13px]">
              {t("form.image.title")}
            </h3>

            <p className="text-muted-foreground 3xl:text-[13px] 3xl:leading-6 mt-2 max-w-lg text-[12px] leading-5">
              {t("form.image.description")}
            </p>

            <div className="border-border 3xl:mt-5 3xl:pt-4 mt-3 border-t pt-3">
              <div className="text-muted-foreground space-y-1.5 text-xs">
                <p>{t("form.image.format")}</p>

                <p>{t("form.image.maxSize")}</p>

                <p>{t("form.image.ratio")}</p>
              </div>
            </div>
          </div>

          {value && (
            <div className="border-border mt-5 border-t pt-4">
              <p className="text-foreground truncate text-[13px] font-medium">
                {value.name}
              </p>

              <span className="text-muted-foreground mt-1 block text-xs">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          {showProgress && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">
                  {isFinalizing
                    ? t("form.image.finalizing")
                    : t("form.image.uploading")}
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
      </div>
    </div>
  );
};

export default ProductImageUploadField;
