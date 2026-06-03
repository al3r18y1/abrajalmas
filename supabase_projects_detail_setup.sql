-- ================================================
-- صفحات تفاصيل المشاريع (Project Detail Pages)
-- أبراج الماس - Abraj Almas
-- ================================================
-- التاريخ: 2026-06-03
-- قابل للتشغيل عدة مرات بأمان (Idempotent)
-- شغّل هذا الملف مرة واحدة في: Supabase Dashboard → SQL Editor
-- ================================================

-- 1. إضافة الأعمدة الجديدة لجدول المشاريع (تُتجاهل إن كانت موجودة)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location_ar  TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location_en  TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery      JSONB    DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS details_ar   JSONB    DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS details_en   JSONB    DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured     BOOLEAN  DEFAULT true;

-- 2. المشاريع العشرة الحالية: تبقى في شبكة #projects لكن لا تظهر في شريط "أبرز مشاريعنا"
--    (حتى لا تتكرر مع المشاريع الـ18 المبذورة أدناه)
UPDATE projects
   SET featured = false
 WHERE image_url IS NULL OR image_url = '';

-- 3. بذر 18 مشروعًا للشريط من الصور الحالية (تُتجاهل إن وُجد المسار نفسه)
--    الصور: public/assets/projects/project-1.png + public/assets/featured-projects/fp-1..17.png
--    العناوين والمواقع والتفاصيل تعدّلها لاحقًا من لوحة التحكم /admin
INSERT INTO projects (title_ar, title_en, category, image_url, featured, order_num)
SELECT v.title_ar, v.title_en, v.category, v.image_url, true, v.order_num
FROM (VALUES
  ('مشروع 1',  'Project 1',  'مشاريع', '/assets/projects/project-1.png',      1),
  ('مشروع 2',  'Project 2',  'مشاريع', '/assets/featured-projects/fp-1.png',  2),
  ('مشروع 3',  'Project 3',  'مشاريع', '/assets/featured-projects/fp-2.png',  3),
  ('مشروع 4',  'Project 4',  'مشاريع', '/assets/featured-projects/fp-3.png',  4),
  ('مشروع 5',  'Project 5',  'مشاريع', '/assets/featured-projects/fp-4.png',  5),
  ('مشروع 6',  'Project 6',  'مشاريع', '/assets/featured-projects/fp-5.png',  6),
  ('مشروع 7',  'Project 7',  'مشاريع', '/assets/featured-projects/fp-6.png',  7),
  ('مشروع 8',  'Project 8',  'مشاريع', '/assets/featured-projects/fp-7.png',  8),
  ('مشروع 9',  'Project 9',  'مشاريع', '/assets/featured-projects/fp-8.png',  9),
  ('مشروع 10', 'Project 10', 'مشاريع', '/assets/featured-projects/fp-9.png',  10),
  ('مشروع 11', 'Project 11', 'مشاريع', '/assets/featured-projects/fp-10.png', 11),
  ('مشروع 12', 'Project 12', 'مشاريع', '/assets/featured-projects/fp-11.png', 12),
  ('مشروع 13', 'Project 13', 'مشاريع', '/assets/featured-projects/fp-12.png', 13),
  ('مشروع 14', 'Project 14', 'مشاريع', '/assets/featured-projects/fp-13.png', 14),
  ('مشروع 15', 'Project 15', 'مشاريع', '/assets/featured-projects/fp-14.png', 15),
  ('مشروع 16', 'Project 16', 'مشاريع', '/assets/featured-projects/fp-15.png', 16),
  ('مشروع 17', 'Project 17', 'مشاريع', '/assets/featured-projects/fp-16.png', 17),
  ('مشروع 18', 'Project 18', 'مشاريع', '/assets/featured-projects/fp-17.png', 18)
) AS v(title_ar, title_en, category, image_url, order_num)
WHERE NOT EXISTS (
  SELECT 1 FROM projects p WHERE p.image_url = v.image_url
);

-- ================================================
-- ✅ جاهز — يمكن تشغيل هذا الملف أكثر من مرة بأمان
-- ================================================
-- • الأعمدة الجديدة: location_ar, location_en, gallery, details_ar, details_en, featured
-- • شريط "أبرز مشاريعنا" يعرض المشاريع حيث featured = true
-- • إدارة كل التفاصيل والصور: /admin → تبويب "المشاريع"
-- ================================================
