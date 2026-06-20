import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft, ArrowRight, Home as HomeIcon, AppWindow, Sparkles, Building2, MessageCircle } from "lucide-react";
import { translations, type Lang } from "@/components/abraj/translations";
import { PartnersMarquee, type Theme } from "@/components/abraj/AbrajSite";
import { supabase, isSupabaseConfigured, type DbPartner } from "@/lib/supabase";
import logoWhite from "@/assets/abraj-logo-white.png";
import logoBlack from "@/assets/abraj-logo-black.png";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "شركاؤنا — أبراج الماس | Our Partners — ABRAJ ALMAS" },
      { name: "description", content: "تعرف على شبكة شركاء أبراج الماس من الشركات الرائدة والموردين المعتمدين في مجالات الشبكات وأنظمة المراقبة والاتصالات." },
    ],
  }),
  component: PartnersPage,
});

const tc = (theme: Theme, night: string, day: string) =>
  theme === "night" ? night : day;

function PartnersPage() {
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
  const [dynPartners, setDynPartners] = useState<DbPartner[] | null>(null);

  const t = translations[lang];
  const isAr = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("abraj-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("abraj-lang", lang);
  }, [lang]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase
      .from("partners")
      .select("*")
      .order("order_num")
      .then(({ data }) => {
        if (data?.length) setDynPartners(data as DbPartner[]);
      });
  }, []);

  return (
    <div
      dir={t.dir}
      className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen pb-20`}
    >
      {/* Top bar */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16 border-b backdrop-blur-xl ${tc(theme, "bg-black/70 border-white/8", "bg-white/80 border-[#1d3fba]/10")}`}
      >
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 ${tc(theme, "text-white/80", "text-[#3d4451]")}`}
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isAr ? "الرئيسية" : "Home"}
        </Link>

        <img src={theme === "night" ? logoWhite : logoBlack} alt="Abraj Almas" loading="eager" decoding="async" className="h-8 w-auto" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#111111] hover:bg-[#e6eaf5]")}`}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <button
            onClick={() => setTheme(theme === "night" ? "day" : "night")}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#3d4451] hover:bg-[#e6eaf5]")}`}
            aria-label="Toggle theme"
          >
            {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <PartnersMarquee lang={lang} theme={theme} dynPartners={dynPartners} />

      {/* Mobile bottom nav */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-2xl ${tc(theme, "bg-[#0a0a0a]/92 border-white/8", "bg-white/95 border-[#1d3fba]/10")}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-end justify-around w-full px-1 pt-2 pb-1">
          {([
            { id: "home",     icon: HomeIcon,      label: isAr ? "الرئيسية" : "Home",     href: "/",          cta: false },
            { id: "services", icon: AppWindow,     label: isAr ? "الخدمات"  : "Services", href: "/#services", cta: false },
            { id: "booking",  icon: Sparkles,      label: isAr ? "احجز"     : "Book",     href: "/booking",   cta: true  },
            { id: "projects", icon: Building2,     label: isAr ? "المشاريع" : "Projects", href: "/projects",  cta: false },
            { id: "contact",  icon: MessageCircle, label: isAr ? "تواصل"    : "Contact",  href: "/#contact",  cta: false },
          ] as const).map(({ id, icon: Icon, label, href, cta }) =>
            cta ? (
              <a key={id} href={href} className="flex flex-col items-center -translate-y-3">
                <span className="w-14 h-14 rounded-full bg-[#1d3fba] flex items-center justify-center text-white shadow-xl shadow-[#1d3fba]/40 blue-glow">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[9px] mt-0.5 font-bold text-[#1d3fba]">{label}</span>
              </a>
            ) : (
              <a key={id} href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors active:scale-95 ${tc(theme, "text-white/40 hover:text-white", "text-[#8a95a8] hover:text-[#1d3fba]")}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{label}</span>
              </a>
            )
          )}
        </div>
      </nav>
    </div>
  );
}
