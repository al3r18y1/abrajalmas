import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Send, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { translations, WA_NUMBER, type Lang } from "./translations";
import type { Theme } from "./AbrajSite";

const tc = (theme: Theme, night: string, day: string) => theme === "night" ? night : day;

type BookingData = {
  selectedServices: string[];
  projectType: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  projectSize: string;
  projectDescription: string;
  fullName: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  preferredContactMethod: string;
};

const initialData: BookingData = {
  selectedServices: [],
  projectType: "",
  location: "",
  preferredDate: "",
  preferredTime: "",
  urgency: "",
  projectSize: "",
  projectDescription: "",
  fullName: "",
  companyName: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  preferredContactMethod: "",
};

export function BookingSection({ lang, theme, standalone = false }: { lang: Lang; theme: Theme; standalone?: boolean }) {
  const t = translations[lang].booking;
  const isAr = lang === "ar";
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const topRef = useRef<HTMLElement>(null);

  // Scroll to top of section whenever step changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const update = (field: keyof BookingData, value: any) =>
    setData((d) => ({ ...d, [field]: value }));

  const toggleService = (s: string) => {
    setData((d) => ({
      ...d,
      selectedServices: d.selectedServices.includes(s)
        ? d.selectedServices.filter((x) => x !== s)
        : [...d.selectedServices, s],
    }));
  };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1 && data.selectedServices.length === 0) e.services = t.validation.services;
    if (s === 2) {
      if (!data.projectType) e.projectType = t.validation.projectType;
      if (!data.location.trim()) e.location = t.validation.location;
      if (!data.projectDescription.trim()) e.description = t.validation.description;
    }
    if (s === 3) {
      if (!data.fullName.trim()) e.fullName = t.validation.fullName;
      if (!data.phone.trim() && !data.whatsapp.trim()) e.phone = t.validation.phone;
      if (!data.preferredContactMethod) e.contactMethod = t.validation.contactMethod;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const buildWa = () => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waTemplate(data))}`;

  const submit = () => {
    console.log("[ABRAJ ALMAS] Booking submitted:", data);
    setStep(5);
  };

  const reset = () => {
    setData(initialData);
    setStep(1);
    setErrors({});
  };

  return (
    <section ref={topRef} id="booking" className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 ${standalone ? "scroll-mt-16" : "scroll-mt-20"}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1d3fba]/40 bg-[#1d3fba]/10 text-white text-xs sm:text-sm mb-5">
            <Sparkles className="w-4 h-4" />
            {isAr ? "نظام الحجز" : "Booking System"}
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${tc(theme, "text-white", "text-[#0b0b0b]")}` }>{t.title}</h2>
          <p className={`mt-4 max-w-2xl mx-auto ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}` }>{t.subtitle}</p>
        </motion.div>

        <div className="glass-card blue-glow p-6 sm:p-10">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 gap-2 overflow-x-auto pb-2">
            {t.steps.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-fit">
                  <div
                    className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border text-sm font-bold transition-all ${
                      active
                        ? "bg-[#1d3fba] text-white border-[#1d3fba] blue-glow"
                        : done
                          ? "bg-[#1d3fba] text-white border-[#1d3fba]"
                          : tc(theme, "border-white/15 text-white/50 bg-white/5", "border-[#1d3fba]/20 text-[#5b6472] bg-[#1d3fba]/5")
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : n}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-[10px] uppercase tracking-wider ${tc(theme, "text-white/40", "text-[#5b6472]")}` }>{t.stepLabel} {n}</div>
                    <div className={`text-sm font-medium ${active ? tc(theme, "text-white", "text-[#111111]") : tc(theme, "text-white/60", "text-[#5b6472]")}`}>{label}</div>
                  </div>
                  {n < t.steps.length && (
                    <div className={`relative flex-1 h-px mx-1 overflow-hidden ${tc(theme, "bg-white/10", "bg-[#1d3fba]/15")}`}>
                      <motion.div
                        className="absolute inset-0 bg-[#1d3fba]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: done ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: isAr ? "right" : "left" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? 30 : -30 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${tc(theme, "text-white", "text-[#111111]")}` }>{t.steps[0]}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.services.map((s) => {
                      const selected = data.selectedServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className={`group relative text-start p-5 rounded-2xl border transition-all duration-300 ${
                            selected
                              ? "border-[#1d3fba] bg-[#1d3fba]/10 blue-glow"
                              : tc(theme, "border-white/10 bg-white/[0.02] hover:border-white/25", "border-[#1d3fba]/15 bg-white/60 hover:border-[#1d3fba]/40")
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                                selected ? "bg-[#1d3fba] border-[#1d3fba]" : "border-white/20 bg-white/5"
                              }`}
                            >
                              {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`font-medium ${selected ? "text-white" : tc(theme, "text-[#e9e9e9]", "text-[#111111]")}`}>{s}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.services && <p className="mt-4 text-sm text-red-400">{errors.services}</p>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${tc(theme, "text-white", "text-[#111111]")}` }>{t.steps[1]}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t.labels.projectType} error={errors.projectType}>
                      <Select value={data.projectType} onChange={(v) => update("projectType", v)} options={t.projectTypes} placeholder="—" />
                    </Field>
                    <Field label={t.labels.location} error={errors.location}>
                      <Input value={data.location} onChange={(v) => update("location", v)} />
                    </Field>
                    <Field label={t.labels.preferredDate}>
                      <Input type="date" value={data.preferredDate} onChange={(v) => update("preferredDate", v)} />
                    </Field>
                    <Field label={t.labels.preferredTime}>
                      <Input type="time" value={data.preferredTime} onChange={(v) => update("preferredTime", v)} />
                    </Field>
                    <Field label={t.labels.urgency}>
                      <Select value={data.urgency} onChange={(v) => update("urgency", v)} options={t.urgencies} placeholder="—" />
                    </Field>
                    <Field label={t.labels.projectSize}>
                      <Select value={data.projectSize} onChange={(v) => update("projectSize", v)} options={t.sizes} placeholder="—" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label={t.labels.projectDescription} error={errors.description}>
                        <textarea
                          value={data.projectDescription}
                          onChange={(e) => update("projectDescription", e.target.value)}
                          rows={4}
                          className={`w-full border rounded-xl px-4 py-3 placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] focus:border-transparent ${tc(theme, "bg-white/[0.03] border-white/10 text-white placeholder:text-white/30", "bg-white border-[#1d3fba]/15 text-[#111111]")}`}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label={t.labels.upload}>
                        <input
                          type="file"
                          className="w-full text-sm text-[#e9e9e9] file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1d3fba]/20 file:text-white hover:file:bg-[#1d3fba]/30"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${tc(theme, "text-white", "text-[#111111]")}` }>{t.steps[2]}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t.labels.fullName} error={errors.fullName}>
                      <Input value={data.fullName} onChange={(v) => update("fullName", v)} />
                    </Field>
                    <Field label={t.labels.companyName}>
                      <Input value={data.companyName} onChange={(v) => update("companyName", v)} />
                    </Field>
                    <Field label={t.labels.phone} error={errors.phone}>
                      <Input type="tel" value={data.phone} onChange={(v) => update("phone", v)} dir="ltr" />
                    </Field>
                    <Field label={t.labels.whatsapp}>
                      <Input type="tel" value={data.whatsapp} onChange={(v) => update("whatsapp", v)} dir="ltr" />
                    </Field>
                    <Field label={t.labels.email}>
                      <Input type="email" value={data.email} onChange={(v) => update("email", v)} dir="ltr" />
                    </Field>
                    <Field label={t.labels.city}>
                      <Input value={data.city} onChange={(v) => update("city", v)} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label={t.labels.contactMethod} error={errors.contactMethod}>
                        <div className="flex flex-wrap gap-3">
                          {t.contactMethods.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => update("preferredContactMethod", m)}
                              className={`px-5 py-2.5 rounded-full border text-sm transition-all ${
                                data.preferredContactMethod === m
                                  ? "border-[#1d3fba] bg-[#1d3fba]/20 text-white"
                                  : tc(theme, "border-white/10 bg-white/[0.03] text-[#e9e9e9] hover:border-white/25", "border-[#1d3fba]/15 bg-white/60 text-[#111111] hover:border-[#1d3fba]/40")
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${tc(theme, "text-white", "text-[#111111]")}` }>{t.steps[3]}</h3>
                  <div className="space-y-4">
                    <ReviewBlock label={t.labels.selected}>
                      <div className="flex flex-wrap gap-2">
                        {data.selectedServices.map((s) => (
                          <span key={s} className="px-3 py-1 text-xs rounded-full bg-[#1d3fba]/20 border border-[#1d3fba]/40 text-white">{s}</span>
                        ))}
                      </div>
                    </ReviewBlock>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ReviewBlock label={t.labels.projectType}>{data.projectType || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.location}>{data.location || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.preferredDate}>{data.preferredDate || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.preferredTime}>{data.preferredTime || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.urgency}>{data.urgency || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.projectSize}>{data.projectSize || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.fullName}>{data.fullName || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.companyName}>{data.companyName || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.phone}>{data.phone || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.whatsapp}>{data.whatsapp || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.email}>{data.email || "—"}</ReviewBlock>
                      <ReviewBlock label={t.labels.contactMethod}>{data.preferredContactMethod || "—"}</ReviewBlock>
                    </div>
                    <ReviewBlock label={t.labels.notes}>{data.projectDescription || "—"}</ReviewBlock>
                  </div>
                </div>
              )}

              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="mx-auto w-20 h-20 rounded-full bg-[#1d3fba] flex items-center justify-center blue-glow mb-6">
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${tc(theme, "text-white", "text-[#111111]")}` }>{t.success.title}</h3>
                  <p className={`max-w-lg mx-auto mb-8 ${tc(theme, "text-[#e9e9e9]/80", "text-[#3d4451]")}` }>{t.success.message}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={reset} className={`px-5 py-2.5 rounded-full border ${tc(theme, "bg-white/[0.05] border-white/15 text-white hover:bg-white/10", "bg-white/80 border-[#1d3fba]/15 text-[#111111] hover:bg-white")}` }>{t.success.backHome}</button>
                    <button onClick={reset} className="px-5 py-2.5 rounded-full bg-[#1d3fba] text-white hover:brightness-110">{t.success.another}</button>
                    <a href={buildWa()} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-[#1d3fba] text-white font-semibold hover:brightness-110 inline-flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />{t.success.contactWa}
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          {step < 5 && (
            <div className={`mt-10 flex flex-wrap items-center justify-between gap-3 pt-6 border-t ${tc(theme, "border-white/10", "border-[#1d3fba]/15")}` }>
              <button
                onClick={back}
                disabled={step === 1}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border disabled:opacity-30 ${tc(theme, "border-white/10 bg-white/[0.03] text-white hover:bg-white/10", "border-[#1d3fba]/15 bg-white/60 text-[#111111] hover:bg-white")}` }
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {t.back}
              </button>
              <div className="flex gap-3">
                {step === 4 && (
                  <a href={buildWa()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white font-semibold hover:brightness-110">
                    <MessageCircle className="w-4 h-4" />{t.sendWa}
                  </a>
                )}
                {step < 4 ? (
                  <button onClick={next} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow">
                    {t.next}
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button onClick={submit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1d3fba] text-white font-bold hover:brightness-110 blue-glow">
                    <Send className="w-4 h-4" />{t.submit}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children, error, theme }: { label: string; children: React.ReactNode; error?: string; theme?: Theme }) {
  const _theme = theme ?? "night";
  return (
    <label className="block">
      <span className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${tc(_theme, "text-white/70", "text-[#3d4451]")}` }>{label}</span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-red-400">{error}</span>}
    </label>
  );
}

function Input({ value, onChange, type = "text", dir, theme }: { value: string; onChange: (v: string) => void; type?: string; dir?: "ltr" | "rtl"; theme?: Theme }) {
  const _theme = theme ?? "night";
  return (
    <input
      type={type}
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border rounded-xl px-4 py-3 placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] focus:border-transparent ${tc(_theme, "bg-white/[0.03] border-white/10 text-white placeholder:text-white/30", "bg-white border-[#1d3fba]/15 text-[#111111]")}` }
    />
  );
}

function Select({ value, onChange, options, placeholder, theme }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; theme?: Theme }) {
  const _theme = theme ?? "night";
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1d3fba] focus:border-transparent ${tc(_theme, "bg-white/[0.03] border-white/10 text-white [&>option]:bg-black", "bg-white border-[#1d3fba]/15 text-[#111111] [&>option]:bg-white")}` }
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function ReviewBlock({ label, children, theme }: { label: string; children: React.ReactNode; theme?: Theme }) {
  const _theme = theme ?? "night";
  return (
    <div className={`rounded-2xl border p-4 ${tc(_theme, "border-white/10 bg-white/[0.02]", "border-[#1d3fba]/15 bg-white/60")}` }>
      <div className={`text-[10px] uppercase tracking-wider mb-1 ${tc(_theme, "text-white/40", "text-[#5b6472]")}` }>{label}</div>
      <div className={`text-sm ${tc(_theme, "text-white", "text-[#111111]")}` }>{children}</div>
    </div>
  );
}