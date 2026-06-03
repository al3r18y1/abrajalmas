import React, { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LogOut, Plus, Pencil, Trash2, Save, X, Upload,
  Package, FolderOpen, Users, Calendar, ExternalLink,
  CheckCircle2, AlertCircle, Loader2, Eye, EyeOff,
  Lock, ImageIcon, Link as LinkIcon, ChevronDown, ChevronUp,
  RefreshCw, Star,
} from "lucide-react";
import {
  supabase, isSupabaseConfigured, resizeImage, uploadImage,
  type DbService, type DbProject, type DbPartner, type DbBooking,
} from "@/lib/supabase";
import logoSymbol from "@/assets/abraj-logo-symbol.png";

/* ─── Auth ──────────────────────────────────────────────────── */
const ADMIN_PWD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "abraj2024admin";
const AUTH_KEY  = "abraj-admin-v1";
const makeToken = (p: string) => btoa("ABRAJ_ALMAS:" + p);
const isAuthed  = () => { try { return localStorage.getItem(AUTH_KEY) === makeToken(ADMIN_PWD); } catch { return false; } };
const doLogin   = (p: string) => { if (p === ADMIN_PWD) { localStorage.setItem(AUTH_KEY, makeToken(ADMIN_PWD)); return true; } return false; };
const doLogout  = () => localStorage.removeItem(AUTH_KEY);

/* ─── Route ─────────────────────────────────────────────────── */
export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم — أبراج الماس" }] }),
  component: AdminPage,
});

/* ─── Toast ─────────────────────────────────────────────────── */
type ToastItem = { id: number; type: "ok" | "err"; msg: string };
function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((type: ToastItem["type"], msg: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, ok: (m: string) => add("ok", m), err: (m: string) => add("err", m) };
}
function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2 min-w-[260px]">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-xl
          ${t.type === "ok" ? "bg-green-900/80 border-green-500/40 text-green-200" : "bg-red-900/80 border-red-500/40 text-red-200"}`}>
          {t.type === "ok" ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────────────────────── */
type Tab = "services" | "projects" | "partners" | "bookings";

/* ═══════════════════════════════════════════════════════════════
   AdminPage
═══════════════════════════════════════════════════════════════ */
function AdminPage() {
  // Start as null to avoid SSR/client hydration mismatch (localStorage is client-only).
  // On mount, we check the real auth state.
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAuthed());
  }, []);

  // Still hydrating — render nothing to avoid mismatch
  if (authed === null) return null;

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { doLogout(); setAuthed(false); }} />;
}

/* ─── LoginScreen ───────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (doLogin(pwd)) { onLogin(); }
      else { setError(true); setLoading(false); setPwd(""); }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logoSymbol} alt="ABRAJ ALMAS" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-white/40 text-sm mt-1">أبراج الماس</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="relative">
            <Lock className="absolute top-3 end-3 w-4 h-4 text-white/30" />
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false); }}
              placeholder="كلمة المرور"
              className="w-full bg-white/5 border border-white/10 rounded-xl pe-10 ps-10 py-3 text-white text-sm outline-none focus:border-[#1d3fba]/60 transition-colors"
              dir="ltr"
              autoFocus
            />
            <button type="button" onClick={() => setShow(v => !v)} className="absolute top-3 start-3 text-white/30 hover:text-white/60">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> كلمة المرور غير صحيحة
            </div>
          )}
          <button type="submit" disabled={loading || !pwd}
            className="w-full py-3 rounded-xl bg-[#1d3fba] text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:brightness-110 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("services");
  const { toasts, ok, err } = useToast();

  const tabs: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: "services", label: "الخدمات",    Icon: Package    },
    { id: "projects", label: "المشاريع",   Icon: FolderOpen },
    { id: "partners", label: "الشركاء",    Icon: Users      },
    { id: "bookings", label: "طلبات الحجز", Icon: Calendar  },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSymbol} alt="" className="w-7 h-7" />
            <span className="font-bold text-sm">لوحة التحكم — أبراج الماس</span>
          </div>
          <div className="flex items-center gap-3">
            {!isSupabaseConfigured && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> وضع غير متصل
              </span>
            )}
            <a href="/" target="_blank" rel="noopener" className="text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> الموقع
            </a>
            <button onClick={onLogout} className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1.5 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> خروج
            </button>
          </div>
        </div>
      </header>

      {/* Tabs nav */}
      <div className="border-b border-white/8 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto">
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  tab === id ? "border-[#1d3fba] text-[#4d7fff]" : "border-transparent text-white/50 hover:text-white/80"
                }`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === "services" && <ServicesTab toast={{ ok, err }} />}
        {tab === "projects" && <ProjectsTab toast={{ ok, err }} />}
        {tab === "partners" && <PartnersTab toast={{ ok, err }} />}
        {tab === "bookings" && <BookingsTab toast={{ ok, err }} />}
      </main>

      <Toasts toasts={toasts} />
    </div>
  );
}

