import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Menu, X, Network, Wrench, Camera, Cpu, Cable, AppWindow, Compass, Wifi,
  Phone, Mail, Globe, MapPin, MessageCircle, ChevronRight, Diamond,
  ShieldCheck, Zap, Gem, Headphones, Users, Building2, Store, Warehouse,
  Hotel, School, Landmark, Home as HomeIcon, Server, ArrowUpRight, Sparkles,
  Moon, Sun,
} from "lucide-react";
import logoHorizontal from "@/assets/abraj-logo-horizontal.png";
import logoSymbol from "@/assets/abraj-logo-symbol.png";
import logoWhite from "@/assets/abraj-logo-white.png";
import logoBlack from "@/assets/abraj-logo-black.png";
import logoDay from "@/assets/abraj-logo-day.png";
import logoNight from "@/assets/abraj-logo-night.png";
import { translations, PARTNERS, PHONES, WA_NUMBER, EMAIL, WEBSITE, type Lang } from "./translations";
import { supabase, isSupabaseConfigured, type DbService, type DbProject, type DbPartner } from "@/lib/supabase";

export type Theme = "night" | "day";
/** Returns night class or day class based on current theme */
const tc = (theme: Theme, night: string, day: string) => (theme === "night" ? night : day);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
/** Premium headline blur-reveal — used for major headings */
const blurReveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const SERVICE_ICONS = [Network, Wrench, Camera, Cpu, Cable, AppWindow, Compass, Wifi, HomeIcon];
const WHY_ICONS = [ShieldCheck, Zap, Gem, Headphones, Users];
const BIZ_ICONS = [Building2, Store, Warehouse, Hotel, School, Landmark, HomeIcon, Server];

