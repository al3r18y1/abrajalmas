import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Network, Wrench, Camera, Cpu, Cable, AppWindow, Compass, Wifi,
  Phone, Mail, Globe, MapPin, MessageCircle, ChevronRight, Diamond,
  ShieldCheck, Zap, Gem, Headphones, Users, Building2, Store, Warehouse,
  Hotel, School, Landmark, Home as HomeIcon, Server, ArrowUpRight, Sparkles, Languages,
} from "lucide-react";
import logoHorizontal from "@/assets/abraj-logo-horizontal.png";
import logoSymbol from "@/assets/abraj-logo-symbol.png";
import { translations, PARTNERS, PHONES, WA_NUMBER, EMAIL, WEBSITE, type Lang } from "./translations";
import { BookingSection } from "./BookingSection";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const SERVICE_ICONS = [Network, Wrench, Camera, Cpu, Cable, AppWindow, Compass, Wifi];
const WHY_ICONS = [ShieldCheck, Zap, Gem, Headphones, Users];
const BIZ_ICONS = [Building2, Store, Warehouse, Hotel, School, Landmark, HomeIcon, Server];

export default function AbrajSite() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = translations[lang];
  const isAr = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  return (
    <div dir={t.dir} lang={lang} className={`${t.fontClass} bg-black text-white min-h-screen overflow-x-hidden`}>
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <AboutSection lang={lang} />
      <VisionSection lang={lang} />
      <WhyUsSection lang={lang} />
      <ServicesSection lang={lang} />
      <ProcessSection lang={lang} />
      <BookingSection lang={lang} />
      <ProjectsSection lang={lang} />
      <PartnersMarquee lang={lang} />
      <BusinessSolutionsSection lang={lang} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />
      <FloatingActions lang={lang} />
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
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

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-black/30 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2">
          <img src={logoSymbol} alt={lang === "ar" ? "شعار شركة أبراج الماس" : "ABRAJ ALMAS Logo"} className="h-9 sm:h-11 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-wide text-white">ABRAJ ALMAS</span>
            <span className="text-[10px] text-[#e9e9e9]/60">Network · Computers · Cameras</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="px-3 py-2 text-sm text-[#e9e9e9] hover:text-[#fcb630] transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} />
          <a href="#booking" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fcb630] text-black text-sm font-bold hover:brightness-110 gold-glow">
            {t.cta}
          </a>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-lg border border-white/10 text-white" aria-label="menu">
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
            className="lg:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="py-2.5 px-3 rounded-lg text-[#e9e9e9] hover:bg-white/5">{l.label}</a>
              ))}
              <a href="#booking" onClick={() => setOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-[#fcb630] text-black font-bold">{t.cta}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-xs">
      <Languages className="w-3.5 h-3.5 mx-2 text-[#e9e9e9]/60" />
      <button
        onClick={() => setLang("ar")}
        className={`px-3 py-1.5 rounded-full font-semibold transition-all ${lang === "ar" ? "bg-[#1d3fba] text-white" : "text-[#e9e9e9]/70"}`}
      >العربية</button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full font-semibold transition-all ${lang === "en" ? "bg-[#1d3fba] text-white" : "text-[#e9e9e9]/70"}`}
      >English</button>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang].hero;
  return (
    <section id="home" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <BackgroundFx />
      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="mx-auto mb-8 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center blue-glow">
            <img src={logoSymbol} alt="" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
          </motion.div>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-[#e9e9e9] text-xs sm:text-sm mb-6">
            <Diamond className="w-3.5 h-3.5 text-[#fcb630]" />
            {t.label}
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            {t.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-base sm:text-lg text-[#e9e9e9]/85 max-w-3xl mx-auto">
            {t.sub}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-sm sm:text-base text-[#e9e9e9]/60 max-w-3xl mx-auto leading-relaxed">
            {t.para}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fcb630] text-black font-bold hover:brightness-110 gold-glow">
              {t.primary} <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] backdrop-blur-md">
              {t.secondary}
            </a>
            <a href="#partners" className="inline-flex items-center gap-1 text-sm text-[#e9e9e9]/70 hover:text-[#fcb630] underline-offset-4 hover:underline px-3 py-2">
              {t.third} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {t.badges.map((b) => (
              <span key={b} className="px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/[0.04] text-[#e9e9e9]/85 backdrop-blur">
                {b}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BackgroundFx() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#1d3fba] blur-[140px] opacity-40"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-[#fcb630] blur-[160px] opacity-25"
      />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#1d3fba]/15"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-[#1d3fba]/10"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
    </div>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({ eyebrow, title, subtitle, lang }: { eyebrow?: string; title: string; subtitle?: string; lang: Lang }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
      {eyebrow && (
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-[#fcb630] text-xs mb-4">
          <Diamond className="w-3.5 h-3.5" />{eyebrow}
        </motion.div>
      )}
      <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{title}</motion.h2>
      {subtitle && <motion.p variants={fadeUp} className="mt-4 text-[#e9e9e9]/80">{subtitle}</motion.p>}
    </motion.div>
  );
}

/* ---------------- About ---------------- */
function AboutSection({ lang }: { lang: Lang }) {
  const t = translations[lang].about;
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid lg:grid-cols-2 gap-10 items-start mb-12">
          <motion.p variants={fadeUp} className="text-[#e9e9e9]/85 leading-relaxed text-lg">{t.p1}</motion.p>
          <motion.p variants={fadeUp} className="text-[#e9e9e9]/85 leading-relaxed text-lg">{t.p2}</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid md:grid-cols-3 gap-6">
          {t.cards.map((c) => (
            <motion.div key={c.title} variants={fadeUp} whileHover={{ y: -6 }} className="glass-card p-7 hover:blue-glow transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4">
                <Diamond className="w-5 h-5 text-[#fcb630]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
              <p className="text-[#e9e9e9]/75 text-sm leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Vision ---------------- */
function VisionSection({ lang }: { lang: Lang }) {
  const t = translations[lang].vision;
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="glass-card blue-glow-strong p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3fba]/10 via-transparent to-[#fcb630]/5 pointer-events-none" />
          <div className="relative">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#fcb630]/15 border border-[#fcb630]/40 flex items-center justify-center mb-6">
              <Diamond className="w-6 h-6 text-[#fcb630]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">{t.title}</h2>
            <p className="text-lg sm:text-xl text-[#e9e9e9]/85 leading-relaxed max-w-3xl mx-auto">{t.text}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
function WhyUsSection({ lang }: { lang: Lang }) {
  const t = translations[lang].whyUs;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} lang={lang} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {t.items.map((it, i) => {
            const Icon = WHY_ICONS[i] || ShieldCheck;
            return (
              <motion.div key={it.title} variants={fadeUp} whileHover={{ y: -6 }} className="glass-card p-6 hover:blue-glow transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#fcb630]/15 border border-[#fcb630]/40 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#fcb630]" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{it.title}</h3>
                <p className="text-[#e9e9e9]/70 text-xs leading-relaxed">{it.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function ServicesSection({ lang }: { lang: Lang }) {
  const t = translations[lang].services;
  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {t.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i] || Network;
            return (
              <motion.div key={s.title} variants={fadeUp} whileHover={{ y: -6 }} className="glass-card p-6 hover:blue-glow transition-all flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#fcb630]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[#e9e9e9]/70 text-sm leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {s.features.map((f) => (
                    <li key={f} className="text-xs text-[#e9e9e9]/80 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#fcb630] flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <a href="#booking" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm text-[#fcb630] hover:bg-[#fcb630]/10 hover:border-[#fcb630]/40 transition-all">
                  {t.bookCta} <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
function ProcessSection({ lang }: { lang: Lang }) {
  const t = translations[lang].process;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />
        <div className="relative">
          <div className="hidden lg:block absolute top-10 inset-x-10 h-px bg-gradient-to-r from-transparent via-[#1d3fba]/60 to-transparent" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid lg:grid-cols-5 gap-5">
            {t.steps.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} className="glass-card p-6 hover:blue-glow transition-all relative">
                <div className="w-12 h-12 rounded-full bg-black border-2 border-[#fcb630] text-[#fcb630] font-extrabold flex items-center justify-center mb-4 gold-glow">{i + 1}</div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[#e9e9e9]/70 text-xs leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
function ProjectsSection({ lang }: { lang: Lang }) {
  const t = translations[lang].projects;
  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {t.items.map((name, i) => (
            <motion.div key={name} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-5 hover:blue-glow transition-all">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#1d3fba]/25 via-[#1d3fba]/10 to-transparent border border-white/10 flex items-center justify-center mb-4 relative overflow-hidden">
                <Diamond className="w-8 h-8 text-[#fcb630]/70" />
                <div className="absolute inset-0 grid-pattern opacity-30" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{name}</h3>
              <div className="text-[10px] text-[#e9e9e9]/55 uppercase tracking-wider">
                {t.categoryLabel}: <span className="text-[#fcb630]">{t.categories[i % t.categories.length]}</span>
              </div>
              <div className="text-[10px] text-[#e9e9e9]/55 uppercase tracking-wider mt-1">
                {t.statusLabel}: <span className="text-emerald-400">{t.status}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Partners marquee ---------------- */
function PartnersMarquee({ lang }: { lang: Lang }) {
  const t = translations[lang].partners;
  const doubled = useMemo(() => [...PARTNERS, ...PARTNERS], []);
  return (
    <section id="partners" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />
        <div className="relative overflow-hidden mask-fade">
          <div className="flex gap-4 w-max animate-marquee" style={{ direction: "ltr" }}>
            {doubled.map((p, i) => (
              <div key={`${p}-${i}`} className="glass-card px-7 py-5 flex items-center justify-center min-w-[180px] hover:border-[#fcb630]/60 hover:blue-glow transition-all">
                <span className="text-lg font-extrabold tracking-wide text-white/85 hover:text-white">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Business solutions ---------------- */
function BusinessSolutionsSection({ lang }: { lang: Lang }) {
  const t = translations[lang].business;
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} lang={lang} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.items.map((it, i) => {
            const Icon = BIZ_ICONS[i] || Building2;
            return (
              <motion.div key={it.title} variants={fadeUp} whileHover={{ y: -6 }} className="glass-card p-6 hover:blue-glow transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#fcb630]" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{it.title}</h3>
                <p className="text-[#e9e9e9]/70 text-xs leading-relaxed">{it.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function ContactSection({ lang }: { lang: Lang }) {
  const t = translations[lang].contact;
  const services = translations[lang].booking.services;
  const waLink = `https://wa.me/${WA_NUMBER}`;
  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={t.title} subtitle={t.subtitle} lang={lang} />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ContactCard icon={Globe} title="Website" value={WEBSITE} href={`https://${WEBSITE}`} />
            <ContactCard icon={Mail} title="Email" value={EMAIL} href={`mailto:${EMAIL}`} />
            {PHONES.map((p) => (
              <ContactCard key={p} icon={Phone} title="Phone" value={p} href={`tel:+964${p.replace(/^0/, "")}`} />
            ))}
            <ContactCard icon={MapPin} title={lang === "ar" ? "الموقع" : "Location"} value={t.location} />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a href={`tel:+964${PHONES[0].replace(/^0/, "")}`} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white hover:bg-white/10">
                <Phone className="w-4 h-4 text-[#fcb630]" />{t.quick.call}
              </a>
              <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-sm text-white hover:bg-emerald-500/20">
                <MessageCircle className="w-4 h-4" />{t.quick.wa}
              </a>
              <a href="#booking" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#fcb630] text-black text-sm font-semibold hover:brightness-110">
                <Sparkles className="w-4 h-4" />{t.quick.book}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1d3fba]/20 border border-[#1d3fba]/40 text-sm text-white hover:bg-[#1d3fba]/30">
                <Mail className="w-4 h-4 text-[#fcb630]" />{t.quick.email}
              </a>
            </div>
          </div>

          <form className="lg:col-span-3 glass-card blue-glow p-6 sm:p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); alert(lang === "ar" ? "تم إرسال الرسالة" : "Message sent"); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label={t.labels.fullName} required />
              <InputField label={t.labels.company} />
              <InputField label={t.labels.phone} type="tel" />
              <InputField label={t.labels.email} type="email" />
            </div>
            <label className="block">
              <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">{t.labels.service}</span>
              <select className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fcb630]">
                <option value="" className="bg-black">—</option>
                {services.map((s) => <option key={s} className="bg-black">{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">{t.labels.message}</span>
              <textarea rows={5} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fcb630]" />
            </label>
            <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#fcb630] text-black font-bold hover:brightness-110 gold-glow">
              {t.labels.send} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, title, value, href }: { icon: any; title: string; value: string; href?: string }) {
  const Comp: any = href ? "a" : "div";
  return (
    <Comp href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass-card p-4 flex items-center gap-4 hover:blue-glow transition-all">
      <div className="w-11 h-11 rounded-xl bg-[#1d3fba]/15 border border-[#1d3fba]/40 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#fcb630]" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-white/40">{title}</div>
        <div className="text-sm text-white truncate" dir="ltr">{value}</div>
      </div>
    </Comp>
  );
}

function InputField({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">{label}</span>
      <input type={type} required={required} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fcb630]" />
    </label>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ lang }: { lang: Lang }) {
  const t = translations[lang].footer;
  return (
    <footer className="relative border-t border-white/10 bg-black px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <img src={logoHorizontal} alt={lang === "ar" ? "شعار شركة أبراج الماس" : "ABRAJ ALMAS Logo"} className="h-12 w-auto bg-white rounded-lg p-2 mb-4" />
          <div className="text-[11px] uppercase tracking-wider text-[#fcb630] mb-3">{t.tagline}</div>
          <p className="text-sm text-[#e9e9e9]/70 leading-relaxed">{t.desc}</p>
        </div>
        <FooterCol title={t.colServicesTitle} items={t.colServices} />
        <FooterCol title={t.colCompanyTitle} items={t.colCompany} />
        <FooterCol title={t.colContactTitle} items={t.colContact} ltr />
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-xs text-[#e9e9e9]/50">
        {t.copyright}
      </div>
    </footer>
  );
}

function FooterCol({ title, items, ltr }: { title: string; items: string[]; ltr?: boolean }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-sm text-[#e9e9e9]/70 hover:text-[#fcb630] transition-colors" dir={ltr ? "ltr" : undefined}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Floating actions ---------------- */
function FloatingActions({ lang }: { lang: Lang }) {
  const t = translations[lang].floating;
  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
      <a
        href="#booking"
        className="hidden sm:inline-flex items-center gap-1.5 px-4 h-12 rounded-full bg-[#fcb630] text-black font-bold text-sm hover:brightness-110 gold-glow"
      >
        <Sparkles className="w-4 h-4" />{t.book}
      </a>
    </div>
  );
}