type Toast = { ok: (m: string) => void; err: (m: string) => void };

/* ═══════════════════════════════════════════════════════════════
   SERVICES TAB
═══════════════════════════════════════════════════════════════ */
type ServiceForm = {
  title_ar: string; title_en: string;
  desc_ar: string;  desc_en: string;
  features_ar: string; features_en: string;
  image_url: string; link_url: string; order_num: number;
};
const emptyService = (): ServiceForm => ({ title_ar: "", title_en: "", desc_ar: "", desc_en: "", features_ar: "", features_en: "", image_url: "", link_url: "", order_num: 0 });

function ServicesTab({ toast }: { toast: Toast }) {
  const [items, setItems] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: DbService | null }>({ open: false, editing: null });
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("services").select("*").order("order_num");
    if (!error && data) setItems(data as DbService[]);
    else toast.err("خطأ في تحميل الخدمات");
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!supabase) { toast.err("Supabase غير مهيأ"); return; }
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.err("فشل الحذف");
    else { toast.ok("تم حذف الخدمة"); setItems(p => p.filter(x => x.id !== id)); }
    setDelConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">خدماتنا التقنية المتكاملة</h2>
          <p className="text-white/40 text-sm mt-0.5">{items.length} خدمة مسجلة</p>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d3fba] text-white text-sm font-bold hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> إضافة خدمة
        </button>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState msg="لا توجد خدمات. أضف خدمة جديدة." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-full h-32 object-cover rounded-xl" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-sm">{item.title_ar}</h3>
                <p className="text-white/50 text-xs mt-0.5">{item.title_en}</p>
                {item.link_url && (
                  <a href={item.link_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#4d7fff] text-xs mt-1 hover:underline">
                    <LinkIcon className="w-3 h-3" /> {item.link_url}
                  </a>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {(item.features_ar || []).slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d3fba]/20 text-[#4d7fff]">{f}</span>
                  ))}
                  {(item.features_ar || []).length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">+{(item.features_ar || []).length - 3}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-white/8">
                <button onClick={() => setModal({ open: true, editing: item })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </button>
                {delConfirm === item.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-2 rounded-lg bg-red-600/80 text-white text-xs font-bold hover:bg-red-600">تأكيد</button>
                    <button onClick={() => setDelConfirm(null)} className="px-3 py-2 rounded-lg bg-white/5 text-xs hover:bg-white/10">إلغاء</button>
                  </div>
                ) : (
                  <button onClick={() => setDelConfirm(item.id)} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-red-900/40 text-xs transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <ServiceModal
          editing={modal.editing}
          onClose={() => setModal({ open: false, editing: null })}
          onSaved={(item) => {
            if (modal.editing) setItems(p => p.map(x => x.id === item.id ? item : x));
            else setItems(p => [...p, item]);
            setModal({ open: false, editing: null });
            toast.ok(modal.editing ? "تم تحديث الخدمة" : "تمت إضافة الخدمة");
          }}
          toast={toast}
        />
      )}
    </div>
  );
}

