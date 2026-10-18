import { type Locale } from "next-intl";
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
    <div className="bg-background 3xl:py-10 relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-5 xl:px-5 xl:py-7 2xl:py-8">
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
