"use client";

import { useMemo, useRef } from "react";

import { LogIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CustomButton } from "@/components/ui/custom-button";

import { FormField } from "../FormField";

import { login } from "./auth.api";
import { createLoginSchema, type LoginFormValues } from "./login.schema";

import { useLoginAnimation } from "./useLoginAnimation";

export default function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("Login");

  const isRTL = locale === "fa";

  const containerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        passwordRequired: t("validation.passwordRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLoginAnimation({
    containerRef,
    errorRef,
    isRTL,
    errorMessage: errors.root?.message,
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      clearErrors("root");

      await login({
        email: data.email,
        password: data.password,
      });

      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError("root", {
        type: "server",
        message: t("invalidCredentials"),
      });
    }
  };

  return (
    <div
      ref={containerRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="3xl:max-w-[430px] relative z-10 w-full max-w-[390px] xl:max-w-[405px] 2xl:max-w-[420px]"
    >
      <div className="login-card border-border bg-background 3xl:p-8 overflow-hidden rounded-lg border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] xl:p-6 2xl:p-7">
        {/* Heading */}
        <div className="login-heading 3xl:mb-8 3xl:pb-6 relative mb-5 pb-4 xl:mb-6 xl:pb-5 2xl:mb-7">
          <h1 className="text-foreground 3xl:text-[24px] text-[20px] leading-[1.3] font-semibold xl:text-[21px] 2xl:text-[23px]">
            {t("title")}
          </h1>

          {/* <p className="text-muted-foreground mt-2 text-[14px] leading-6">
            {t("description")}
          </p> */}

          <div className="login-line bg-border absolute inset-x-0 bottom-0 h-px" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="3xl:space-y-5 space-y-4 2xl:space-y-4.5"
        >
          <div className="login-field">
            <FormField
              label={t("email")}
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              register={register("email")}
              error={errors.email}
            />
          </div>

          <div className="login-field">
            <FormField
              label={t("password")}
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              register={register("password")}
              error={errors.password}
            />
          </div>

          {/* Server Error */}
          <div ref={errorRef} className="h-0 overflow-hidden opacity-0">
            {errors.root?.message && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/5 rounded-lg border px-4 py-3"
              >
                <p className="text-destructive text-[13px] leading-5">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="login-submit 3xl:pt-2 pt-1.5">
            <CustomButton
              type="submit"
              intent="primary"
              variant="solid"
              size="lg"
              loading={isSubmitting}
              leftSection={<LogIn size={18} strokeWidth={1.8} />}
              className="3xl:h-[50px] 3xl:text-[15px] h-11 w-full cursor-pointer rounded-md text-[13px] disabled:cursor-not-allowed xl:h-11.5 xl:text-[14px]"
            >
              {t("submit")}
            </CustomButton>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer border-border 3xl:mt-7 3xl:pt-5 mt-5 border-t pt-4 2xl:mt-6">
          <p className="text-muted-foreground text-center text-xs leading-5">
            {t("restricted")}
          </p>
        </div>
      </div>
    </div>
  );
}