function ServiceModal({ editing, onClose, onSaved, toast }: {
  editing: DbService | null; onClose: () => void;
  onSaved: (item: DbService) => void; toast: Toast;
}) {
  const [form, setForm] = useState<ServiceForm>(() =>
    editing ? {
      title_ar: editing.title_ar, title_en: editing.title_en,
      desc_ar: editing.desc_ar, desc_en: editing.desc_en,
      features_ar: (editing.features_ar || []).join("\n"),
      features_en: (editing.features_en || []).join("\n"),
      image_url: editing.image_url || "", link_url: editing.link_url || "",
      order_num: editing.order_num,
    } : emptyService()
  );
  const [saving, setSaving] = useState(false);
  const set = (k: keyof ServiceForm, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title_ar.trim()) { toast.err("العنوان بالعربي مطلوب"); return; }
    if (!supabase) { toast.err("Supabase غير مهيأ"); return; }
    setSaving(true);
    const payload = {
      title_ar: form.title_ar.trim(), title_en: form.title_en.trim(),
      desc_ar: form.desc_ar.trim(), desc_en: form.desc_en.trim(),
      features_ar: form.features_ar.split("\n").map(s => s.trim()).filter(Boolean),
      features_en: form.features_en.split("\n").map(s => s.trim()).filter(Boolean),
      image_url: form.image_url || null, link_url: form.link_url || null,
      order_num: Number(form.order_num),
    };
    let result;
    if (editing) {
      result = await supabase.from("services").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editing.id).select().single();
    } else {
      result = await supabase.from("services").insert(payload).select().single();
    }
    setSaving(false);
    if (result.error) { toast.err("خطأ في الحفظ: " + result.error.message); return; }
    onSaved(result.data as DbService);
  };

  return (
    <Modal title={editing ? "تعديل الخدمة" : "إضافة خدمة جديدة"} onClose={onClose}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="العنوان بالعربي *"><Input value={form.title_ar} onChange={v => set("title_ar", v)} placeholder="مثال: تصميم الشبكات" /></Field>
        <Field label="العنوان بالإنجليزي"><Input value={form.title_en} onChange={v => set("title_en", v)} placeholder="Network Design" dir="ltr" /></Field>
        <Field label="الوصف بالعربي" full><Textarea value={form.desc_ar} onChange={v => set("desc_ar", v)} rows={3} /></Field>
        <Field label="الوصف بالإنجليزي" full><Textarea value={form.desc_en} onChange={v => set("desc_en", v)} rows={3} dir="ltr" /></Field>
        <Field label="المميزات بالعربي (سطر لكل ميزة)" full>
          <Textarea value={form.features_ar} onChange={v => set("features_ar", v)} rows={4} placeholder={"تصميم شبكات LAN/WAN\nتمديد كابلات الشبكات"} />
        </Field>
        <Field label="المميزات بالإنجليزي (سطر لكل ميزة)" full>
          <Textarea value={form.features_en} onChange={v => set("features_en", v)} rows={4} placeholder={"LAN/WAN design\nStructured cabling"} dir="ltr" />
        </Field>
        <Field label="رابط صفحة الخدمة (اختياري)">
          <Input value={form.link_url} onChange={v => set("link_url", v)} placeholder="https://..." dir="ltr" />
        </Field>
        <Field label="الترتيب">
          <Input value={String(form.order_num)} onChange={v => set("order_num", Number(v))} type="number" />
        </Field>
        <Field label="صورة الخدمة (800×600)" full>
          <ImageUploadField
            value={form.image_url || null}
            onChange={url => set("image_url", url ?? "")}
            maxW={800} maxH={600} bucket="services-images"
            toast={toast}
          />
        </Field>
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS TAB
═══════════════════════════════════════════════════════════════ */
type ProjectForm = {
  title_ar: string; title_en: string;
  category: string; description_ar: string; description_en: string;
  image_url: string; order_num: number;
  location_ar: string; location_en: string;
  details_ar: string; details_en: string;
  gallery: string[]; featured: boolean;
};
const emptyProject = (): ProjectForm => ({ title_ar: "", title_en: "", category: "", description_ar: "", description_en: "", image_url: "", order_num: 0, location_ar: "", location_en: "", details_ar: "", details_en: "", gallery: [], featured: true });

function ProjectsTab({ toast }: { toast: Toast }) {
  const [items, setItems] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: DbProject | null }>({ open: false, editing: null });
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("projects").select("*").order("order_num");
    if (!error && data) setItems(data as DbProject[]);
    else toast.err("خطأ في تحميل المشاريع");
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.err("فشل الحذف");
    else { toast.ok("تم حذف المشروع"); setItems(p => p.filter(x => x.id !== id)); }
    setDelConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">أبرز مشاريعنا المنجزة</h2>
          <p className="text-white/40 text-sm mt-0.5">{items.length} مشروع مسجل</p>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d3fba] text-white text-sm font-bold hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> إضافة مشروع
        </button>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState msg="لا توجد مشاريع. أضف مشروعاً جديداً." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              <div className={`h-28 flex items-center justify-center ${item.image_url ? "" : "bg-[#1d3fba]/10"}`}>
                {item.image_url
                  ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  : <FolderOpen className="w-8 h-8 text-[#1d3fba]/50" />}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm truncate">{item.title_ar}</h3>
                <p className="text-white/40 text-xs truncate">{item.title_en}</p>
                {item.category && <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1d3fba]/20 text-[#4d7fff]">{item.category}</span>}
                <div className="flex gap-1 mt-3">
                  <button onClick={() => setModal({ open: true, editing: item })}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                    <Pencil className="w-3 h-3" /> تعديل
                  </button>
                  {delConfirm === item.id ? (
                    <>
                      <button onClick={() => handleDelete(item.id)} className="px-2 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-bold">✓</button>
                      <button onClick={() => setDelConfirm(null)} className="px-2 py-1.5 rounded-lg bg-white/5 text-xs">✕</button>
                    </>
                  ) : (
                    <button onClick={() => setDelConfirm(item.id)} className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-red-900/40 text-xs transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <ProjectModal
          editing={modal.editing}
          onClose={() => setModal({ open: false, editing: null })}
          onSaved={item => {
            if (modal.editing) setItems(p => p.map(x => x.id === item.id ? item : x));
            else setItems(p => [...p, item]);
            setModal({ open: false, editing: null });
            toast.ok(modal.editing ? "تم تحديث المشروع" : "تمت إضافة المشروع");
          }}
          toast={toast}
        />
      )}
    </div>
  );
}

