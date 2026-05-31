import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { BookingSection } from "@/components/abraj/BookingSection";
import { translations, type Lang } from "@/components/abraj/translations";
import type { Theme } from "@/components/abraj/AbrajSite";
import logoWhite from "@/assets/abraj-logo-white.png";
import logoBlack from "@/assets/abraj-logo-black.png";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "حجز استشارة — أبراج الماس | Book a Consultation — ABRAJ ALMAS" },
      { name: "description", content: "احجز استشارتك المجانية مع أبراج الماس. نقدم حلول الشبكات، CCTV، البرمجيات المؤسسية، والجهد المنخفض." },
    ],
  }),
  component: BookingPage,
});

const tc = (theme: Theme, night: string, day: string) =>
  theme === "night" ? night : day;

function BookingPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("abraj-theme");
      if (saved === "day" || saved === "night") return saved;
    }
    return "night";
  });
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("abraj-lang");
      if (saved === "ar" || saved === "en") return saved;
    }
    return "ar";
  });

  const t = translations[lang];
  const isAr = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("abraj-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("abraj-lang", lang);
    }
  }, [lang]);

  return (
    <div
      dir={t.dir}
      className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen`}
    >
      {/* Top bar */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16 border-b backdrop-blur-xl ${tc(theme, "bg-black/70 border-white/8", "bg-white/80 border-[#1d3fba]/10")}`}
      >
        {/* Back link */}
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 ${tc(theme, "text-white/80", "text-[#3d4451]")}`}
        >
          {isAr ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          {isAr ? "الرئيسية" : "Home"}
        </Link>

        {/* Logo */}
        <img
          src={theme === "night" ? logoWhite : logoBlack}
          alt="Abraj Almas"
          className="h-8 w-auto"
        />

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#111111] hover:bg-[#e6eaf5]")}`}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "night" ? "day" : "night")}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#3d4451] hover:bg-[#e6eaf5]")}`}
            aria-label="Toggle theme"
          >
            {theme === "night" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      <BookingSection lang={lang} theme={theme} standalone />
    </div>
  );
}
