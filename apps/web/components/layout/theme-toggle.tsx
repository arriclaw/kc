"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ThemeMode = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("hdv-theme") as ThemeMode | null) || "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("light", stored === "light");
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("hdv-theme", next);
  }

  if (!ready) return null;

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="h-[42px] w-[42px] rounded-xl"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
