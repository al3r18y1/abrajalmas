import { createClient } from "@supabase/supabase-js";

// Fallback values used when the env file isn't loaded (e.g. dev server run from parent dir).
// The publishable key is a public client key — safe to embed in source (like Firebase config).
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  ?? "https://hqhysilscrmfnovlpgvg.supabase.co";
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  ?? "sb_publishable_1wYlYLWYNt-HEQzMTlk4ZQ_J9CqGgwu";

export const isSupabaseConfigured =
  !!(url && key && url !== "YOUR_SUPABASE_URL" && key !== "YOUR_SUPABASE_ANON_KEY");

export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

/* ─── DB types ──────────────────────────────────────────────── */

export interface DbService {
  id: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  features_ar: string[];
  features_en: string[];
  image_url: string | null;
  link_url: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}
export type DbServiceInsert = Omit<DbService, "id" | "created_at" | "updated_at">;

export interface DbProject {
  id: string;
  title_ar: string;
  title_en: string;
  category: string | null;
  image_url: string | null;
  description_ar: string | null;
  description_en: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}
export type DbProjectInsert = Omit<DbProject, "id" | "created_at" | "updated_at">;

export interface DbPartner {
  id: string;
  name: string;
  initials: string;
  color: string;
  bg_color: string;
  image_url: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}
export type DbPartnerInsert = Omit<DbPartner, "id" | "created_at" | "updated_at">;

export interface DbBooking {
  id: string;
  selected_services: string[];
  project_type: string | null;
  location: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  urgency: string | null;
  project_size: string | null;
  project_description: string | null;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  preferred_contact: string | null;
  notes: string | null;
  status: "pending" | "reviewed" | "completed";
  created_at: string;
}
export type DbBookingInsert = Omit<DbBooking, "id" | "created_at" | "status">;

/* ─── Image resize helper ───────────────────────────────────── */

export async function resizeImage(
  file: File,
  maxW: number,
  maxH: number,
  square = false,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (square) {
        const side = Math.min(width, height);
        const sx = (width - side) / 2;
        const sy = (height - side) / 2;
        canvas.width = Math.min(side, maxW);
        canvas.height = Math.min(side, maxH);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
      } else {
        const ratio = Math.min(maxW / width, maxH / height, 1);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(img.src);
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/webp",
        0.85,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Image load failed"));
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(
  blob: Blob,
  bucket: string,
  path: string,
): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