function ProjectModal({ editing, onClose, onSaved, toast }: {
  editing: DbProject | null; onClose: () => void;
  onSaved: (item: DbProject) => void; toast: Toast;
}) {
  const [form, setForm] = useState<ProjectForm>(() =>
    editing ? {
      title_ar: editing.title_ar, title_en: editing.title_en,
      category: editing.category || "", image_url: editing.image_url || "",
      description_ar: editing.description_ar || "", description_en: editing.description_en || "",
      order_num: editing.order_num,
      location_ar: editing.location_ar || "", location_en: editing.location_en || "",
      details_ar: (editing.details_ar || []).join("\n"),
      details_en: (editing.details_en || []).join("\n"),
      gallery: editing.gallery || [],
      featured: editing.featured ?? true,
    } : emptyProject()
  );
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title_ar.trim()) { toast.err("اسم المشروع بالعربي مطلوب"); return; }
    if (!supabase) { toast.err("Supabase غير مهيأ"); return; }
    setSaving(true);
    const toLines = (s: string) => s.split("\n").map(l => l.trim()).filter(Boolean);
    const payload = {
      title_ar: form.title_ar.trim(), title_en: form.title_en.trim(),
      category: form.category.trim() || null,
      image_url: form.image_url || null,
      description_ar: form.description_ar.trim() || null,
      description_en: form.description_en.trim() || null,
      order_num: Number(form.order_num),
      location_ar: form.location_ar.trim() || null,
      location_en: form.location_en.trim() || null,
      details_ar: toLines(form.details_ar),
      details_en: toLines(form.details_en),
      gallery: form.gallery,
      featured: form.featured,
    };
    let result;
    if (editing) {
      result = await supabase.from("projects").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editing.id).select().single();
    } else {
      result = await supabase.from("projects").insert(payload).select().single();
    }
    setSaving(false);
    if (result.error) { toast.err("خطأ في الحفظ: " + result.error.message); return; }
    onSaved(result.data as DbProject);
  };

  return (
    <Modal title={editing ? "تعديل المشروع" : "إضافة مشروع جديد"} onClose={onClose}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="اسم المشروع بالعربي *"><Input value={form.title_ar} onChange={v => set("title_ar", v)} placeholder="مثال: وزارة الخارجية" /></Field>
        <Field label="اسم المشروع بالإنجليزي"><Input value={form.title_en} onChange={v => set("title_en", v)} dir="ltr" /></Field>
        <Field label="الفئة"><Input value={form.category} onChange={v => set("category", v)} placeholder="شبكات / كاميرات / بنية تحتية" /></Field>
        <Field label="الترتيب"><Input value={String(form.order_num)} onChange={v => set("order_num", Number(v))} type="number" /></Field>
        <Field label="الموقع بالعربي"><Input value={form.location_ar} onChange={v => set("location_ar", v)} placeholder="مثال: بغداد - المنصور" /></Field>
        <Field label="الموقع بالإنجليزي"><Input value={form.location_en} onChange={v => set("location_en", v)} dir="ltr" placeholder="e.g. Baghdad - Mansour" /></Field>
        <Field label="الوصف بالعربي" full><Textarea value={form.description_ar} onChange={v => set("description_ar", v)} rows={2} /></Field>
        <Field label="الوصف بالإنجليزي" full><Textarea value={form.description_en} onChange={v => set("description_en", v)} rows={2} dir="ltr" /></Field>
        <Field label="نقاط التفاصيل بالعربي (نقطة في كل سطر)" full><Textarea value={form.details_ar} onChange={v => set("details_ar", v)} rows={4} placeholder={"تركيب 120 كاميرا مراقبة\nشبكة ألياف ضوئية بطول 5 كم\n..."} /></Field>
        <Field label="نقاط التفاصيل بالإنجليزي (نقطة في كل سطر)" full><Textarea value={form.details_en} onChange={v => set("details_en", v)} rows={4} dir="ltr" placeholder={"120 CCTV cameras installed\n5 km fiber-optic network\n..."} /></Field>
        <Field label="صورة المشروع الرئيسية (1200×675 — نسبة 16:9)" full>
          <ImageUploadField
            value={form.image_url || null}
            onChange={url => set("image_url", url ?? "")}
            maxW={1200} maxH={675} bucket="projects-images"
            toast={toast}
          />
        </Field>
        <Field label="معرض صور إضافية" full>
          <GalleryUploadField
            value={form.gallery}
            onChange={g => set("gallery", g)}
            toast={toast}
          />
        </Field>
        <Field label="الظهور في شريط «أبرز مشاريعنا»" full>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => set("featured", !form.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-[#1d3fba]" : "bg-white/15"}`}
              aria-pressed={form.featured}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.featured ? "start-5" : "start-0.5"}`} />
            </button>
            <span className="text-sm text-white/70">{form.featured ? "يظهر في الشريط" : "مخفي من الشريط"}</span>
          </label>
        </Field>
        {editing && (
          <Field label="رابط صفحة المشروع" full>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${editing.id}`}
                dir="ltr"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/projects/${editing.id}`);
                  toast.ok("تم نسخ الرابط");
                }}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition-colors"
              >
                نسخ
              </button>
              <a
                href={`/projects/${editing.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition-colors"
              >
                فتح
              </a>
            </div>
          </Field>
        )}
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTNERS TAB
═══════════════════════════════════════════════════════════════ */
type PartnerForm = {
  name: string; initials: string; color: string; image_url: string; order_num: number;
};
const emptyPartner = (): PartnerForm => ({ name: "", initials: "", color: "#1d3fba", image_url: "", order_num: 0 });

