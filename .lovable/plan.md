## ABRAJ ALMAS — Bilingual Corporate Website + Booking System

A premium, dark, glassmorphic, animated single-page site with full Arabic (default, RTL) and English (LTR) versions, ending with a 5-step client booking flow that submits via WhatsApp.

### Brand & Design System
- Palette tokens in `src/styles.css` (oklch + brand hex helpers): black `#000`, trust blue `#1d3fba`, gold `#fcb630`, white, gray `#e9e9e9`.
- Fonts via Google Fonts in root head: Cairo (AR), Inter (EN). Body class toggles `font-arabic` vs `font-sans`.
- Glass card utility, blue-glow shadow utility, gold CTA utility.
- Logo: horizontal + symbol copied to `src/assets/` from uploads (`Abraj_almas_260329_023638-1.png` as horizontal; `3.png` or `4.png` as symbol on white — we'll use the horizontal for nav/footer and symbol cropped from `3.png`).

### Routing & Architecture
- Single page at `src/routes/index.tsx` with sections (Home/About/Services/Booking/Projects/Partners/Contact). Update `__root.tsx` head with title/description/lang dynamic via the page (lang attr handled inside component since SPA).
- Language state: React `useState("ar")` via a small `LanguageContext` so Navbar switcher + content share state. Apply `dir`/`lang` to a top wrapper `<div>` (cannot mutate `<html>` from route, but apply at wrapper — sufficient for layout/RTL).

### Components (all in `src/components/abraj/`)
Navbar, LanguageSwitcher, Hero, BackgroundGrid, LogoMark, SectionHeader, GlassCard, AnimatedButton, StatsSection, AboutSection, VisionSection, WhyUsSection, ServicesSection, ProcessSection, BookingSystemSection (with BookingProgressStepper, ServiceSelector, BookingForm, SuccessMessage), ProjectsSection, PartnersMarquee, BusinessSolutionsSection, ContactSection, Footer, FloatingCTA, WhatsAppButton.

Translations live in `src/components/abraj/translations.ts` as `{ ar: {...}, en: {...} }` covering every label, validation, WhatsApp template, and arrays for services/process/projects/partners/businessSolutions/whyUs/trustBadges.

### Booking Flow
- State: `step (1–5)`, `bookingData` (full shape from spec), `errors`, `submitted`.
- Step 1 ServiceSelector — multi-select glass cards (blue border + gold check when selected).
- Step 2 project details (type, location, dates, urgency, size, description, optional file).
- Step 3 contact info (name, company, phone, whatsapp, email, city, preferred method).
- Step 4 review summary + Submit / Send via WhatsApp / Back.
- Step 5 success screen with 3 actions.
- Per-step validation with bilingual messages. WhatsApp opens `https://wa.me/9647838904041?text=…` with language-aware template.

### Animations (framer-motion)
- Variants: `fadeUp`, `staggerContainer`, `cardHover`, `orbAnimation`.
- Hero: logo scale-in, headline fadeUp, staggered CTAs/badges; animated blue/gold orbs + grid + faint orbit motif.
- Sections use `whileInView` with `viewport={{ once: true, amount: 0.2 }}`.
- Partners: seamless infinite marquee via duplicated array + CSS keyframes (or framer `animate`).
- Booking: `AnimatePresence` between steps; selected card pop; success scale-in.

### Responsiveness & A11y
- Tailwind responsive grids (1 → 2 → 3/4 cols).
- Mobile hamburger with animated dropdown + CTA.
- Labeled inputs, aria-labels for icon buttons, focus rings (`focus:ring-2 focus:ring-[#fcb630]`).
- `dir`/`lang` swap on root wrapper; logical text alignment per language.

### SEO
- Update `index.tsx` `head()` with bilingual-friendly title/description (English primary tags + AR in og description), single H1 in Hero, semantic `<section>`/`<nav>`/`<footer>`.

### Tech Stack Setup
- Install `framer-motion` (lucide-react already typical; add if missing).
- Copy uploaded logos to `src/assets/abraj-logo-horizontal.png` and `src/assets/abraj-logo-symbol.png`.
- Add Google Fonts link in `__root.tsx` head.
- Add CSS tokens + utility classes in `src/styles.css`.

### Deliverables
1. Translations module + LanguageContext.
2. All 20+ section components.
3. Full booking workflow with validation + WhatsApp integration.
4. Updated `src/routes/index.tsx` composing the page.
5. Updated `__root.tsx` (fonts) and `src/styles.css` (brand tokens, glass/glow utilities).
6. Changelog block delivered in the final chat message.

```text
[Navbar (glass, lang switch, CTA)]
  ↓
[Hero — orbs + grid + logo mark]
  ↓
[Stats / Trust badges]
[About] [Vision quote panel] [Why Us 5 metrics]
[Services 8 cards] [Process timeline]
[Booking System — 5-step glass panel]
[Projects grid] [Partners marquee] [Business Solutions 8 cards]
[Contact (cards + form + quick actions)]
[Footer] [FloatingCTA + WhatsApp button]
```
