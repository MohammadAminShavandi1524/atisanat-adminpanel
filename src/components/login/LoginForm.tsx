"use client";

import { useEffect, useMemo, useRef } from "react";

import { LogIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton } from "@/components/ui/custom-button";

import { FormField } from "../FormField";

import { login } from "./auth.api";
import { createLoginSchema, type LoginFormValues } from "./login.schema";

gsap.registerPlugin(useGSAP);

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

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".login-card",
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
        },
      );

      timeline.fromTo(
        ".login-heading",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.4",
      );

      timeline.fromTo(
        ".login-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.65,
          transformOrigin: isRTL ? "right center" : "left center",
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".login-field",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".login-submit",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.15",
      );

      timeline.fromTo(
        ".login-footer",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.45,
        },
        "-=0.15",
      );
    },
    {
      scope: containerRef,
      dependencies: [isRTL],
    },
  );

  useEffect(() => {
    if (!errorRef.current) return;

    if (errors.root?.message) {
      gsap.fromTo(
        errorRef.current,
        {
          height: 0,
          opacity: 0,
          y: -6,
          marginTop: 0,
        },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          marginTop: 20,
          duration: 0.4,
          ease: "power3.out",
        },
      );

      return;
    }

    gsap.to(errorRef.current, {
      height: 0,
      opacity: 0,
      y: -6,
      marginTop: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [errors.root?.message]);

  return (
    <div
      ref={containerRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-10 w-full max-w-[430px]"
    >
      <div className="login-card border-border bg-background overflow-hidden rounded-lg border p-8 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
        {/* Heading */}
        <div className="login-heading relative mb-8 pb-6">
          <h1 className="text-foreground text-[24px] leading-[1.3] font-semibold ">
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
          className="space-y-5"
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
                className="border-destructive/30 bg-destructive/5 border px-4 py-3"
              >
                <p className="text-destructive text-[13px] leading-5">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="login-submit pt-2">
            <CustomButton
              type="submit"
              intent="primary"
              variant="solid"
              size="lg"
              loading={isSubmitting}
              leftSection={<LogIn size={18} strokeWidth={1.8} />}
              className="h-[50px] w-full rounded-md text-[15px]"
            >
              {t("submit")}
            </CustomButton>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer border-border mt-7 border-t pt-5">
          <p className="text-muted-foreground text-center text-xs leading-5">
            {t("restricted")}
          </p>
        </div>
      </div>
    </div>
  );
}