/** Brand meta for each partner: initials + accent color */
const PARTNER_META: Record<string, { initials: string; color: string; bg: string }> = {
  Cisco:     { initials: "CI", color: "#1ba0d7", bg: "rgba(27,160,215,0.12)" },
  MikroTik:  { initials: "MK", color: "#e03a2f", bg: "rgba(224,58,47,0.12)" },
  Tenda:     { initials: "TD", color: "#0071c5", bg: "rgba(0,113,197,0.12)" },
  "TP-Link": { initials: "TP", color: "#109a0d", bg: "rgba(16,154,13,0.12)" },
  Finder:    { initials: "FD", color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  Aswar:     { initials: "AW", color: "#1d3fba", bg: "rgba(29,63,186,0.12)" },
  Dahua:     { initials: "DH", color: "#c0392b", bg: "rgba(192,57,43,0.12)" },
  Televes:   { initials: "TV", color: "#8e44ad", bg: "rgba(142,68,173,0.12)" },
  Hikvision: { initials: "HK", color: "#e74c3c", bg: "rgba(231,76,60,0.12)" },
  Morrell:   { initials: "MR", color: "#2980b9", bg: "rgba(41,128,185,0.12)" },
};

export default function AbrajSite() {
  const [lang, setLang] = useState<Lang>("ar");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("abraj-theme");
      if (saved === "day" || saved === "night") return saved;
    }
    return "night";
  });
  const [isLoading, setIsLoading] = useState(true);
  const [langKey, setLangKey] = useState(0);
  const t = translations[lang];
  const isAr = lang === "ar";

  // Dynamic data loaded from Supabase (falls back to static data if not available)
  const [dynServices, setDynServices] = useState<DbService[] | null>(null);
  const [dynProjects, setDynProjects] = useState<DbProject[] | null>(null);
  const [dynPartners, setDynPartners] = useState<DbPartner[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    Promise.all([
      supabase.from("services").select("*").order("order_num"),
      supabase.from("projects").select("*").order("order_num"),
      supabase.from("partners").select("*").order("order_num"),
    ]).then(([srv, prj, prt]) => {
      if (srv.data?.length) setDynServices(srv.data as DbService[]);
      if (prj.data?.length) setDynProjects(prj.data as DbProject[]);
      if (prt.data?.length) setDynPartners(prt.data as DbPartner[]);
    }).catch(() => { /* silent – use static fallback */ });
  }, []);

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
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const handleSetLang = (l: Lang) => {
    setLangKey((k) => k + 1);
    setLang(l);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <IntroLoader lang={lang} />}
      </AnimatePresence>
      <motion.div
        key={`${langKey}-${theme}`}
        initial={{ opacity: 0.85, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        dir={t.dir}
        lang={lang}
        className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen overflow-x-hidden pb-20 lg:pb-0`}
      >
        <Navbar lang={lang} setLang={handleSetLang} theme={theme} setTheme={setTheme} />
        <Hero lang={lang} theme={theme} dynProjects={dynProjects} dynServices={dynServices} dynPartners={dynPartners} />
        <BrandDivider theme={theme} direction="left" />
        <AboutSection lang={lang} theme={theme} />
        <StatsStrip lang={lang} theme={theme} />
        <VisionSection lang={lang} theme={theme} />
        <WhyUsSection lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="right" />
        <ServicesSection lang={lang} theme={theme} dynServices={dynServices} />
        <ProcessSection lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="left" />
        <BusinessSolutionsSection lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="right" />
        <ContactSection lang={lang} theme={theme} />
        <Footer lang={lang} theme={theme} />
        <FloatingActions lang={lang} theme={theme} />
        {/* ── Mobile App Bottom Nav ── */}
        <nav
          className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-2xl ${tc(theme, "bg-[#0a0a0a]/92 border-white/8", "bg-white/95 border-[#1d3fba]/10")}`}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
        >
          <div className="flex items-end justify-around w-full px-1 pt-2 pb-1">
            {([
              { id: "home",     icon: HomeIcon,      label: isAr ? "الرئيسية" : "Home",     href: "#home",     cta: false },
              { id: "services", icon: AppWindow,     label: isAr ? "الخدمات"  : "Services", href: "#services", cta: false },
              { id: "booking",  icon: Sparkles,      label: isAr ? "احجز"     : "Book",     href: "/booking", cta: true  },
              { id: "projects", icon: Building2,     label: isAr ? "المشاريع" : "Projects", href: "/projects", cta: false },
              { id: "contact",  icon: MessageCircle, label: isAr ? "تواصل"    : "Contact",  href: "#contact",  cta: false },
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
      </motion.div>
    </>
  );
}

/* ---------------- Intro Loader ---------------- */
function IntroLoader({ lang }: { lang: Lang }) {
  return (
    <motion.div
      key="intro-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      {/* Orbital rings */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 rounded-full border border-[#1d3fba]/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-52 h-52 rounded-full border border-[#1d3fba]/15"
          style={{ borderTopColor: "rgba(29,63,186,0.55)", borderRightColor: "transparent" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute w-72 h-72 rounded-full border border-[#1d3fba]/08"
          style={{ borderBottomColor: "rgba(29,63,186,0.3)", borderLeftColor: "transparent" }}
        />
        {/* Blue glow pulse */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-28 h-28 rounded-full bg-[#1d3fba] blur-[50px]"
        />
        {/* Logo */}
        <motion.img
          src={logoNight}
          alt="ABRAJ ALMAS"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-24 h-24 object-contain drop-shadow-2xl"
        />
      </div>
      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 text-xs tracking-[0.25em] uppercase text-[#e9e9e9]/60 font-medium text-center px-8"
      >
        {lang === "ar" ? "جاري تجهيز البنية الرقمية..." : "Preparing Digital Infrastructure..."}
      </motion.p>
      {/* Progress line */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 w-40 h-px bg-gradient-to-r from-transparent via-[#1d3fba] to-transparent"
      />
    </motion.div>
  );
}

/* ---------------- Brand divider (smooth infinite loop) ---------------- */
function BrandDivider({
  theme,
  direction = "left",
}: {
  theme: Theme;
  direction?: "left" | "right";
}) {
  const src =
    theme === "night"
      ? "/assets/divider-dark-white.png"
      : "/assets/divider-light-blue.png";

  const xStart = direction === "left" ? -30 : 30;
  const xEnd   = direction === "left" ?  30 : -30;

  return (
    <div aria-hidden="true" className="relative w-full py-6 sm:py-10 overflow-hidden">
      <motion.img
        src={src}
        alt=""
        animate={{ x: [xStart, xEnd] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className={`block mx-auto max-w-6xl w-full h-auto select-none pointer-events-none ${tc(theme, "opacity-50", "opacity-60")}`}
        draggable={false}
      />
    </div>
  );
}

/* ---------------- Theme Toggle ---------------- */
function ThemeToggle({
  theme,
  setTheme,
  lang,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
}) {
  return (
    <div
      className={`relative flex items-center rounded-full p-1 border gap-0.5 ${
        tc(theme, "border-white/12 bg-white/[0.05]", "border-[#1d3fba]/12 bg-[#f0f2f8]")
      }`}
    >
      <button
        onClick={() => setTheme("night")}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          theme === "night"
            ? "bg-[#1d3fba] text-white shadow-md"
            : tc(theme, "text-[#e9e9e9]/60 hover:text-white/90", "text-[#5b6472] hover:text-[#3d4451]")
        }`}
        aria-label={lang === "ar" ? "الوضع الليلي" : "Night mode"}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("day")}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          theme === "day"
            ? "bg-[#1d3fba] text-white shadow-md"
            : tc(theme, "text-[#e9e9e9]/60 hover:text-white/90", "text-[#5b6472] hover:text-[#3d4451]")
        }`}
        aria-label={lang === "ar" ? "الوضع النهاري" : "Day mode"}
      >
        <Sun className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---------------- Navbar ---------------- */
export function Navbar({
  lang,
  setLang,
  theme,
  setTheme,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  const t = translations[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 20;
        setScrolled((current) => current === nextScrolled ? current : nextScrolled);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "home", label: t.home },
    { id: "about", label: t.about },
    { id: "services", label: t.services },
    { id: "jobs", label: t.jobs },
    { id: "booking", label: t.booking },
    { id: "projects", label: t.projects },
    { id: "partners", label: t.partners },
    { id: "contact", label: t.contact },
  ];

  const navStyle: React.CSSProperties = useMemo(() => ({
    background: scrolled
      ? (theme === "night" ? "rgba(5,5,5,0.95)" : "rgba(255,255,255,0.97)")
      : (theme === "night" ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)"),
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderBottom: scrolled
      ? `1px solid ${theme === "night" ? "rgba(255,255,255,0.10)" : "rgba(29,63,186,0.15)"}`
      : "none",
    boxShadow: scrolled
      ? (theme === "night" ? "0 4px 24px rgba(0,0,0,0.50)" : "0 2px 8px rgba(0,0,0,0.06)")
      : (theme === "night" ? "0 2px 12px rgba(0,0,0,0.30)" : "none"),
  }), [scrolled, theme]);

  return (
    <header key={`nav-${theme}`} style={navStyle} className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-all duration-300 ${scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"}`}>
        <a href="#home" className="flex items-center gap-2 flex-shrink-0">
          <motion.img
            src={theme === "night" ? logoWhite : logoBlack}
            alt={lang === "ar" ? "شعار شركة أبراج الماس" : "ABRAJ ALMAS Logo"}
            animate={{ height: scrolled ? 28 : 38 }}
            transition={{ duration: 0.3 }}
            className="w-auto object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.id} href={l.id === "booking" ? "/booking" : l.id === "jobs" ? "/jobs" : l.id === "projects" ? "/projects" : l.id === "partners" ? "/partners" : `#${l.id}`} className={`px-3 py-2 text-sm font-medium transition-colors hover:text-[#1d3fba] ${tc(theme, "text-white hover:text-[#4d7aff]", "text-[#3d4451]")}`} style={theme === "night" ? { textShadow: "0 1px 3px rgba(0,0,0,0.5)" } : {}}>{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} theme={theme} />
          <div className={`hidden sm:block w-px h-5 ${tc(theme, "bg-white/15", "bg-[#1d3fba]/15")}`} />
          <ThemeToggle theme={theme} setTheme={setTheme} lang={lang} />
          <div className={`hidden sm:block w-px h-5 ${tc(theme, "bg-white/15", "bg-[#1d3fba]/15")}`} />
          <a
            href="/booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1d3fba] text-white text-sm font-bold hover:brightness-110 active:scale-95 transition-all blue-glow"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {t.cta}
          </a>
          <button onClick={() => setOpen((v) => !v)} className={`lg:hidden p-2 rounded-lg border ${tc(theme, "border-white/10 text-white", "border-[#1d3fba]/20 text-[#111111]")}`} aria-label="menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden backdrop-blur-xl border-t overflow-hidden ${tc(theme, "bg-black/90 border-white/10", "bg-white/95 border-[#1d3fba]/15")}`}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <a key={l.id} href={l.id === "booking" ? "/booking" : l.id === "jobs" ? "/jobs" : l.id === "projects" ? "/projects" : l.id === "partners" ? "/partners" : `#${l.id}`} onClick={() => setOpen(false)} className={`py-2.5 px-3 rounded-lg font-medium transition-colors ${tc(theme, "text-white hover:bg-white/5", "text-[#3d4451] hover:bg-[#1d3fba]/5")}`}>{l.label}</a>
              ))}
              <div className="flex items-center gap-2 py-2 px-3">
                <LangToggle lang={lang} setLang={setLang} theme={theme} />
                <ThemeToggle theme={theme} setTheme={setTheme} lang={lang} />
              </div>
              <a href="/booking" onClick={() => setOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-[#1d3fba] text-white font-bold">{t.cta}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
  theme,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
}) {
  return (
    <div className={`flex items-center rounded-full border p-1 gap-0.5 ${tc(theme, "border-white/12 bg-white/[0.05]", "border-[#1d3fba]/12 bg-[#f0f2f8]")}`}>
      {/* Arabic — flag emoji + ع */}
      <button
        onClick={() => setLang("ar")}
        className={`flex items-center justify-center gap-1 w-9 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
          lang === "ar" ? "bg-[#1d3fba] text-white shadow-md" : tc(theme, "text-[#e9e9e9]/60 hover:text-white/90", "text-[#5b6472] hover:text-[#3d4451]")
        }`}
        aria-label="العربية"
      >
        <span className="text-base leading-none">🇮🇶</span>
      </button>
      {/* English — flag emoji */}
      <button
        onClick={() => setLang("en")}
        className={`flex items-center justify-center gap-1 w-9 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
          lang === "en" ? "bg-[#1d3fba] text-white shadow-md" : tc(theme, "text-[#e9e9e9]/60 hover:text-white/90", "text-[#5b6472] hover:text-[#3d4451]")
        }`}
        aria-label="English"
      >
        <span className="text-base leading-none">🇬🇧</span>
      </button>
    </div>
  );
}

/* ---------------- Quick Services & Projects Preview ---------------- */
function QuickPreview({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"services" | "projects">("services");
  const [projectIndex, setProjectIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const quickServices = [
    { icon: Network, title: lang === "ar" ? "تصميم الشبكات" : "Network Design", desc: lang === "ar" ? "شبكات LAN/WAN والألياف الضوئية" : "LAN/WAN & Fiber Optics" },
    { icon: Camera, title: lang === "ar" ? "أنظمة المراقبة" : "CCTV Systems", desc: lang === "ar" ? "كاميرات مراقبة ذكية" : "Smart Security Cameras" },
    { icon: Server, title: lang === "ar" ? "البنية التحتية" : "Infrastructure", desc: lang === "ar" ? "خوادم ومعدات تقنية" : "Servers & Equipment" },
    { icon: Cpu, title: lang === "ar" ? "أنظمة الجهد المنخفض" : "Low Voltage", desc: lang === "ar" ? "حلول متكاملة" : "Complete Solutions" },
  ];

  const allProjects = [
    { icon: Landmark, title: lang === "ar" ? "وزارة الخارجية" : "Ministry of Foreign Affairs", category: lang === "ar" ? "حكومي" : "Government", year: "2023", imageUrl: null },
    { icon: Building2, title: lang === "ar" ? "سكن بغداد - المنطقة الخضراء" : "Baghdad Residence - Green Zone", category: lang === "ar" ? "سكني" : "Residential", year: "2024", imageUrl: null },
    { icon: Hotel, title: lang === "ar" ? "قصر الشام" : "Al-Sham Palace", category: lang === "ar" ? "فنادق" : "Hospitality", year: "2023", imageUrl: null },
    { icon: Building2, title: lang === "ar" ? "أبراج النخيل" : "Al-Nakheel Towers", category: lang === "ar" ? "مؤسسات" : "Enterprise", year: "2024", imageUrl: null },
    { icon: Store, title: lang === "ar" ? "النخيل مول" : "Al-Nakheel Mall", category: lang === "ar" ? "متاجر" : "Retail", year: "2024", imageUrl: null },
    { icon: Building2, title: "HOD", category: lang === "ar" ? "مؤسسات" : "Enterprise", year: "2023", imageUrl: null },
    { icon: School, title: "EISB", category: lang === "ar" ? "تعليم" : "Education", year: "2023", imageUrl: null },
    { icon: HomeIcon, title: lang === "ar" ? "قرية تجديد" : "Tajdeed Village", category: lang === "ar" ? "سكني" : "Residential", year: "2024", imageUrl: null },
    { icon: Store, title: lang === "ar" ? "المصدر العلمي" : "Al-Masdar Al-Ilmi", category: lang === "ar" ? "متاجر" : "Retail", year: "2024", imageUrl: null },
  ];

  const displayedProjects = allProjects.slice(projectIndex, projectIndex + 4);
  
  const handleNextProjects = () => {
    if (projectIndex + 4 < allProjects.length) {
      setProjectIndex(projectIndex + 4);
    } else {
      setProjectIndex(0);
    }
  };

  const handlePrevProjects = () => {
    if (projectIndex - 4 >= 0) {
      setProjectIndex(projectIndex - 4);
    } else {
      setProjectIndex(Math.max(0, allProjects.length - 4));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeTab === "services"
              ? "bg-[#1d3fba] text-white shadow-lg blue-glow scale-105"
              : tc(theme, "bg-white/[0.06] text-white/90 hover:text-white hover:bg-white/[0.10] border border-white/10", "bg-white/80 text-[#5b6472] hover:text-[#3d4451] hover:bg-white border border-[#1d3fba]/15")
          }`}
          style={theme === "night" && activeTab !== "services" ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : {}}
        >
          <span className="flex items-center gap-2">
            <AppWindow className="w-4 h-4" />
            {lang === "ar" ? "الخدمات" : "Services"}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeTab === "projects"
              ? "bg-[#1d3fba] text-white shadow-lg blue-glow scale-105"
              : tc(theme, "bg-white/[0.06] text-white/90 hover:text-white hover:bg-white/[0.10] border border-white/10", "bg-white/80 text-[#5b6472] hover:text-[#3d4451] hover:bg-white border border-[#1d3fba]/15")
          }`}
          style={theme === "night" && activeTab !== "projects" ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : {}}
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {lang === "ar" ? "المشاريع" : "Projects"}
          </span>
        </button>
      </div>

      {/* Content Carousel */}
      <AnimatePresence mode="wait">
        {activeTab === "services" ? (
          <motion.div
            key="services"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {quickServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.a
                  key={service.title}
                  href="#services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group relative p-6 rounded-2xl border backdrop-blur-xl transition-all shadow-lg ${
                    tc(theme, 
                      "border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] hover:border-[#1d3fba]/40 hover:shadow-[#1d3fba]/20",
                      "border-[#1d3fba]/15 bg-white/70 hover:bg-white hover:border-[#1d3fba]/40 hover:shadow-[#1d3fba]/10"
                    )
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
                    tc(theme, "bg-gradient-to-br from-[#1d3fba]/25 to-[#1d3fba]/10 group-hover:from-[#1d3fba]/35 group-hover:to-[#1d3fba]/15", "bg-gradient-to-br from-[#1d3fba]/15 to-[#1d3fba]/5 group-hover:from-[#1d3fba]/25 group-hover:to-[#1d3fba]/10")
                  }`}>
                    <Icon className={`w-7 h-7 ${tc(theme, "text-[#4d7aff]", "text-[#1d3fba]")}`} />
                  </div>
                  <h3 className={`font-bold text-sm mb-2 ${tc(theme, "text-white", "text-[#0a0a0a]")}`}>
                    {service.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}`}>
                    {service.desc}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className={`p-1.5 rounded-full backdrop-blur-md ${tc(theme, "bg-[#1d3fba]/80", "bg-white/95 shadow-lg")}`}>
                      <ChevronRight className={`w-3.5 h-3.5 ${tc(theme, "text-white", "text-[#1d3fba]")}`} />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Navigation Arrows */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevProjects}
                disabled={projectIndex === 0}
                className={`p-2.5 rounded-full transition-all ${
                  projectIndex === 0
                    ? tc(theme, "opacity-20 cursor-not-allowed bg-white/[0.02]", "opacity-20 cursor-not-allowed bg-gray-100")
                    : tc(theme, "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10 hover:border-white/20", "bg-white/80 hover:bg-white text-[#1d3fba] border border-[#1d3fba]/15 hover:border-[#1d3fba]/30 shadow-sm")
                }`}
                aria-label={lang === "ar" ? "السابق" : "Previous"}
              >
                <ChevronRight className={`w-5 h-5 ${lang === "ar" ? "" : "rotate-180"}`} />
              </button>
              
              <div className={`text-sm font-semibold ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}`}>
                {lang === "ar" ? `${projectIndex + 1}-${Math.min(projectIndex + 4, allProjects.length)} من ${allProjects.length}` : `${projectIndex + 1}-${Math.min(projectIndex + 4, allProjects.length)} of ${allProjects.length}`}
              </div>

              <button
                onClick={handleNextProjects}
                disabled={projectIndex + 4 >= allProjects.length}
                className={`p-2.5 rounded-full transition-all ${
                  projectIndex + 4 >= allProjects.length
                    ? tc(theme, "opacity-20 cursor-not-allowed bg-white/[0.02]", "opacity-20 cursor-not-allowed bg-gray-100")
                    : tc(theme, "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10 hover:border-white/20", "bg-white/80 hover:bg-white text-[#1d3fba] border border-[#1d3fba]/15 hover:border-[#1d3fba]/30 shadow-sm")
                }`}
                aria-label={lang === "ar" ? "التالي" : "Next"}
              >
                <ChevronRight className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Projects Grid */}
            <motion.div
              key={projectIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {displayedProjects.map((project, idx) => {
                const Icon = project.icon;
                return (
                  <motion.a
                    key={`${project.title}-${projectIndex}`}
                    href="/projects"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`group relative rounded-2xl border backdrop-blur-xl transition-all overflow-hidden shadow-lg ${
                      tc(theme,
                        "border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] hover:border-[#1d3fba]/40 hover:shadow-[#1d3fba]/20",
                        "border-[#1d3fba]/15 bg-white/70 hover:bg-white hover:border-[#1d3fba]/40 hover:shadow-[#1d3fba]/10"
                      )
                    }`}
                  >
                    {/* Image or Icon Container */}
                    <div className={`aspect-[4/3] relative flex items-center justify-center overflow-hidden ${
                      tc(theme, 
                        "bg-gradient-to-br from-[#1d3fba]/30 via-[#1d3fba]/15 to-[#1d3fba]/5",
                        "bg-gradient-to-br from-[#1d3fba]/15 via-[#1d3fba]/8 to-white"
                      )
                    }`}>
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className={`absolute inset-0 ${tc(theme, "bg-gradient-to-br from-[#0a0a0a]/20 to-transparent", "bg-gradient-to-br from-white/50 to-transparent")}`} />
                          <Icon className={`w-16 h-16 relative z-10 transition-all duration-300 group-hover:scale-110 ${tc(theme, "text-[#4d7aff]", "text-[#1d3fba]")}`} />
                          <div className={`absolute inset-0 grid-pattern ${tc(theme, "opacity-20", "opacity-10")}`} />
                          <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${tc(theme, "from-black/60 to-transparent", "from-white/80 to-transparent")}`} />
                        </>
                      )}
                    </div>
                    
                    {/* Project Info */}
                    <div className="p-4 relative">
                      <div className={`text-xs font-bold mb-2 inline-block px-2 py-0.5 rounded-md ${
                        tc(theme, "bg-[#1d3fba]/20 text-[#6b9eff]", "bg-[#1d3fba]/10 text-[#1d3fba]")
                      }`}>
                        {project.category} • {project.year}
                      </div>
                      <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${tc(theme, "text-white", "text-[#0a0a0a]")}`}>
                        {project.title}
                      </h3>
                    </div>
                    
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className={`p-2 rounded-full backdrop-blur-md ${tc(theme, "bg-[#1d3fba]/80", "bg-white/95 shadow-lg")}`}>
                        <ArrowUpRight className={`w-4 h-4 ${tc(theme, "text-white", "text-[#1d3fba]")}`} />
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ lang, theme, dynProjects, dynServices, dynPartners }: { lang: Lang; theme: Theme; dynProjects: DbProject[] | null; dynServices: DbService[] | null; dynPartners: DbPartner[] | null }) {
  const t = translations[lang].hero;
  const heroStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
  const labelAnim = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 } } };
  const headlineAnim = { hidden: { opacity: 0, y: 24, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 } } };
  return (
    <section id="home" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <BackgroundFx theme={theme} />
      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={heroStagger} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
          <motion.div variants={labelAnim} className="relative mx-auto mb-8 flex items-center justify-center">
            {/* Outer slow-spinning ring */}
            <motion.div
              className={`absolute rounded-full border-2 border-dashed ${tc(theme, "border-[#1d3fba]/30", "border-[#1d3fba]/20")}`}
              style={{ width: 148, height: 148 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner counter-spin ring */}
            <motion.div
              className={`absolute rounded-full border ${tc(theme, "border-[#1d3fba]/20", "border-[#1d3fba]/15")}`}
              style={{ width: 118, height: 118 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            {/* Logo card */}
            <motion.div
              className="relative flex items-center justify-center"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
            >
              <img src={theme === "night" ? logoNight : logoDay} alt="" loading="eager" decoding="async" fetchPriority="high" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl" />
            </motion.div>
          </motion.div>
          <motion.div variants={labelAnim} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-xs sm:text-sm mb-6">
            <Diamond className="w-3.5 h-3.5 text-[#1d3fba]" />
            <span className={tc(theme, "text-[#e9e9e9]", "text-[#1d3fba]")}>{t.label}</span>
          </motion.div>
          <motion.h1 variants={headlineAnim} className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>
            {t.title}
          </motion.h1>
        </motion.div>

        {/* Marquees — full width, outside max-w-4xl but inside max-w-7xl */}
        <div className="h-12 sm:h-16" />
        <ServicesMarquee lang={lang} theme={theme} dynServices={dynServices} />
        <ProjectsMarquee lang={lang} theme={theme} dynProjects={dynProjects} />
        <FeaturedWorkMarquee lang={lang} theme={theme} dynPartners={dynPartners} />
        <HeroIntro lang={lang} theme={theme} />
      </div>
    </section>
  );
}

/* ---------------- Hero intro block (moved below the partners section) ---------------- */
function HeroIntro({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].hero;
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
  const paraAnim = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
  const buttonsAnim = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } } };
  const badgesAnim = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const badgeItem = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } } };

  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center max-w-4xl mx-auto">
          <motion.p variants={paraAnim} className={`text-base sm:text-lg max-w-3xl mx-auto ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}` }>
            {t.sub}
          </motion.p>
          <motion.p variants={paraAnim} className={`mt-4 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed ${tc(theme, "text-[#e9e9e9]/60", "text-[#5b6472]")}` }>
            {t.para}
          </motion.p>
          <motion.div variants={badgesAnim} className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {t.badges.map((badge) => (
              <motion.span
                key={badge}
                variants={badgeItem}
                className={`px-3 py-1.5 text-xs rounded-full border backdrop-blur ${tc(theme, "border-white/10 bg-white/[0.04] text-[#e9e9e9]/85", "border-[#1d3fba]/15 bg-white/60 text-[#3d4451]")}` }
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
          <motion.div variants={buttonsAnim} className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow transition-all">
              {t.primary} <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#services" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-md transition-colors ${tc(theme, "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]", "border-[#1d3fba]/20 bg-white/60 text-[#111111] hover:bg-white/90")}` }>
              {t.secondary}
            </a>
            <a href="/partners" className={`inline-flex items-center gap-1 text-sm px-3 py-2 hover:text-[#1d3fba] underline-offset-4 hover:underline transition-colors ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>
              {t.third} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Featured Work — seamless infinite marquee ---------------- */
/** Partner logos — start at project-2 since project-1 (image 1(1)) moved to the projects marquee */
const PROJECT_IMAGES = Array.from({ length: 12 }, (_, i) => `/assets/projects/project-${i + 2}.png`);
/** Fallback set (existing assets) to avoid blank cards if primary paths fail */
const PROJECT_IMAGES_FALLBACK = Array.from({ length: 12 }, (_, i) => `/assets/marquee/proj-${i + 2}.png`);
/** All 13 marquee images used as base in /partners page */
const MARQUEE_PARTNER_IMAGES = Array.from({ length: 13 }, (_, i) => `/assets/marquee/proj-${i + 1}.png`);

/** Featured projects: image 1(1) moved from partners + the NEW folder set */
const FEATURED_PROJECT_IMAGES = [
  "/assets/projects/project-1.png",
  ...Array.from({ length: 17 }, (_, i) => `/assets/featured-projects/fp-${i + 1}.png`),
];

/* ---------------- Featured Projects — seamless infinite marquee ---------------- */
type MarqueeProject = { id: string | null; src: string; label: string };

function ProjectsMarquee({ lang, theme, dynProjects }: { lang: Lang; theme: Theme; dynProjects: DbProject[] | null }) {
  const isAr = lang === "ar";
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});
  const title = isAr ? "أبرز مشاريعنا" : "Our Featured Projects";
  const subtitle = isAr
    ? "لمحة عن مشاريع نفخر بإنجازها في مجال الشبكات والتقنية"
    : "A glimpse of the networking & technology projects we are proud of";

  // DB-driven: featured projects link to their detail page. Falls back to the
  // static 18-image set (no link) only when the database isn't reachable.
  const featured = (dynProjects || []).filter((p) => p.featured && p.image_url);
  const base: MarqueeProject[] =
    featured.length > 0
      ? featured.map((p) => ({
          id: p.id,
          src: p.image_url as string,
          label: isAr ? p.title_ar : p.title_en || p.title_ar,
        }))
      : FEATURED_PROJECT_IMAGES.map((src) => ({
          id: null,
          src,
          label: isAr ? "مشروع منجز من أبراج الماس" : "ABRAJ ALMAS completed project",
        }));

  // Duplicate the set twice so the -50% translate loops seamlessly with no gap.
  const cards = [...base, ...base];

  // Glassmorphism card styling adapts to the active theme.
  const cardStyle: React.CSSProperties =
    theme === "night"
      ? {
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }
      : {
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(29,63,186,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(29,63,186,0.10)",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10 mb-6"
    >
      <div className="text-center mb-7">
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}`}
          style={theme === "night" ? { textShadow: "0 2px 8px rgba(0,0,0,0.5)" } : {}}
        >
          {title}
        </h2>
        <p className={`mt-2 text-sm sm:text-base max-w-2xl mx-auto ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}`}>
          {subtitle}
        </p>
      </div>

      {/* Marquee viewport — pause on hover handled in CSS via .proj-marquee:hover */}
      <div className={`proj-marquee relative w-full overflow-hidden py-4 rounded-2xl ${tc(theme, "bg-white/[0.02]", "bg-[#1d3fba]/[0.03]")}`}>
        <div className={`proj-marquee-track ${isAr ? "is-rtl" : ""}`}>
          {cards.map((card, i) => {
            const baseIndex = i % base.length;
            const isBroken = !!brokenImages[baseIndex];
const href = card.id ? `/projects/${card.id}` : "/projects";

            return (
            <a
              key={i}
              href={href}
              aria-hidden={i >= base.length}
              className="group relative shrink-0 mr-5 w-[260px] sm:w-[320px] lg:w-[360px] rounded-2xl overflow-hidden p-2 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
              style={cardStyle}
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-56 rounded-xl overflow-hidden">
                <img
                  src={card.src}
                  alt={card.label}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onError={() => setBrokenImages((prev) => ({ ...prev, [baseIndex]: true }))}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isBroken && (
                  <div className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${tc(theme, "text-white/75 bg-black/35", "text-[#1d3fba] bg-white/45")}`}>
                    {isAr ? "صورة المشروع غير متاحة" : "Project image unavailable"}
                  </div>
                )}
                <div
                  className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${tc(theme, "from-black/55 via-black/10 to-transparent", "from-black/35 via-transparent to-transparent")}`}
                />
                {/* Project name overlay (DB-driven cards only) */}
                {card.id && (
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="text-white text-sm font-bold drop-shadow-lg line-clamp-1">{card.label}</span>
                  </div>
                )}
              </div>
            </a>
          )})}
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedWorkMarquee({ lang, theme, dynPartners }: { lang: Lang; theme: Theme; dynPartners: DbPartner[] | null }) {
  const isAr = lang === "ar";
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const title = isAr ? "أبرز شركاؤنا" : "Our Top Partners";
  const subtitle = isAr
    ? "العلامات والشركاء الذين نعمل معهم في مشاريعنا التقنية"
    : "The brands and partners we work with across our technical projects";

  // If dynPartners data exists (after admin import), use it exclusively.
  // Otherwise fall back to the hardcoded static marquee images.
  const baseImages =
    dynPartners && dynPartners.length > 0
      ? dynPartners.filter((p) => !!p.image_url).map((p) => ({ key: p.id, src: p.image_url!, name: p.name }))
      : MARQUEE_PARTNER_IMAGES.map((src) => ({ key: src, src, name: "" }));

  // Duplicate the set twice so the -50% translate loops seamlessly with no gap.
  const cards = [...baseImages, ...baseImages];

  // Glassmorphism card styling adapts to the active theme.
  const cardStyle: React.CSSProperties =
    theme === "night"
      ? {
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }
      : {
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(29,63,186,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(29,63,186,0.10)",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10 mb-6"
    >
      <div className="text-center mb-7">
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}`}
          style={theme === "night" ? { textShadow: "0 2px 8px rgba(0,0,0,0.5)" } : {}}
        >
          {title}
        </h2>
        <p className={`mt-2 text-sm sm:text-base max-w-2xl mx-auto ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}`}>
          {subtitle}
        </p>
      </div>

      {/* Marquee viewport — pause on hover handled in CSS via .proj-marquee:hover */}
      <div className={`proj-marquee relative w-full overflow-hidden py-4 rounded-2xl ${tc(theme, "bg-white/[0.02]", "bg-[#1d3fba]/[0.03]")}`}>
        <div className={`proj-marquee-track ${isAr ? "is-rtl" : ""}`}>
          {cards.map((item, i) => {
            const itemKey = item.key;
            const isBroken = !!brokenImages[itemKey];
            const src = isBroken ? MARQUEE_PARTNER_IMAGES[0] : item.src;

            return (
            <a
              key={`${itemKey}-${i}`}
              href="/partners"
              aria-hidden={i >= baseImages.length}
              className="group relative shrink-0 mr-5 w-[260px] sm:w-[320px] lg:w-[360px] rounded-2xl overflow-hidden p-2 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
              style={cardStyle}
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-56 rounded-xl overflow-hidden">
                <img
                  src={src}
                  alt={item.name || (isAr ? "شعار شريك من أبراج الماس" : "ABRAJ ALMAS partner logo")}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onError={() => setBrokenImages((prev) => ({ ...prev, [itemKey]: true }))}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isBroken && (
                  <div className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${tc(theme, "text-white/75 bg-black/35", "text-[#1d3fba] bg-white/45")}`}>
                    {isAr ? "صورة الشريك غير متاحة" : "Partner image unavailable"}
                  </div>
                )}
                <div
                  className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${tc(theme, "from-black/40 via-transparent to-transparent", "from-white/30 via-transparent to-transparent")}`}
                />
              </div>
            </a>
          )})}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Our Services — seamless infinite glass marquee ---------------- */
function ServicesMarquee({ lang, theme, dynServices }: { lang: Lang; theme: Theme; dynServices: DbService[] | null }) {
  const isAr = lang === "ar";
  const title = isAr ? "خدماتنا" : "Our Services";
  const subtitle = isAr
    ? "حلولنا التقنية الأساسية التي نقدمها للأفراد والشركات"
    : "Our core technical services for individuals and businesses";
  const serviceTitles = dynServices
    ? dynServices.map((s) => isAr ? s.title_ar : (s.title_en || s.title_ar))
    : translations[lang].services.items.map((item) => item.title);
  const cards = [...serviceTitles, ...serviceTitles];

  // Clear glass card tinted with the brand blue (#1d3fba), tuned per theme.
  const cardStyle: React.CSSProperties =
    theme === "night"
      ? {
          background: "linear-gradient(135deg, rgba(29,63,186,0.16) 0%, rgba(10,10,12,0.55) 100%)",
          border: "1px solid rgba(29,63,186,0.35)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        }
      : {
          background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(29,63,186,0.08) 100%)",
          border: "1px solid rgba(29,63,186,0.22)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 10px 30px rgba(29,63,186,0.14), inset 0 1px 0 rgba(255,255,255,0.7)",
        };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
            {title}
          </h2>
          <p className={`mt-2 text-sm sm:text-base max-w-2xl mx-auto ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}`}>
            {subtitle}
          </p>
        </div>

        <div className={`proj-marquee relative w-full overflow-hidden py-4 rounded-2xl ${tc(theme, "bg-white/[0.02]", "bg-[#1d3fba]/[0.03]")}`}>
          <div className={`proj-marquee-track ${isAr ? "is-rtl" : ""}`}>
            {cards.map((service, i) => {
              const Icon = SERVICE_ICONS[i % serviceTitles.length] || Network;
              return (
                <a
                  key={`${service}-${i}`}
                  href="#services"
                  aria-hidden={i >= serviceTitles.length}
                  className="group relative shrink-0 mr-5 w-[280px] sm:w-[330px] lg:w-[380px] rounded-2xl overflow-hidden p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(29,63,186,0.35)] cursor-pointer"
                  style={cardStyle}
                >
                  {/* Brand accent bar */}
                  <span className="absolute inset-y-0 start-0 w-1 bg-[#1d3fba]" />
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: theme === "night" ? "rgba(29,63,186,0.22)" : "rgba(29,63,186,0.12)",
                        borderColor: "rgba(29,63,186,0.45)",
                      }}
                    >
                      <Icon className={`w-6 h-6 ${tc(theme, "text-[#6b9eff]", "text-[#1d3fba]")}`} />
                    </div>
                    <p className={`text-sm sm:text-base font-bold leading-snug ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                      {service}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function BackgroundFx({ theme }: { theme: Theme }) {
  // Network nodes: fixed positions, pulse softly
  const nodes = [
    { cx: "15%", cy: "20%", r: 3, delay: 0 },
    { cx: "75%", cy: "15%", r: 2.5, delay: 0.8 },
    { cx: "88%", cy: "55%", r: 3.5, delay: 1.6 },
    { cx: "65%", cy: "80%", r: 2, delay: 0.4 },
    { cx: "25%", cy: "72%", r: 3, delay: 1.2 },
    { cx: "50%", cy: "38%", r: 2, delay: 2 },
    { cx: "35%", cy: "10%", r: 2.5, delay: 0.6 },
  ];
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 grid-pattern ${tc(theme, "opacity-40", "opacity-20")}` } />
      {/* Ambient glow blobs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
        className={`absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#1d3fba] blur-[140px] ${tc(theme, "opacity-40", "opacity-15")}` }
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        className={`absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-[#1d3fba] blur-[160px] ${tc(theme, "opacity-20", "opacity-08")}` }
      />
      {/* Orbit rings */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#1d3fba]/12"
        style={{ borderTopColor: "rgba(29,63,186,0.18)", borderBottomColor: "transparent" }}
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[840px] h-[840px] rounded-full border border-[#1d3fba]/08"
        style={{ borderRightColor: "rgba(29,63,186,0.16)", borderLeftColor: "transparent" }}
      />
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-[#1d3fba]/05"
      />
      {/* Network nodes + connecting lines (SVG overlay) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Connection lines */}
        <line x1="15%" y1="20%" x2="35%" y2="10%" stroke="rgba(29,63,186,0.12)" strokeWidth="0.8" />
        <line x1="75%" y1="15%" x2="35%" y2="10%" stroke="rgba(29,63,186,0.10)" strokeWidth="0.8" />
        <line x1="75%" y1="15%" x2="88%" y2="55%" stroke="rgba(29,63,186,0.10)" strokeWidth="0.8" />
        <line x1="50%" y1="38%" x2="75%" y2="15%" stroke="rgba(29,63,186,0.08)" strokeWidth="0.8" />
        <line x1="50%" y1="38%" x2="15%" y2="20%" stroke="rgba(29,63,186,0.08)" strokeWidth="0.8" />
        <line x1="50%" y1="38%" x2="65%" y2="80%" stroke="rgba(29,63,186,0.08)" strokeWidth="0.8" />
        <line x1="25%" y1="72%" x2="65%" y2="80%" stroke="rgba(29,63,186,0.10)" strokeWidth="0.8" />
        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx} cy={n.cy} r={n.r}
            fill="rgba(29,63,186,0.55)"
            animate={{ opacity: [0.3, 0.8, 0.3], r: [n.r, n.r + 1.5, n.r] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <div className={`absolute inset-0 bg-gradient-to-b ${tc(theme, "from-black/20 via-transparent to-black", "from-white/20 via-transparent to-[#f7f8fb]")}` } />
    </div>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  lang,
  theme,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  lang: Lang;
  theme: Theme;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
      {eyebrow && (
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-xs mb-4">
          <Diamond className="w-3.5 h-3.5 text-[#1d3fba]" />
          <span className={tc(theme, "text-white", "text-[#1d3fba]")}>{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2 variants={blurReveal} className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}` } style={theme === "night" ? { textShadow: "0 2px 8px rgba(0,0,0,0.5)" } : {}}>{title}</motion.h2>
      {subtitle && <motion.p variants={fadeUp} className={`mt-4 ${tc(theme, "text-[#e9e9e9]/90", "text-[#3d4451]")}` } style={theme === "night" ? { textShadow: "0 1px 3px rgba(0,0,0,0.4)" } : {}}>{subtitle}</motion.p>}
    </motion.div>
  );
}

/* ---------------- GlowCard — mouse-follow radial glow ---------------- */
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: "50%", y: "50%" });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: `${e.clientX - rect.left}px`, y: `${e.clientY - rect.top}px` });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: hovered
          ? `radial-gradient(circle at ${pos.x} ${pos.y}, rgba(29,63,186,0.13), transparent 60%)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- Parallax background helper ---------------- */
function ParallaxBg({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{ y }}
        className={`absolute inset-[-60px] ${tc(theme, "bg-[radial-gradient(ellipse_at_50%_30%,rgba(29,63,186,0.07),transparent_70%)]", "bg-[radial-gradient(ellipse_at_50%_30%,rgba(29,63,186,0.04),transparent_70%)]")}`}
      />
    </div>
  );
}

/* ---------------- CountUp helper ---------------- */
function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / (duration * 1000), 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(ease * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ---------------- Stats strip ---------------- */
const STATS_AR = [
  { value: 2022, suffix: "", label: "سنة التأسيس" },
  { value: 100, suffix: "+", label: "مشروع منجز" },
  { value: 50, suffix: "+", label: "عميل موثوق" },
  { value: 24, suffix: "/7", label: "دعم فني متواصل" },
];
const STATS_EN = [
  { value: 2022, suffix: "", label: "Founded" },
  { value: 100, suffix: "+", label: "Projects Done" },
  { value: 50, suffix: "+", label: "Trusted Clients" },
  { value: 24, suffix: "/7", label: "Tech Support" },
];
function StatsStrip({ lang, theme }: { lang: Lang; theme: Theme }) {
  const stats = lang === "ar" ? STATS_AR : STATS_EN;
  return (
    <section aria-label="stats" className={`py-10 px-4 sm:px-6 lg:px-8 border-y ${tc(theme, "border-white/8", "border-[#1d3fba]/10")}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={stagger}
        className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="flex flex-col items-center gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1d3fba] tabular-nums">
              <CountUp to={s.value} suffix={s.suffix} />
            </span>
            <span className={`text-xs sm:text-sm font-medium ${tc(theme, "text-white/60", "text-[#5b6472]")}`}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------- About ---------------- */
function AboutSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].about;
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid lg:grid-cols-2 gap-10 items-start mb-12">
          <motion.p variants={fadeUp} className={`leading-relaxed text-lg ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}` }>{t.p1}</motion.p>
          <motion.p variants={fadeUp} className={`leading-relaxed text-lg ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}` }>{t.p2}</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid md:grid-cols-3 gap-6">
          {t.cards.map((c) => (
            <motion.div key={c.title} variants={fadeUp}>
              <GlowCard className="glass-card p-7 h-full hover:blue-glow transition-shadow group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 4 }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4 group-hover:bg-[#1d3fba]/25 group-hover:border-[#1d3fba]/70 transition-all"
                >
                  <Diamond className="w-5 h-5 text-[#1d3fba]" />
                </motion.div>
                <h3 className={`text-xl font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{c.title}</h3>
                <p className={`text-sm leading-relaxed ${tc(theme, "text-[#e9e9e9]/75", "text-[#3d4451]")}` }>{c.text}</p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Vision ---------------- */
function VisionSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].vision;
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="glass-card blue-glow-strong p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3fba]/10 via-transparent to-[#1d3fba]/5 pointer-events-none" />
          <div className="relative">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-6">
              <Diamond className="w-6 h-6 text-[#1d3fba]" />
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold mb-6 ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>{t.title}</h2>
            <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}` }>{t.text}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
function WhyUsSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].whyUs;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} lang={lang} theme={theme} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {t.items.map((it, i) => {
            const Icon = WHY_ICONS[i] || ShieldCheck;
            return (
              <motion.div key={it.title} variants={fadeUp}>
                <GlowCard className="glass-card p-6 h-full transition-all hover:border-[#1d3fba]/50 group">
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 4 }}
                    transition={{ duration: 0.25 }}
                    className="w-11 h-11 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4 group-hover:bg-[#1d3fba]/25 group-hover:border-[#1d3fba]/70 group-hover:shadow-[0_0_18px_rgba(29,63,186,0.3)] transition-all"
                  >
                    <Icon className="w-5 h-5 text-[#1d3fba]" />
                  </motion.div>
                  <h3 className={`text-base font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{it.title}</h3>
                  <p className={`text-xs leading-relaxed ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>{it.text}</p>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function ServicesSection({ lang, theme, dynServices }: { lang: Lang; theme: Theme; dynServices: DbService[] | null }) {
  const t = translations[lang].services;
  const isAr = lang === "ar";

  // Reveal the grid reliably — even when the user jumps straight here via the
  // #services anchor (where whileInView can fail to fire). A short mount-fallback
  // guarantees the cards are never left invisible.
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.1 });
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setForceShow(true), 600);
    return () => clearTimeout(id);
  }, []);
  const reveal = inView || forceShow;

  // Build display items: prefer DB data, fall back to static
  const displayItems = dynServices
    ? dynServices.map((s, i) => ({
        key: s.id, i,
        title:    isAr ? s.title_ar : (s.title_en || s.title_ar),
        desc:     isAr ? s.desc_ar  : (s.desc_en  || s.desc_ar),
        features: isAr ? (s.features_ar || []) : (s.features_en?.length ? s.features_en : (s.features_ar || [])),
        imageUrl: s.image_url,
        linkUrl:  s.link_url,
      }))
    : t.items.map((s, i) => ({ key: s.title, i, title: s.title, desc: s.desc, features: s.features, imageUrl: null, linkUrl: null }));

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <ParallaxBg theme={theme} />
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div ref={gridRef} initial="hidden" animate={reveal ? "visible" : "hidden"} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayItems.map((s) => {
            const Icon = SERVICE_ICONS[s.i] || Network;
            return (
              <motion.div key={s.key} variants={fadeUp}>
                <GlowCard className="glass-card p-6 h-full flex flex-col transition-all hover:border-[#1d3fba]/50 group">
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt={s.title} loading="lazy" decoding="async" className="w-full h-32 object-cover rounded-xl mb-4" />
                  )}
                  {!s.imageUrl && (
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      transition={{ duration: 0.25 }}
                      className="w-12 h-12 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4 group-hover:bg-[#1d3fba]/25 group-hover:border-[#1d3fba]/70 group-hover:shadow-[0_0_20px_rgba(29,63,186,0.32)] transition-all"
                    >
                      <Icon className="w-6 h-6 text-[#1d3fba]" />
                    </motion.div>
                  )}
                  <h3 className={`text-lg font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` } style={theme === "night" ? { textShadow: "0 2px 4px rgba(0,0,0,0.4)" } : {}}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${tc(theme, "text-[#e9e9e9]/85", "text-[#5b6472]")}` } style={theme === "night" ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : {}}>{s.desc}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {s.features.map((f) => (
                      <li key={f} className={`text-xs flex items-start gap-2 ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}` }>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1d3fba] flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {s.linkUrl ? (
                    <a href={s.linkUrl} target="_blank" rel="noopener" className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all hover:bg-[#1d3fba]/15 hover:border-[#1d3fba]/60 ${tc(theme, "bg-white/[0.04] border-white/10 text-white", "bg-white/40 border-[#1d3fba]/15 text-[#111111]")}` }>
                      {t.bookCta} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a href="/booking" className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all hover:bg-[#1d3fba]/15 hover:border-[#1d3fba]/60 ${tc(theme, "bg-white/[0.04] border-white/10 text-white", "bg-white/40 border-[#1d3fba]/15 text-[#111111]")}` }>
                      {t.bookCta} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
function ProcessSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].process;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <div className="relative">
          <div className="hidden lg:block absolute top-10 inset-x-10 h-px bg-gradient-to-r from-transparent via-[#1d3fba]/60 to-transparent" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid lg:grid-cols-5 gap-5">
            {t.steps.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} className="glass-card p-6 hover:blue-glow transition-all relative">
                <div className={`w-12 h-12 rounded-full border-2 border-[#1d3fba] text-[#1d3fba] font-extrabold flex items-center justify-center mb-4 blue-glow ${tc(theme, "bg-black", "bg-white")}` }>{i + 1}</div>
                <h3 className={`text-base font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{s.title}</h3>
                <p className={`text-xs leading-relaxed ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects (with logo) ---------------- */
export function ProjectsSection({ lang, theme, dynProjects }: { lang: Lang; theme: Theme; dynProjects: DbProject[] | null }) {
  const t = translations[lang].projects;
  const isAr = lang === "ar";

  const displayItems = dynProjects
    ? dynProjects.map((p) => ({ key: p.id, id: p.id, name: isAr ? p.title_ar : (p.title_en || p.title_ar), category: p.category || t.categories[0], imageUrl: p.image_url }))
    : t.items.map((name, i) => ({ key: name, id: null as string | null, name, category: t.categories[i % t.categories.length], imageUrl: null }));

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <ParallaxBg theme={theme} />
      {/* Watermark logo */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.img
          src={logoHorizontal}
          alt=""
          className="w-[500px] sm:w-[700px] max-w-full h-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: theme === "night" ? 0.03 : 0.04 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          draggable={false}
        />
      </div>
      <div className="max-w-7xl mx-auto relative">
        {/* Logo badge above heading */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col items-center mb-8">
          <div className="glass-card px-6 py-3 flex items-center gap-3 mb-6 rounded-2xl">
            <img src={theme === "night" ? logoNight : logoDay} alt="ABRAJ ALMAS" loading="lazy" decoding="async" className="h-14 w-auto" />
            <div className="text-start">
              <div className={`text-xs font-extrabold tracking-widest ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>ABRAJ ALMAS</div>
              <div className="text-[10px] text-[#1d3fba] font-semibold">{lang === "ar" ? "مشاريع نفخر بها" : "Projects We Are Proud Of"}</div>
            </div>
          </div>
        </motion.div>
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {displayItems.map((item) => {
            const cardContent = (
              <>
                <div className={`aspect-[4/3] rounded-xl border flex items-center justify-center mb-4 relative overflow-hidden ${tc(theme, "bg-gradient-to-br from-[#1d3fba]/25 via-[#1d3fba]/10 to-transparent border-white/10", "bg-gradient-to-br from-[#1d3fba]/10 via-[#1d3fba]/5 to-transparent border-[#1d3fba]/10")}` }>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                    : <><Diamond className="w-8 h-8 text-[#1d3fba]/70" /><div className={`absolute inset-0 grid-pattern ${tc(theme, "opacity-30", "opacity-20")}` } /></>}
                  {item.id && (
                    <div className={`absolute bottom-2 end-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md ${tc(theme, "bg-[#1d3fba]/80", "bg-white/90 shadow")}`}>
                      <ArrowUpRight className={`w-3.5 h-3.5 ${tc(theme, "text-white", "text-[#1d3fba]")}`} />
                    </div>
                  )}
                </div>
                <h3 className={`text-sm font-bold mb-2 line-clamp-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{item.name}</h3>
                <div className={`text-[10px] uppercase tracking-wider ${tc(theme, "text-[#e9e9e9]/55", "text-[#5b6472]")}` }>
                  {t.categoryLabel}: <span className={tc(theme, "text-white", "text-[#111111]")}>{item.category}</span>
                </div>
                <div className={`text-[10px] uppercase tracking-wider mt-1 ${tc(theme, "text-[#e9e9e9]/55", "text-[#5b6472]")}` }>
                  {t.statusLabel}: <span className="text-emerald-500">{t.status}</span>
                </div>
              </>
            );

            return item.id ? (
              <motion.a
                key={item.key}
                href={`/projects/${item.id}`}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`glass-card p-5 hover:blue-glow transition-all block cursor-pointer ${tc(theme, "hover:border-white/20", "hover:border-[#1d3fba]/30")}`}
              >
                {cardContent}
              </motion.a>
            ) : (
              <motion.div key={item.key} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-5 hover:blue-glow transition-all">
                {cardContent}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Partners marquee ---------------- */
export function PartnersMarquee({ lang, theme, dynPartners }: { lang: Lang; theme: Theme; dynPartners: DbPartner[] | null }) {
  const t = translations[lang].partners;
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // If dynPartners data exists (after admin import), use it exclusively.
  // Otherwise fall back to the hardcoded static marquee images.
  const allItems =
    dynPartners && dynPartners.length > 0
      ? dynPartners.filter((p) => !!p.image_url).map((p) => ({ key: p.id, src: p.image_url!, name: p.name }))
      : MARQUEE_PARTNER_IMAGES.map((src, i) => ({ key: `static-${i}`, src, name: "" }));

  const cardStyle: React.CSSProperties =
    theme === "night"
      ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
      : { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(29,63,186,0.12)", boxShadow: "0 4px 18px rgba(29,63,186,0.08)" };

  return (
    <section id="partners" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {allItems.map((item) => {
            const isBroken = !!brokenImages[item.key];
            return (
              <motion.div
                key={item.key}
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl overflow-hidden cursor-default"
                style={cardStyle}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                  {!isBroken ? (
                    <img
                      src={item.src}
                      alt={item.name || "partner logo"}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={() => setBrokenImages((p) => ({ ...p, [item.key]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1d3fba]/10">
                      <span className="text-3xl font-black text-[#1d3fba]/40">?</span>
                    </div>
                  )}
                </div>
                {item.name && (
                  <p className={`px-3 py-2 text-xs font-bold text-center truncate ${tc(theme, "text-white/80", "text-[#111111]/75")}`}>
                    {item.name}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Business solutions ---------------- */
function BusinessSolutionsSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].business;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} lang={lang} theme={theme} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.items.map((it, i) => {
            const Icon = BIZ_ICONS[i] || Building2;
            return (
              <motion.div key={it.title} variants={fadeUp}>
                <GlowCard className="glass-card p-6 h-full transition-all hover:border-[#1d3fba]/50 group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -4 }}
                    transition={{ duration: 0.25 }}
                    className="w-11 h-11 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4 group-hover:bg-[#1d3fba]/25 group-hover:border-[#1d3fba]/70 group-hover:shadow-[0_0_18px_rgba(29,63,186,0.3)] transition-all"
                  >
                    <Icon className="w-5 h-5 text-[#1d3fba]" />
                  </motion.div>
                  <h3 className={`text-base font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{it.title}</h3>
                  <p className={`text-xs leading-relaxed ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>{it.text}</p>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function ContactSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].contact;
  const isAr = lang === "ar";
  const services = translations[lang].booking.services;
  const waLink = `https://wa.me/${WA_NUMBER}`;

  const [cForm, setCForm] = useState({ fullName: "", company: "", phone: "", email: "", service: "", message: "" });
  const setC = (k: keyof typeof cForm, v: string) => setCForm((p) => ({ ...p, [k]: v }));

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = isAr
      ? [
          "مرحباً شركة أبراج الماس،",
          cForm.fullName && `الاسم: ${cForm.fullName}`,
          cForm.company && `الشركة: ${cForm.company}`,
          cForm.phone && `الهاتف: ${cForm.phone}`,
          cForm.email && `البريد الإلكتروني: ${cForm.email}`,
          cForm.service && `الخدمة المطلوبة: ${cForm.service}`,
          cForm.message && `الرسالة: ${cForm.message}`,
        ]
      : [
          "Hello ABRAJ ALMAS,",
          cForm.fullName && `Name: ${cForm.fullName}`,
          cForm.company && `Company: ${cForm.company}`,
          cForm.phone && `Phone: ${cForm.phone}`,
          cForm.email && `Email: ${cForm.email}`,
          cForm.service && `Required Service: ${cForm.service}`,
          cForm.message && `Message: ${cForm.message}`,
        ];
    const text = lines.filter(Boolean).join("\n");
    window.open(`${waLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ContactCard icon={Globe} title="Website" value={WEBSITE} href={`https://${WEBSITE}`} theme={theme} />
            <ContactCard icon={Mail} title="Email" value={EMAIL} href={`mailto:${EMAIL}`} theme={theme} />
            {PHONES.map((p) => (
              <ContactCard key={p} icon={Phone} title="Phone" value={p} href={`tel:+964${p.replace(/^0/, "")}`} theme={theme} />
            ))}
            <ContactCard icon={MapPin} title={lang === "ar" ? "الموقع" : "Location"} value={t.location} theme={theme} />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a href={`tel:+964${PHONES[0].replace(/^0/, "")}`} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm transition-colors ${tc(theme, "bg-white/[0.04] border-white/10 text-white hover:bg-white/10", "bg-white/60 border-[#1d3fba]/15 text-[#111111] hover:bg-white/90")}` }>
                <Phone className="w-4 h-4 text-[#1d3fba]" />{t.quick.call}
              </a>
              <a href={waLink} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors ${tc(theme, "bg-emerald-500/15 border-emerald-500/30 text-white hover:bg-emerald-500/20", "bg-emerald-500/10 border-emerald-600/40 text-emerald-800 hover:bg-emerald-500/20")}`}>
                <MessageCircle className="w-4 h-4" />{t.quick.wa}
              </a>
              <a href="/booking" className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 ${tc(theme, "bg-[#1d3fba] text-white", "bg-[#1d3fba] text-white")}`}>
                <Sparkles className="w-4 h-4" />{t.quick.book}
              </a>
              <a href={`mailto:${EMAIL}`} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors ${tc(theme, "bg-[#1d3fba]/20 border-[#1d3fba]/40 text-white hover:bg-[#1d3fba]/30", "bg-[#1d3fba]/10 border-[#1d3fba]/30 text-[#1d3fba] hover:bg-[#1d3fba]/20")}`}>
                <Mail className="w-4 h-4 text-[#1d3fba]" />{t.quick.email}
              </a>
            </div>
          </div>
          <form className="lg:col-span-3 glass-card blue-glow p-6 sm:p-8 space-y-4" onSubmit={handleContactSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label={t.labels.fullName} required theme={theme} value={cForm.fullName} onChange={(v) => setC("fullName", v)} />
              <InputField label={t.labels.company} theme={theme} value={cForm.company} onChange={(v) => setC("company", v)} />
              <InputField label={t.labels.phone} type="tel" theme={theme} value={cForm.phone} onChange={(v) => setC("phone", v)} />
              <InputField label={t.labels.email} type="email" theme={theme} value={cForm.email} onChange={(v) => setC("email", v)} />
            </div>
            <label className="block">
              <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{t.labels.service}</span>
              <select value={cForm.service} onChange={(e) => setC("service", e.target.value)} className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white [&>option]:bg-black", "bg-white border-[#1d3fba]/15 text-[#111111] [&>option]:bg-white")}` }>
                <option value="">—</option>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{t.labels.message}</span>
              <textarea rows={5} value={cForm.message} onChange={(e) => setC("message", e.target.value)} className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white", "bg-white border-[#1d3fba]/15 text-[#111111]")}` } />
            </label>
            <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow">
              {t.labels.send} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, title, value, href, theme }: { icon: any; title: string; value: string; href?: string; theme: Theme }) {
  const Comp: any = href ? "a" : "div";
  return (
    <Comp href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass-card p-4 flex items-center gap-4 hover:blue-glow transition-all">
      <div className="w-11 h-11 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#1d3fba]" />
      </div>
      <div className="min-w-0">
        <div className={`text-[10px] uppercase tracking-wider ${tc(theme, "text-white/40", "text-[#5b6472]")}` }>{title}</div>
        <div className={`text-sm truncate ${tc(theme, "text-white", "text-[#111111]")}` } dir="ltr">{value}</div>
      </div>
    </Comp>
  );
}

function InputField({ label, type = "text", required, theme, value, onChange }: { label: string; type?: string; required?: boolean; theme: Theme; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{label}</span>
      <input type={type} required={required} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white", "bg-white border-[#1d3fba]/15 text-[#111111]")}` } />
    </label>
  );
}

/* ---------------- Footer ---------------- */
export function Footer({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].footer;
  const isAr = lang === "ar";

  // Company column: label → section anchor
  const companyLinks = [
    { label: isAr ? "من نحن"       : "About",    href: "#about" },
    { label: isAr ? "رؤيتنا"       : "Vision",   href: "#about" },
    { label: isAr ? "الخدمات"      : "Services", href: "#services" },
    { label: isAr ? "الحجز"        : "Booking",  href: "/booking" },
    { label: isAr ? "الوظائف"      : "Careers",  href: "/jobs" },
    { label: isAr ? "المشاريع"     : "Projects", href: "/projects" },
    { label: isAr ? "الشركاء"      : "Partners", href: "/partners" },
    { label: isAr ? "تواصل معنا"   : "Contact",  href: "#contact" },
  ];

  // Services column: all go to #services
  const serviceLinks = t.colServices.map((s) => ({ label: s, href: "#services" }));

  // Contact column: smart href detection
  const contactLinks = t.colContact.map((c) => {
    if (c.startsWith("www.") || c.startsWith("http")) return { label: c, href: `https://${c.replace(/^https?:\/\//, "")}`, external: true };
    if (c.includes("@")) return { label: c, href: `mailto:${c}`, external: false };
    if (/^0\d{9,}$/.test(c)) return { label: c, href: `tel:${c}`, external: false };
    return { label: c, href: null, external: false };
  });

  const linkCls = `text-sm transition-colors hover:text-[#1d3fba] ${tc(theme, "text-[#e9e9e9]/70", "text-[#3d4451]")}`;

  return (
    <footer className={`relative border-t px-4 sm:px-6 lg:px-8 pt-14 pb-8 ${tc(theme, "border-white/10 bg-black", "border-[#1d3fba]/15 bg-white")}`}>
      <div className="max-w-7xl mx-auto">
        {/* Grid: brand full-width on mobile, 4 cols on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {/* Brand — spans 2 cols on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <img
              src={theme === "night" ? logoWhite : logoBlack}
              alt={isAr ? "شعار شركة أبراج الماس" : "ABRAJ ALMAS Logo"}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto mb-4 object-contain"
            />
            <div className="text-[11px] uppercase tracking-wider text-[#1d3fba] mb-3">{t.tagline}</div>
            <p className={`text-sm leading-relaxed max-w-xs ${tc(theme, "text-[#e9e9e9]/70", "text-[#3d4451]")}`}>{t.desc}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-sm font-bold mb-4 ${tc(theme, "text-white", "text-[#111111]")}`}>{t.colServicesTitle}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`text-sm font-bold mb-4 ${tc(theme, "text-white", "text-[#111111]")}`}>{t.colCompanyTitle}</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkCls}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-sm font-bold mb-4 ${tc(theme, "text-white", "text-[#111111]")}`}>{t.colContactTitle}</h4>
            <ul className="space-y-2">
              {contactLinks.map((c) => (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      dir="ltr"
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noreferrer" : undefined}
                      className={`${linkCls} inline-block`}
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span dir="ltr" className={`text-sm ${tc(theme, "text-[#e9e9e9]/70", "text-[#3d4451]")}`}>{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-6 border-t text-center text-xs ${tc(theme, "border-white/10 text-[#e9e9e9]/50", "border-[#1d3fba]/10 text-[#5b6472]")}`}>
          {t.copyright}
          <div className="mt-2">
            تم التصميم و البرمجة بواسطة{" "}
            <a
              href="https://roya-vision.com/"
              target="_blank"
              rel="noreferrer"
              className={`underline underline-offset-2 hover:opacity-80 transition-opacity ${tc(theme, "text-[#e9e9e9]/70", "text-[#1d3fba]")}`}
            >
              مركز الرؤية للابتكار الرقمي
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Floating actions ---------------- */
export function FloatingActions({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].floating;
  return (
    <motion.div
      className="fixed bottom-24 lg:bottom-5 end-5 z-40 flex flex-col gap-3"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ boxShadow: ["0 0 0 0 rgba(29,63,186,0)", "0 0 0 10px rgba(29,63,186,0.15)", "0 0 0 0 rgba(29,63,186,0)"] }}
        transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 3 }, scale: { duration: 0.2 } }}
        className="w-14 h-14 rounded-full bg-[#1d3fba] flex items-center justify-center shadow-2xl shadow-[#1d3fba]/40 transition-colors hover:brightness-110"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.a>
      <motion.a
        href="/booking"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="hidden sm:inline-flex items-center gap-1.5 px-4 h-12 rounded-full bg-[#1d3fba] text-white font-bold text-sm hover:brightness-110 blue-glow transition-all"
      >
        <Sparkles className="w-4 h-4" />{t.book}
      </motion.a>
    </motion.div>
  );
}
