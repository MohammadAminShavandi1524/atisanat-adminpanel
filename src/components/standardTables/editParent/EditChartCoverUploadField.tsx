"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface EditChartCoverUploadFieldProps {
  value?: File;

  existingImageUrl: string;

  onChange: (file?: File) => void;

  error?: string;

  progress: number;

  isUploading: boolean;

  isFinalizing: boolean;

  disabled?: boolean;
}

const EditChartCoverUploadField = ({
  value,
  existingImageUrl,
  onChange,
  error,
  progress,
  isUploading,
  isFinalizing,
  disabled = false,
}: EditChartCoverUploadFieldProps) => {
  const t = useTranslations(
    "editStandardTableParent",
  );

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);

      return;
    }

    const url =
      URL.createObjectURL(value);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const displayImage =
    previewUrl || existingImageUrl;

  const handleFile = (file?: File) => {
    if (!file || disabled) {
      return;
    }

    onChange(file);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    handleFile(
      event.target.files?.[0],
    );
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    handleFile(
      event.dataTransfer.files?.[0],
    );
  };

  const handleRemoveNewFile = () => {
    if (disabled) {
      return;
    }

    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showProgress =
    isUploading &&
    (progress > 0 || isFinalizing);

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
        <label className="text-foreground text-[14px] font-semibold">
          {t("form.image.label")}
        </label>

        {error && (
          <span className="text-destructive text-xs">
            {error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={(event) => {
            if (
              disabled ||
              (event.key !== "Enter" &&
                event.key !== " ")
            ) {
              return;
            }

            inputRef.current?.click();
          }}
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          className={cn(
            "border-border bg-secondary-bg/25 relative aspect-[210/297] overflow-hidden rounded-xl border border-dashed transition-[border-color,background-color] duration-300",
            disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:border-custom-primary/60 hover:bg-custom-primary/[0.025] cursor-pointer",
          )}
        >
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={value?.name ?? ""}
                className="size-full object-cover"
              />

              {value && !disabled && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    handleRemoveNewFile();
                  }}
                  aria-label={t(
                    "form.image.remove",
                  )}
                  className="border-border bg-background text-muted-foreground hover:text-destructive absolute end-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-300"
                >
                  <X
                    size={18}
                    strokeWidth={1.7}
                  />
                </button>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <div className="border-border bg-background flex size-12 items-center justify-center rounded-xl border">
                <UploadCloud
                  size={22}
                  strokeWidth={1.6}
                  className="text-custom-primary"
                />
              </div>

              <p className="text-foreground mt-4 text-[14px] font-medium">
                {t(
                  "form.image.placeholder",
                )}
              </p>

              <span className="text-muted-foreground mt-2 text-xs">
                JPG, JPEG, PNG, WEBP
              </span>
            </div>
          )}
        </div>

        <div className="border-border bg-secondary-bg/25 flex min-h-0 flex-col justify-between rounded-xl border p-5">
          <div>
            <div className="border-border bg-background flex size-11 items-center justify-center rounded-lg border">
              <ImageIcon
                className="text-custom-primary size-5"
                strokeWidth={1.6}
              />
            </div>

            <h3 className="text-foreground mt-4 text-sm font-semibold">
              {t("form.image.title")}
            </h3>

            <p className="text-muted-foreground mt-2 max-w-lg text-[13px] leading-6">
              {t(
                "form.image.description",
              )}
            </p>

            <div className="border-border mt-5 border-t pt-4">
              <div className="text-muted-foreground space-y-1.5 text-xs">
                <p>
                  {t(
                    "form.image.format",
                  )}
                </p>

                <p>
                  {t(
                    "form.image.maxSize",
                  )}
                </p>

                <p>
                  {t(
                    "form.image.ratio",
                  )}
                </p>
              </div>
            </div>
          </div>

          {value && (
            <div className="border-border mt-5 border-t pt-4">
              <p className="text-foreground truncate text-[13px] font-medium">
                {value.name}
              </p>

              <span className="text-muted-foreground mt-1 block text-xs">
                {(
                  value.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </span>
            </div>
          )}

          {showProgress && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">
                  {isFinalizing
                    ? t(
                        "form.image.finalizing",
                      )
                    : t(
                        "form.image.uploading",
                      )}
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

export default EditChartCoverUploadField;