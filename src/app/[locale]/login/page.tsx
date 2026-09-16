import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import LoginForm from "@/components/login/LoginForm";
import { RetroGrid } from "@/components/ui/retro-grid";

interface LoginPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <RetroGrid
        angle={65}
        cellSize={60}
        opacity={0.42}
        lightLineColor="var(--border-secondary)"
        darkLineColor="var(--border-secondary)"
      />

      <LoginForm />
    </div>
  );
}
