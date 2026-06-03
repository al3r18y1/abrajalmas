import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  ArrowLeft,
  ArrowRight,
  Home as HomeIcon,
  AppWindow,
  Sparkles,
  Building2,
  MessageCircle,
  MapPin,
  Tag,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, WA_NUMBER, type Lang } from "@/components/abraj/translations";
import type { Theme } from "@/components/abraj/AbrajSite";
import { supabase, isSupabaseConfigured, type DbProject } from "@/lib/supabase";
import logoWhite from "@/assets/abraj-logo-white.png";
import logoBlack from "@/assets/abraj-logo-black.png";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
});

const tc = (theme: Theme, night: string, day: string) =>
  theme === "night" ? night : day;

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

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

  const [project, setProject] = useState<DbProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Lightbox state for gallery
  const [lightbox, setLightbox] = useState<string | null>(null);
  // Quick note + share UI state
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

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
    let active = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      if (!isSupabaseConfigured || !supabase) {
        if (active) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();
        if (!active) return;
        if (error || !data) {
          setNotFound(true);
        } else {
          setProject(data as DbProject);
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [projectId]);

  const title = project ? (isAr ? project.title_ar : project.title_en || project.title_ar) : "";
  const location = project ? (isAr ? project.location_ar : project.location_en || project.location_ar) : "";
  const description = project
    ? (isAr ? project.description_ar : project.description_en || project.description_ar)
    : "";
  const details = project ? (isAr ? project.details_ar : project.details_en || project.details_ar) || [] : [];
  const gallery = project?.gallery || [];
  const category = project?.category || "";

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleWebShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: pageUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const waText = isAr
    ? `مرحباً، أرغب بطلب خدمة مماثلة لمشروع: ${title}${location ? ` (${location})` : ""}.${note ? `\nملاحظات: ${note}` : ""}\n${pageUrl}`
    : `Hello, I'd like to request a service similar to project: ${title}${location ? ` (${location})` : ""}.${note ? `\nNotes: ${note}` : ""}\n${pageUrl}`;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

  const requestSameService = () => {
    const serviceLabel = category || title;
    navigate({
      to: "/booking",
      search: {
        service: serviceLabel,
        note: isAr
          ? `طلب خدمة مماثلة لمشروع: ${title}${location ? ` — ${location}` : ""}${note ? `\n${note}` : ""}`
          : `Request similar to project: ${title}${location ? ` — ${location}` : ""}${note ? `\n${note}` : ""}`,
      } as never,
    });
  };

  return (
    <div
      dir={t.dir}
      className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen pb-24`}
    >
      {/* Top bar */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16 border-b backdrop-blur-xl ${tc(theme, "bg-black/70 border-white/8", "bg-white/80 border-[#1d3fba]/10")}`}
      >
        <button
          onClick={() => navigate({ to: "/", hash: "projects" })}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 ${tc(theme, "text-white/80", "text-[#3d4451]")}`}
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isAr ? "المشاريع" : "Projects"}
        </button>

        <img src={theme === "night" ? logoWhite : logoBlack} alt="Abraj Almas" className="h-8 w-auto" />

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

      {/* Body */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#1d3fba]" />
          <p className={tc(theme, "text-white/60", "text-[#5b6472]")}>{isAr ? "جارٍ التحميل..." : "Loading..."}</p>
        </div>
      ) : notFound || !project ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5 px-6 text-center">
          <Building2 className={`w-14 h-14 ${tc(theme, "text-white/30", "text-[#1d3fba]/30")}`} />
          <h1 className="text-2xl font-extrabold">{isAr ? "المشروع غير موجود" : "Project not found"}</h1>
          <p className={tc(theme, "text-white/60", "text-[#5b6472]")}>
            {isAr ? "قد يكون الرابط غير صحيح أو تم حذف المشروع." : "The link may be invalid or the project was removed."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow transition-all"
          >
            {isAr ? "العودة للرئيسية" : "Back home"}
          </Link>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full rounded-3xl overflow-hidden"
            style={
              theme === "night"
                ? { border: "1px solid rgba(255,255,255,0.08)" }
                : { border: "1px solid rgba(29,63,186,0.10)", boxShadow: "0 20px 50px rgba(29,63,186,0.12)" }
            }
          >
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={title}
                className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover"
              />
            ) : (
              <div className={`w-full h-64 sm:h-80 flex items-center justify-center ${tc(theme, "bg-white/[0.04]", "bg-[#1d3fba]/[0.05]")}`}>
                <Building2 className="w-16 h-16 text-[#1d3fba]/40" />
              </div>
            )}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${tc(theme, "from-black/60 via-transparent to-transparent", "from-black/30 via-transparent to-transparent")}`} />
          </motion.div>

          {/* Title + meta */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-[#1d3fba]">
                  <Tag className="w-3.5 h-3.5" />
                  {category}
                </span>
              )}
              {location && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tc(theme, "border-white/12 bg-white/[0.04] text-white/80", "border-[#1d3fba]/15 bg-white/70 text-[#3d4451]")}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}
            </div>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`mt-6 text-base sm:text-lg leading-relaxed ${tc(theme, "text-[#e9e9e9]/85", "text-[#3d4451]")}`}
            >
              {description}
            </motion.p>
          )}

          {/* Detail points */}
          {details.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <h2 className={`text-xl font-bold mb-4 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {isAr ? "تفاصيل المشروع" : "Project Details"}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {details.map((d, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 p-4 rounded-2xl border ${tc(theme, "border-white/8 bg-white/[0.03]", "border-[#1d3fba]/10 bg-white/70")}`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#1d3fba] shrink-0 mt-0.5" />
                    <span className={tc(theme, "text-[#e9e9e9]/90", "text-[#3d4451]")}>{d}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10"
            >
              <h2 className={`text-xl font-bold mb-4 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {isAr ? "صور إضافية" : "Gallery"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(g)}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                    style={
                      theme === "night"
                        ? { border: "1px solid rgba(255,255,255,0.08)" }
                        : { border: "1px solid rgba(29,63,186,0.10)" }
                    }
                  >
                    <img
                      src={g}
                      alt={`${title} ${i + 1}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share + Request */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`mt-12 p-6 sm:p-8 rounded-3xl border ${tc(theme, "border-white/8 bg-white/[0.03]", "border-[#1d3fba]/10 bg-white/70")}`}
          >
            {/* Share buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 text-sm font-bold ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                <Share2 className="w-4 h-4 text-[#1d3fba]" />
                {isAr ? "مشاركة المشروع" : "Share project"}
              </span>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#111111] hover:bg-[#e6eaf5]")}`}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? (isAr ? "تم النسخ" : "Copied") : isAr ? "نسخ الرابط" : "Copy link"}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#25D366] text-white hover:brightness-110 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                {isAr ? "واتساب" : "WhatsApp"}
              </a>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleWebShare}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${tc(theme, "border-white/12 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-[#f0f2f8] text-[#111111] hover:bg-[#e6eaf5]")}`}
                >
                  <Share2 className="w-4 h-4" />
                  {isAr ? "مشاركة" : "Share"}
                </button>
              )}
            </div>

            {/* Request same service */}
            <div className={`mt-6 pt-6 border-t ${tc(theme, "border-white/8", "border-[#1d3fba]/10")}`}>
              <label className={`block text-sm font-bold mb-2 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {isAr ? "اطلب نفس الخدمة" : "Request the same service"}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={isAr ? "ملاحظات إضافية (اختياري)..." : "Additional notes (optional)..."}
                className={`w-full rounded-2xl px-4 py-3 text-sm outline-none border transition-colors resize-none ${tc(theme, "bg-white/[0.04] border-white/12 text-white placeholder-white/40 focus:border-[#1d3fba]", "bg-white border-[#1d3fba]/15 text-[#111111] placeholder-[#8a95a8] focus:border-[#1d3fba]")}`}
              />
              <button
                onClick={requestSameService}
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {isAr ? "اطلب الخدمة الآن" : "Request now"}
              </button>
            </div>
          </motion.div>
        </main>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-2xl ${tc(theme, "bg-[#0a0a0a]/92 border-white/8", "bg-white/95 border-[#1d3fba]/10")}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-end justify-around w-full px-1 pt-2 pb-1">
          {([
            { id: "home", icon: HomeIcon, label: isAr ? "الرئيسية" : "Home", href: "/", active: false },
            { id: "services", icon: AppWindow, label: isAr ? "الخدمات" : "Services", href: "/#services", active: false },
            { id: "booking", icon: Sparkles, label: isAr ? "احجز" : "Book", href: "/booking", active: false },
            { id: "projects", icon: Building2, label: isAr ? "المشاريع" : "Projects", href: "/#projects", active: true },
            { id: "contact", icon: MessageCircle, label: isAr ? "تواصل" : "Contact", href: "/#contact", active: false },
          ] as const).map(({ id, icon: Icon, label, href, active }) =>
            active ? (
              <span key={id} className="flex flex-col items-center -translate-y-3">
                <span className="w-14 h-14 rounded-full bg-[#1d3fba] flex items-center justify-center text-white shadow-xl shadow-[#1d3fba]/40 blue-glow">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[9px] mt-0.5 font-bold text-[#1d3fba]">{label}</span>
              </span>
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
