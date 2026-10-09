"use client";

import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

import { cn } from "@/lib/utils";

export function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group border-border bg-background relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border",
        "shadow-[0_2px_8px_rgba(32,43,58,0.05)]",
        "transition-all duration-300",
        "hover:border-custom-primary/50 hover:bg-secondary-bg hover:shadow-[0_6px_18px_rgba(20,88,150,0.10)]",
        "active:scale-[0.97]",
      )}
    >
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <Sun
            strokeWidth={1.7}
            className="3xl:size-6 size-6 transition-[color,stroke-width] duration-300 xl:size-5"
          />
        ) : (
          <Moon
            strokeWidth={1.7}
            className="3xl:size-6 size-6 transition-[color,stroke-width] duration-300 xl:size-5"
          />
        )}
      </span>

      {/* <span
        className={cn(
          "bg-custom-primary pointer-events-none absolute bottom-0 left-1/2",
          "h-px w-0 -translate-x-1/2",
          "transition-all duration-300",
          "group-hover:w-1/2",
        )}
      /> */}
    </button>
  );
}
