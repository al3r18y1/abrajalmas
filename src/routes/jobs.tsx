import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft, ArrowRight, Home as HomeIcon, AppWindow, Sparkles, Building2, MessageCircle, Briefcase, Users, TrendingUp, Award, CheckCircle2, Send, FileText, Upload, X, Loader2 } from "lucide-react";
import { translations, type Lang, WA_NUMBER } from "@/components/abraj/translations";
import type { Theme } from "@/components/abraj/AbrajSite";
import { motion } from "framer-motion";
import logoWhite from "@/assets/abraj-logo-white.png";
import logoBlack from "@/assets/abraj-logo-black.png";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "الوظائف — أبراج الماس | Careers — ABRAJ ALMAS" },
      { name: "description", content: "انضم إلى فريق أبراج الماس. وظائف متاحة في مجال الشبكات والتكنولوجيا." },
    ],
  }),
  component: JobsPage,
});

// Job Position Type
interface JobPosition {
  id: string;
  title_ar: string;
  title_en: string;
  type_ar: string;
  type_en: string;
  description_ar: string;
  description_en: string;
  is_active: boolean;
  display_order: number;
}

const tc = (theme: Theme, night: string, day: string) =>
  theme === "night" ? night : day;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function JobsPage() {
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

  const [formStep, setFormStep] = useState<"form" | "success" | "loading">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    position: "",
    positionId: "",
    experience: "",
    education: "",
    specialization: "",
    skills: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);

  const t = translations[lang];
  const jobsT = t.jobs;
  const isAr = lang === "ar";

  // Load job positions from Supabase
  useEffect(() => {
    loadJobPositions();
  }, []);

  const loadJobPositions = async () => {
    try {
      setLoadingPositions(true);
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setPositions(data || []);
    } catch (error) {
      console.error('Error loading job positions:', error);
      // Fallback to hardcoded positions if DB fails
      setPositions([]);
    } finally {
      setLoadingPositions(false);
    }
  };

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = jobsT.validation.fullName;
    if (!formData.email.trim()) newErrors.email = jobsT.validation.email;
    if (!formData.phone.trim()) newErrors.phone = jobsT.validation.phone;
    if (!formData.position) newErrors.position = jobsT.validation.position;
    if (!formData.experience) newErrors.experience = jobsT.validation.experience;
    if (!formData.education) newErrors.education = jobsT.validation.education;
    if (!formData.specialization.trim()) newErrors.specialization = jobsT.validation.specialization;
    if (!formData.skills.trim()) newErrors.skills = jobsT.validation.skills;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setFormStep("loading");
      
      // Save to Supabase
      const { error } = await supabase
        .from('job_applications')
        .insert([{
          position_id: formData.positionId || null,
          position_title: formData.position,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          experience: formData.experience,
          education: formData.education,
          specialization: formData.specialization,
          skills: formData.skills,
          message: formData.message || null,
          status: 'new'
        }]);

      if (error) throw error;

      // Also send via WhatsApp
      const waMessage = jobsT.waTemplate(formData);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`, "_blank");
      
      setFormStep("success");
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(isAr ? 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.' : 'Error submitting application. Please try again.');
      setFormStep("form");
    }
  };

  const handleReset = () => {
    setFormStep("form");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      whatsapp: "",
      position: "",
      positionId: "",
      experience: "",
      education: "",
      specialization: "",
      skills: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <div
      dir={t.dir}
      className={`${t.fontClass} ${theme === "day" ? "day-mode" : "night-mode"} transition-colors duration-500 ${tc(theme, "bg-black text-white", "bg-[#f7f8fb] text-[#111111]")} min-h-screen pb-20`}
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
          loading="eager"
          decoding="async"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {formStep === "form" || formStep === "loading" ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-12"
          >
            {/* Hero Section */}
            <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${tc(theme, "border-white/15 bg-white/[0.05]", "border-[#1d3fba]/20 bg-[#1d3fba]/5")}`}>
                <Briefcase className="w-4 h-4 text-[#1d3fba]" />
                <span className={`text-sm font-semibold ${tc(theme, "text-[#6b9eff]", "text-[#1d3fba]")}`}>
                  {isAr ? "نحن نوظف" : "We're Hiring"}
                </span>
              </div>
              <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {jobsT.title}
              </h1>
              <p className={`text-lg leading-relaxed ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}`}>
                {jobsT.subtitle}
              </p>
            </motion.div>

            {/* Intro Section */}
            <motion.div
              variants={fadeUp}
              className={`rounded-3xl border backdrop-blur-xl p-8 ${tc(theme, "border-white/10 bg-white/[0.03]", "border-[#1d3fba]/15 bg-white/70")}`}
            >
              <p className={`text-lg leading-relaxed ${tc(theme, "text-[#e9e9e9]/85", "text-[#5b6472]")}`}>
                {jobsT.intro}
              </p>
            </motion.div>

            {/* Why Join Us */}
            <motion.div variants={fadeUp} className="space-y-8">
              <h2 className={`text-3xl font-bold text-center ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {jobsT.whyJoin}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {jobsT.benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`rounded-2xl border backdrop-blur-xl p-6 ${tc(theme, "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]", "border-[#1d3fba]/15 bg-white/70 hover:bg-white")} transition-all`}
                  >
                    <CheckCircle2 className={`w-10 h-10 mb-4 ${tc(theme, "text-[#4d7aff]", "text-[#1d3fba]")}`} />
                    <h3 className={`text-lg font-bold mb-2 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${tc(theme, "text-[#e9e9e9]/75", "text-[#5b6472]")}`}>
                      {benefit.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Open Positions */}
            <motion.div variants={fadeUp} className="space-y-8">
              <h2 className={`text-3xl font-bold text-center ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                {jobsT.openPositions}
              </h2>
              {loadingPositions ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className={`w-10 h-10 animate-spin ${tc(theme, "text-[#4d7aff]", "text-[#1d3fba]")}`} />
                </div>
              ) : positions.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {positions.map((position, idx) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`rounded-2xl border backdrop-blur-xl p-6 flex items-start gap-4 ${tc(theme, "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]", "border-[#1d3fba]/15 bg-white/70 hover:bg-white")} transition-all`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tc(theme, "bg-[#1d3fba]/20", "bg-[#1d3fba]/10")}`}>
                        <Briefcase className={`w-6 h-6 ${tc(theme, "text-[#4d7aff]", "text-[#1d3fba]")}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className={`text-xl font-bold ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                            {isAr ? position.title_ar : position.title_en}
                          </h3>
                          <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${tc(theme, "bg-[#1d3fba]/20 text-[#6b9eff]", "bg-[#1d3fba]/10 text-[#1d3fba]")}`}>
                            {isAr ? position.type_ar : position.type_en}
                          </span>
                        </div>
                        <p className={`text-sm ${tc(theme, "text-[#e9e9e9]/75", "text-[#5b6472]")}`}>
                          {isAr ? position.description_ar : position.description_en}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-20 ${tc(theme, "text-[#e9e9e9]/60", "text-[#5b6472]")}`}>
                  <p>{isAr ? 'لا توجد وظائف متاحة حالياً' : 'No positions available at the moment'}</p>
                </div>
              )}
            </motion.div>

            {/* Application Form */}
            <motion.div variants={fadeUp} id="apply" className="space-y-8">
              <div className="text-center">
                <h2 className={`text-3xl font-bold mb-4 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
                  {jobsT.applyNow}
                </h2>
                <p className={`text-lg ${tc(theme, "text-[#e9e9e9]/75", "text-[#5b6472]")}`}>
                  {jobsT.formTitle}
                </p>
              </div>

              <div className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-10 max-w-3xl mx-auto ${tc(theme, "border-white/10 bg-white/[0.03]", "border-[#1d3fba]/15 bg-white/70")}`}>
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.fullName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                        {jobsT.labels.email} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                        {jobsT.labels.phone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.whatsapp}
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.position} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => {
                        const selectedPos = positions.find(p => (isAr ? p.title_ar : p.title_en) === e.target.value);
                        setFormData({ 
                          ...formData, 
                          position: e.target.value,
                          positionId: selectedPos?.id || ''
                        });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                      style={theme === "night" ? { colorScheme: "dark" } : {}}
                    >
                      <option value="" style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>{isAr ? "اختر الوظيفة" : "Select Position"}</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={isAr ? pos.title_ar : pos.title_en} style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>
                          {isAr ? pos.title_ar : pos.title_en}
                        </option>
                      ))}
                    </select>
                    {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                  </div>

                  {/* Experience & Education */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                        {jobsT.labels.experience} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                        style={theme === "night" ? { colorScheme: "dark" } : {}}
                      >
                        <option value="" style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>{isAr ? "اختر" : "Select"}</option>
                        {jobsT.experienceYears.map((exp, idx) => (
                          <option key={idx} value={exp} style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>{exp}</option>
                        ))}
                      </select>
                      {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                        {jobsT.labels.education} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                        style={theme === "night" ? { colorScheme: "dark" } : {}}
                      >
                        <option value="" style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>{isAr ? "اختر" : "Select"}</option>
                        {jobsT.educationLevels.map((edu, idx) => (
                          <option key={idx} value={edu} style={theme === "night" ? { backgroundColor: "#1a1a1a", color: "#ffffff" } : {}}>{edu}</option>
                        ))}
                      </select>
                      {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.specialization} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                    />
                    {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.skills} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all resize-none ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                    />
                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${tc(theme, "text-white", "text-[#3d4451]")}`}>
                      {jobsT.labels.message}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md transition-all resize-none ${tc(theme, "bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-[#1d3fba]/50 focus:bg-white/[0.08]", "bg-white/80 border-[#1d3fba]/15 text-[#111111] placeholder:text-[#8a95a8] focus:border-[#1d3fba]/40 focus:bg-white")} outline-none`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={formStep === "loading"}
                    className="w-full py-4 rounded-xl bg-[#1d3fba] text-white font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-[#1d3fba]/30 blue-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStep === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isAr ? "جاري الإرسال..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {jobsT.sendWa}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${tc(theme, "bg-green-500/20", "bg-green-500/10")}`}>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${tc(theme, "text-white", "text-[#0b0b0b]")}`}>
              {jobsT.success.title}
            </h2>
            <p className={`text-lg mb-10 ${tc(theme, "text-[#e9e9e9]/80", "text-[#5b6472]")}`}>
              {jobsT.success.message}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all ${tc(theme, "border-white/15 bg-white/[0.05] text-white hover:bg-white/10", "border-[#1d3fba]/20 bg-white text-[#1d3fba] hover:bg-[#1d3fba]/5")}`}
              >
                <HomeIcon className="w-4 h-4" />
                {jobsT.success.backHome}
              </Link>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1d3fba] text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#1d3fba]/30 blue-glow"
              >
                <FileText className="w-4 h-4" />
                {jobsT.success.another}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── Mobile App Bottom Nav ── */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-2xl ${tc(theme, "bg-[#0a0a0a]/92 border-white/8", "bg-white/95 border-[#1d3fba]/10")}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-end justify-around w-full px-1 pt-2 pb-1">
          {([
            { id: "home",     icon: HomeIcon,       label: isAr ? "الرئيسية" : "Home",     href: "/",        active: false },
            { id: "services", icon: AppWindow,      label: isAr ? "الخدمات"  : "Services", href: "/#services", active: false },
            { id: "jobs",     icon: Briefcase,      label: isAr ? "الوظائف"  : "Jobs",     href: "/jobs",    active: true  },
            { id: "booking",  icon: Sparkles,       label: isAr ? "احجز"     : "Book",     href: "/booking", active: false },
            { id: "contact",  icon: MessageCircle,  label: isAr ? "تواصل"    : "Contact",  href: "/#contact",  active: false },
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
