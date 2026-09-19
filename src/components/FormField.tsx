"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  containerClassName?: string;
  error?: FieldError;
  register?: UseFormRegisterReturn;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface TextareaProps
  extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type FormFieldProps = InputProps | TextareaProps;

export const FormField = (props: FormFieldProps) => {
  const {
    label,
    containerClassName,
    error,
    register,
    as = "input",
    ...rest
  } = props;

  const lang = rest.lang;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <div className="flex min-h-5 items-center justify-between gap-2 px-1">
        <label className="text-foreground text-[14px] font-semibold">
          {label}
        </label>

        {error && <p className="text-destructive text-xs">{error.message}</p>}
      </div>

      {as === "textarea" ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...register}
          className={cn(
            "bg-secondary-bg text-foreground placeholder:text-muted-foreground",
            "h-40 w-full resize-none rounded-lg border px-4 py-3.5 text-[14px]",
            "transition-[border-color,background-color] duration-300 outline-none",

            lang === "en" && "text-left",
            lang === "fa" && "text-right",

            error
              ? "border-destructive focus:border-destructive"
              : "border-border focus:border-custom-primary",
          )}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          {...register}
          className={cn(
            "bg-secondary-bg text-foreground placeholder:text-muted-foreground",
            "h-13 w-full rounded-lg border px-4 text-[14px]",
            "transition-[border-color,background-color] duration-300 outline-none",

            lang === "en" && "text-left",
            lang === "fa" && "text-right",

            error
              ? "border-destructive focus:border-destructive"
              : "border-border focus:border-custom-primary",
          )}
        />
      )}
    </div>
  );
};
