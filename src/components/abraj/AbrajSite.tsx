import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
import { translations, PARTNERS, PHONES, WA_NUMBER, EMAIL, WEBSITE, type Lang } from "./translations";

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

const SERVICE_ICONS = [Network, Wrench, Camera, Cpu, Cable, AppWindow, Compass, Wifi];
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
    const timer = setTimeout(() => setIsLoading(false), 1800);
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
        key={langKey}
        initial={{ opacity: 0.85, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        dir={t.dir}
        lang={lang}
        className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen overflow-x-hidden pb-20 lg:pb-0`}
      >
        <Navbar lang={lang} setLang={handleSetLang} theme={theme} setTheme={setTheme} />
        <Hero lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="left" />
        <AboutSection lang={lang} theme={theme} />
        <StatsStrip lang={lang} theme={theme} />
        <VisionSection lang={lang} theme={theme} />
        <WhyUsSection lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="right" />
        <ServicesSection lang={lang} theme={theme} />
        <ProcessSection lang={lang} theme={theme} />
        <BrandDivider theme={theme} direction="left" />
        <ProjectsSection lang={lang} theme={theme} />
        <PartnersMarquee lang={lang} theme={theme} />
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
              { id: "projects", icon: Building2,     label: isAr ? "المشاريع" : "Projects", href: "#projects", cta: false },
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
          src={logoSymbol}
          alt="ABRAJ ALMAS"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-16 h-16 object-contain"
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
function Navbar({
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "home", label: t.home },
    { id: "about", label: t.about },
    { id: "services", label: t.services },
    { id: "booking", label: t.booking },
    { id: "projects", label: t.projects },
    { id: "partners", label: t.partners },
    { id: "contact", label: t.contact },
  ];

  const navBg = scrolled
    ? tc(theme, "bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/20", "bg-white/95 backdrop-blur-2xl border-b border-[#1d3fba]/15 shadow-sm")
    : tc(theme, "bg-black/20 backdrop-blur-md", "bg-white/40 backdrop-blur-md");

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
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
            <a key={l.id} href={l.id === "booking" ? "/booking" : `#${l.id}`} className={`px-3 py-2 text-sm transition-colors hover:text-[#1d3fba] ${tc(theme, "text-[#e9e9e9]", "text-[#3d4451]")}`}>{l.label}</a>
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
                <a key={l.id} href={l.id === "booking" ? "/booking" : `#${l.id}`} onClick={() => setOpen(false)} className={`py-2.5 px-3 rounded-lg transition-colors ${tc(theme, "text-[#e9e9e9] hover:bg-white/5", "text-[#3d4451] hover:bg-[#1d3fba]/5")}`}>{l.label}</a>
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
        <span className="text-base leading-none">🇸🇦</span>
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
/* ---------------- Hero ---------------- */
function Hero({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].hero;
  const heroStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
  const labelAnim = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 } } };
  const headlineAnim = { hidden: { opacity: 0, y: 24, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 } } };
  const paraAnim = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: 0.35 } } };
  const buttonsAnim = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.5 } } };
  const badgesAnim = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.65 } } };
  const badgeItem = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } } };
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
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 backdrop-blur-xl flex items-center justify-center blue-glow ${tc(theme, "border-[#1d3fba]/40 bg-white/[0.06]", "border-[#1d3fba]/25 bg-white/80")}`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
            >
              <img src={logoSymbol} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            </motion.div>
          </motion.div>
          <motion.div variants={labelAnim} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-xs sm:text-sm mb-6">
            <Diamond className="w-3.5 h-3.5 text-[#1d3fba]" />
            <span className={tc(theme, "text-[#e9e9e9]", "text-[#1d3fba]")}>{t.label}</span>
          </motion.div>
          <motion.h1 variants={headlineAnim} className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>
            {t.title}
          </motion.h1>
          <motion.p variants={paraAnim} className={`mt-6 text-base sm:text-lg max-w-3xl mx-auto ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}` }>
            {t.sub}
          </motion.p>
          <motion.p variants={paraAnim} className={`mt-4 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed ${tc(theme, "text-[#e9e9e9]/60", "text-[#5b6472]")}` }>
            {t.para}
          </motion.p>
          <motion.div variants={buttonsAnim} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow transition-all">
              {t.primary} <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#services" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-md transition-colors ${tc(theme, "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]", "border-[#1d3fba]/20 bg-white/60 text-[#111111] hover:bg-white/90")}` }>
              {t.secondary}
            </a>
            <a href="#partners" className={`inline-flex items-center gap-1 text-sm px-3 py-2 hover:text-[#1d3fba] underline-offset-4 hover:underline transition-colors ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>
              {t.third} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
          <motion.div variants={badgesAnim} className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {t.badges.map((b) => (
              <motion.span key={b} variants={badgeItem} className={`px-3 py-1.5 text-xs rounded-full border backdrop-blur ${tc(theme, "border-white/10 bg-white/[0.04] text-[#e9e9e9]/85", "border-[#1d3fba]/15 bg-white/60 text-[#3d4451]")}` }>
                {b}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
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
      <motion.h2 variants={blurReveal} className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>{title}</motion.h2>
      {subtitle && <motion.p variants={fadeUp} className={`mt-4 ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}` }>{subtitle}</motion.p>}
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
function ServicesSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].services;
  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <ParallaxBg theme={theme} />
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {t.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i] || Network;
            return (
              <motion.div key={s.title} variants={fadeUp}>
                <GlowCard className="glass-card p-6 h-full flex flex-col transition-all hover:border-[#1d3fba]/50 group">
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ duration: 0.25 }}
                    className="w-12 h-12 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4 group-hover:bg-[#1d3fba]/25 group-hover:border-[#1d3fba]/70 group-hover:shadow-[0_0_20px_rgba(29,63,186,0.32)] transition-all"
                  >
                    <Icon className="w-6 h-6 text-[#1d3fba]" />
                  </motion.div>
                  <h3 className={`text-lg font-bold mb-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{s.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${tc(theme, "text-[#e9e9e9]/70", "text-[#5b6472]")}` }>{s.desc}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {s.features.map((f) => (
                      <li key={f} className={`text-xs flex items-start gap-2 ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}` }>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1d3fba] flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <a href="/booking" className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all hover:bg-[#1d3fba]/15 hover:border-[#1d3fba]/60 ${tc(theme, "bg-white/[0.04] border-white/10 text-white", "bg-white/40 border-[#1d3fba]/15 text-[#111111]")}` }>
                    {t.bookCta} <ChevronRight className="w-3.5 h-3.5" />
                  </a>
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
function ProjectsSection({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].projects;
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
            <img src={logoSymbol} alt="ABRAJ ALMAS" className="h-10 w-auto" />
            <div className="text-start">
              <div className={`text-xs font-extrabold tracking-widest ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>ABRAJ ALMAS</div>
              <div className="text-[10px] text-[#1d3fba] font-semibold">{lang === "ar" ? "مشاريع نفخر بها" : "Projects We Are Proud Of"}</div>
            </div>
          </div>
        </motion.div>
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {t.items.map((name, i) => (
            <motion.div key={name} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-5 hover:blue-glow transition-all">
              <div className={`aspect-[4/3] rounded-xl border flex items-center justify-center mb-4 relative overflow-hidden ${tc(theme, "bg-gradient-to-br from-[#1d3fba]/25 via-[#1d3fba]/10 to-transparent border-white/10", "bg-gradient-to-br from-[#1d3fba]/10 via-[#1d3fba]/5 to-transparent border-[#1d3fba]/10")}` }>
                <Diamond className="w-8 h-8 text-[#1d3fba]/70" />
                <div className={`absolute inset-0 grid-pattern ${tc(theme, "opacity-30", "opacity-20")}` } />
              </div>
              <h3 className={`text-sm font-bold mb-2 line-clamp-2 ${tc(theme, "text-white", "text-[#111111]")}` }>{name}</h3>
              <div className={`text-[10px] uppercase tracking-wider ${tc(theme, "text-[#e9e9e9]/55", "text-[#5b6472]")}` }>
                {t.categoryLabel}: <span className={tc(theme, "text-white", "text-[#111111]")}>{t.categories[i % t.categories.length]}</span>
              </div>
              <div className={`text-[10px] uppercase tracking-wider mt-1 ${tc(theme, "text-[#e9e9e9]/55", "text-[#5b6472]")}` }>
                {t.statusLabel}: <span className="text-emerald-500">{t.status}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Partners marquee ---------------- */
function PartnersMarquee({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].partners;
  // Double the list — animate from 0 to -50% for a seamless loop
  const doubled = useMemo(() => [...PARTNERS, ...PARTNERS], []);

  const Card = ({ p, idx }: { p: string; idx: number }) => {
    const meta = PARTNER_META[p] ?? { initials: p.slice(0, 2).toUpperCase(), color: "#1d3fba", bg: "rgba(29,63,186,0.12)" };
    return (
      <div
        key={`${p}-${idx}`}
        className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-5 min-w-[130px] w-[130px] flex-shrink-0"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black tracking-tight shrink-0 border"
          style={{ background: meta.bg, color: meta.color, borderColor: `${meta.color}40`, boxShadow: `0 0 12px ${meta.color}22` }}
        >
          {meta.initials}
        </div>
        <span className={`text-xs font-bold tracking-wide text-center leading-tight ${tc(theme, "text-white/80", "text-[#111111]/75")}`}>{p}</span>
      </div>
    );
  };

  return (
    <section id="partners" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} theme={theme} />
      </div>

      <div className="relative overflow-hidden mask-fade">
        <div
          className="flex gap-4"
          style={{ direction: "ltr", width: "max-content", animation: "marquee 30s linear infinite" }}
        >
          {doubled.map((p, i) => <Card key={`${p}-${i}`} p={p} idx={i} />)}
        </div>
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
  const services = translations[lang].booking.services;
  const waLink = `https://wa.me/${WA_NUMBER}`;
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
          <form className="lg:col-span-3 glass-card blue-glow p-6 sm:p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); alert(lang === "ar" ? "تم إرسال الرسالة" : "Message sent"); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label={t.labels.fullName} required theme={theme} />
              <InputField label={t.labels.company} theme={theme} />
              <InputField label={t.labels.phone} type="tel" theme={theme} />
              <InputField label={t.labels.email} type="email" theme={theme} />
            </div>
            <label className="block">
              <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{t.labels.service}</span>
              <select className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white [&>option]:bg-black", "bg-white border-[#1d3fba]/15 text-[#111111] [&>option]:bg-white")}` }>
                <option value="">—</option>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{t.labels.message}</span>
              <textarea rows={5} className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white", "bg-white border-[#1d3fba]/15 text-[#111111]")}` } />
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

function InputField({ label, type = "text", required, theme }: { label: string; type?: string; required?: boolean; theme: Theme }) {
  return (
    <label className="block">
      <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(theme, "text-white/70", "text-[#3d4451]")}` }>{label}</span>
      <input type={type} required={required} className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] ${tc(theme, "bg-white/[0.03] border-white/10 text-white", "bg-white border-[#1d3fba]/15 text-[#111111]")}` } />
    </label>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = translations[lang].footer;
  const isAr = lang === "ar";

  // Company column: label → section anchor
  const companyLinks = [
    { label: isAr ? "من نحن"       : "About",    href: "#about" },
    { label: isAr ? "رؤيتنا"       : "Vision",   href: "#about" },
    { label: isAr ? "الخدمات"      : "Services", href: "#services" },
    { label: isAr ? "الحجز"        : "Booking",  href: "/booking" },
    { label: isAr ? "المشاريع"     : "Projects", href: "#projects" },
    { label: isAr ? "الشركاء"      : "Partners", href: "#partners" },
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
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Floating actions ---------------- */
function FloatingActions({ lang, theme }: { lang: Lang; theme: Theme }) {
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