function PartnersTab({ toast }: { toast: Toast }) {
  const [items, setItems] = useState<DbPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: DbPartner | null }>({ open: false, editing: null });
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("partners").select("*").order("order_num");
    if (!error && data) setItems(data as DbPartner[]);
    else toast.err("خطأ في تحميل الشركاء");
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) toast.err("فشل الحذف");
    else { toast.ok("تم حذف الشريك"); setItems(p => p.filter(x => x.id !== id)); }
    setDelConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">شركاؤنا في التقنية</h2>
          <p className="text-white/40 text-sm mt-0.5">{items.length} شريك مسجل</p>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d3fba] text-white text-sm font-bold hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> إضافة شريك
        </button>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState msg="لا يوجد شركاء. أضف شريكاً جديداً." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black border"
                  style={{ background: item.bg_color, color: item.color, borderColor: item.color + "40" }}>
                  {item.initials}
                </div>
              )}
              <span className="text-xs font-bold text-white/80 line-clamp-1">{item.name}</span>
              <div className="flex gap-1 w-full">
                <button onClick={() => setModal({ open: true, editing: item })}
                  className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] transition-colors">✏️</button>
                {delConfirm === item.id ? (
                  <>
                    <button onClick={() => handleDelete(item.id)} className="px-1.5 py-1 rounded-lg bg-red-600/80 text-[10px] font-bold">✓</button>
                    <button onClick={() => setDelConfirm(null)} className="px-1.5 py-1 rounded-lg bg-white/5 text-[10px]">✕</button>
                  </>
                ) : (
                  <button onClick={() => setDelConfirm(item.id)} className="px-1.5 py-1 rounded-lg bg-white/5 hover:bg-red-900/40 text-[10px] transition-colors">🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <PartnerModal
          editing={modal.editing}
          onClose={() => setModal({ open: false, editing: null })}
          onSaved={item => {
            if (modal.editing) setItems(p => p.map(x => x.id === item.id ? item : x));
            else setItems(p => [...p, item]);
            setModal({ open: false, editing: null });
            toast.ok(modal.editing ? "تم تحديث الشريك" : "تمت إضافة الشريك");
          }}
          toast={toast}
        />
      )}
    </div>
  );
}

function PartnerModal({ editing, onClose, onSaved, toast }: {
  editing: DbPartner | null; onClose: () => void;
  onSaved: (item: DbPartner) => void; toast: Toast;
}) {
  const [form, setForm] = useState<PartnerForm>(() =>
    editing ? {
      name: editing.name, initials: editing.initials,
      color: editing.color, image_url: editing.image_url || "",
      order_num: editing.order_num,
    } : emptyPartner()
  );
  const [saving, setSaving] = useState(false);
  const set = (k: keyof PartnerForm, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  // Auto-generate initials from name
  const handleNameChange = (v: string) => {
    set("name", v);
    if (!editing || !form.initials) {
      const parts = v.trim().split(/\s+/);
      const initials = parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : v.slice(0, 2).toUpperCase();
      set("initials", initials);
    }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.err("اسم الشريك مطلوب"); return; }
    if (!supabase) { toast.err("Supabase غير مهيأ"); return; }
    setSaving(true);
    // Auto-generate bg_color as color with 12% opacity
    const hex = form.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const bgColor = `rgba(${r},${g},${b},0.12)`;
    const payload = {
      name: form.name.trim(),
      initials: (form.initials.trim() || form.name.slice(0, 2)).toUpperCase(),
      color: form.color, bg_color: bgColor,
      image_url: form.image_url || null,
      order_num: Number(form.order_num),
    };
    let result;
    if (editing) {
      result = await supabase.from("partners").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editing.id).select().single();
    } else {
      result = await supabase.from("partners").insert(payload).select().single();
    }
    setSaving(false);
    if (result.error) { toast.err("خطأ في الحفظ: " + result.error.message); return; }
    onSaved(result.data as DbPartner);
  };

  return (
    <Modal title={editing ? "تعديل الشريك" : "إضافة شريك جديد"} onClose={onClose}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="اسم الشريك *"><Input value={form.name} onChange={handleNameChange} placeholder="مثال: Cisco" /></Field>
        <Field label="الأحرف المختصرة"><Input value={form.initials} onChange={v => set("initials", v)} placeholder="CI" maxLength={3} /></Field>
        <Field label="لون الهوية (سيستخدم للبطاقة)">
          <div className="flex items-center gap-2">
            <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
            <Input value={form.color} onChange={v => set("color", v)} dir="ltr" placeholder="#1d3fba" />
          </div>
        </Field>
        <Field label="الترتيب"><Input value={String(form.order_num)} onChange={v => set("order_num", Number(v))} type="number" /></Field>
        <Field label="صورة/شعار الشريك (200×200 مربع — اختياري)" full>
          <ImageUploadField
            value={form.image_url || null}
            onChange={url => set("image_url", url ?? "")}
            maxW={200} maxH={200} square bucket="partners-images"
            toast={toast}
          />
        </Field>
        {/* Preview */}
        <Field label="معاينة البطاقة" full>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            {form.image_url ? (
              <img src={form.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black border"
                style={{
                  background: `rgba(${parseInt(form.color.slice(1,3),16)},${parseInt(form.color.slice(3,5),16)},${parseInt(form.color.slice(5,7),16)},0.12)`,
                  color: form.color, borderColor: form.color + "40"
                }}>
                {form.initials || "؟"}
              </div>
            )}
            <span className="text-sm font-bold">{form.name || "اسم الشريك"}</span>
          </div>
        </Field>
      </div>
      <ModalFooter onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOKINGS TAB
═══════════════════════════════════════════════════════════════ */
const STATUS_LABELS: Record<string, string> = {
  pending:   "معلق",
  reviewed:  "تمت المراجعة",
  completed: "مكتمل",
};
const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-900/40 text-amber-300 border-amber-500/30",
  reviewed:  "bg-blue-900/40 text-blue-300 border-blue-500/30",
  completed: "bg-green-900/40 text-green-300 border-green-500/30",
};

function BookingsTab({ toast }: { toast: Toast }) {
  const [items, setItems] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (!error && data) setItems(data as DbBooking[]);
    else toast.err("خطأ في تحميل الطلبات");
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.err("فشل تحديث الحالة");
    else { toast.ok("تم تحديث الحالة"); setItems(p => p.map(x => x.id === id ? { ...x, status: status as DbBooking["status"] } : x)); }
  };

  const total = items.length;
  const pending = items.filter(x => x.status === "pending").length;
  const reviewed = items.filter(x => x.status === "reviewed").length;
  const completed = items.filter(x => x.status === "completed").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">طلبات حجز الاستشارة</h2>
          <p className="text-white/40 text-sm mt-0.5">{total} طلب إجمالي</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "إجمالي", value: total, color: "text-white" },
          { label: "معلق",   value: pending, color: "text-amber-400" },
          { label: "مراجعة", value: reviewed, color: "text-blue-400" },
          { label: "مكتمل",  value: completed, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState msg="لا توجد طلبات حجز حتى الآن." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
              {/* Row header */}
              <button
                onClick={() => setExpanded(e => e === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-start"
              >
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[item.status] ?? STATUS_COLORS.pending}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
                <span className="text-sm font-bold flex-1 truncate">{item.full_name}</span>
                <span className="text-xs text-white/40 shrink-0">{(item.selected_services || []).join(" · ")}</span>
                <span className="text-xs text-white/30 shrink-0">{new Date(item.created_at).toLocaleDateString("ar-IQ")}</span>
                {expanded === item.id ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
              </button>

              {/* Expanded details */}
              {expanded === item.id && (
                <div className="px-4 pb-4 border-t border-white/8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-3">
                    <BookingDetailRow label="الاسم" value={item.full_name} />
                    {item.company_name && <BookingDetailRow label="الشركة" value={item.company_name} />}
                    {item.phone && <BookingDetailRow label="الهاتف" value={item.phone} />}
                    {item.whatsapp && <BookingDetailRow label="واتساب" value={item.whatsapp} />}
                    {item.email && <BookingDetailRow label="البريد" value={item.email} />}
                    {item.city && <BookingDetailRow label="المدينة" value={item.city} />}
                    {item.project_type && <BookingDetailRow label="نوع المشروع" value={item.project_type} />}
                    {item.location && <BookingDetailRow label="الموقع" value={item.location} />}
                    {item.urgency && <BookingDetailRow label="الاستعجال" value={item.urgency} />}
                    {item.project_size && <BookingDetailRow label="حجم المشروع" value={item.project_size} />}
                    {item.preferred_date && <BookingDetailRow label="التاريخ المفضل" value={item.preferred_date} />}
                    {item.preferred_time && <BookingDetailRow label="الوقت المفضل" value={item.preferred_time} />}
                    {item.preferred_contact && <BookingDetailRow label="طريقة التواصل" value={item.preferred_contact} />}
                  </div>
                  {item.project_description && (
                    <div className="mt-3">
                      <span className="text-xs text-white/40">وصف المشروع</span>
                      <p className="text-sm mt-1 text-white/80 leading-relaxed">{item.project_description}</p>
                    </div>
                  )}
                  {item.notes && (
                    <div className="mt-2">
                      <span className="text-xs text-white/40">ملاحظات</span>
                      <p className="text-sm mt-1 text-white/70">{item.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    {["pending", "reviewed", "completed"].map(s => (
                      <button key={s}
                        onClick={() => updateStatus(item.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          item.status === s ? STATUS_COLORS[s] : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                        }`}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-white/40 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-white/85">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED: ImageUploadField
═══════════════════════════════════════════════════════════════ */
function ImageUploadField({ value, onChange, maxW, maxH, square, bucket, toast }: {
  value: string | null; onChange: (url: string | null) => void;
  maxW: number; maxH: number; square?: boolean; bucket: string; toast: Toast;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const blob = await resizeImage(file, maxW, maxH, square);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      let url: string;
      if (isSupabaseConfigured && supabase) {
        url = await uploadImage(blob, bucket, path);
      } else {
        url = URL.createObjectURL(blob);
      }
      onChange(url);
    } catch (err) {
      console.error(err);
      toast.err("فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="preview" className={`rounded-xl object-cover border border-white/10 ${square ? "w-24 h-24" : "w-full max-h-36"}`} />
          <button onClick={() => onChange(null)}
            className="absolute -top-2 -start-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-500">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white/70 transition-colors disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "جاري الرفع..." : "رفع صورة"}
        </button>
        <span className="text-xs text-white/30">أو</span>
        <input
          type="url" placeholder="https://... (رابط الصورة)"
          value={value || ""} onChange={e => onChange(e.target.value || null)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#1d3fba]/60 transition-colors"
          dir="ltr"
        />
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <p className="text-[10px] text-white/25">
        الصورة ستُقلَّص تلقائياً إلى {maxW}×{maxH}{square ? " (مربع)" : ""} بصيغة WebP
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED: GalleryUploadField — multi-image uploader
═══════════════════════════════════════════════════════════════ */
function GalleryUploadField({ value, onChange, toast }: {
  value: string[]; onChange: (urls: string[]) => void; toast: Toast;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const blob = await resizeImage(file, 1200, 900, false);
        const path = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        let url: string;
        if (isSupabaseConfigured && supabase) {
          url = await uploadImage(blob, "projects-images", path);
        } else {
          url = URL.createObjectURL(blob);
        }
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      console.error(err);
      toast.err("فشل رفع بعض الصور");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-white/10" />
              <button onClick={() => removeAt(i)}
                className="absolute -top-2 -start-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white/70 transition-colors disabled:opacity-50">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "جاري الرفع..." : "إضافة صور للمعرض"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      <p className="text-[10px] text-white/25">يمكن اختيار عدة صور دفعة واحدة — تُقلَّص إلى 1200×900 بصيغة WebP</p>
    </div>
  );
}

/* ─── Shared: Modal ─────────────────────────────────────────── */
function Modal({ title, children, onClose }: {
  title: string; children: React.ReactNode; onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" dir="rtl">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#111111] border border-white/12 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="font-bold text-base">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-0">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/8">
      <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition-colors">إلغاء</button>
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d3fba] text-white text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        حفظ
      </button>
    </div>
  );
}

/* ─── Shared: Form helpers ──────────────────────────────────── */
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", dir, maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; dir?: string; maxLength?: number;
}) {
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} dir={dir} maxLength={maxLength}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#1d3fba]/60 transition-colors placeholder:text-white/20"
    />
  );
}

function Textarea({ value, onChange, rows = 3, placeholder, dir }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; dir?: string;
}) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      rows={rows} placeholder={placeholder} dir={dir}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#1d3fba]/60 transition-colors resize-y placeholder:text-white/20"
    />
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-[#1d3fba]" />
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="text-center py-16 text-white/30">
      <Star className="w-8 h-8 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{msg}</p>
    </div>
  );
}
