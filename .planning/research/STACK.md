# Stack Research — Primetek Global Solutions

## Recommended 2025 Tech Stack (Updated to Master Stack)

### Frontend: Next.js 15 (App Router)
- **Version:** Latest (15.x with Turbopack)
- **Rationale:** Best full-stack React framework. SSR/ISR for SEO, Server Actions, API Routes.
- **Directory Pattern:** `src/` for cleaner organization.

### Styling: Tailwind CSS v4
- **Rationale:** Utility-first, zero-runtime, CSS-first config with `lightningcss`.
- **Design System:** Navy + Teal + Gold palette, 8px rhythm grid.

### UI Component Libraries
1. **Shadcn/ui** — Clean, customizable, accessible primitives (Radix-based).
2. **Aceternity UI** — Advanced animated components (spotlight effects, glowing cards, 3D cards).

### Animation Stack (Full Power)
| Library | Purpose |
|---------|---------|
| **GSAP** | Industry-standard timeline animations (hero sections, reveals) |
| **ScrollTrigger** | GSAP plugin for scroll-driven animations |
| **Framer Motion** | React-specific animations (page transitions, gestures, layout) |
| **Lenis** | Buttery-smooth scrolling on all pages |

### Typography
- **Primary:** Inter (body text) via Google Fonts
- **Heading:** Playfair Display (headings) via Google Fonts
- Max 2 fonts. Consider Fontsource for self-hosting later.

### Backend & Database
- **Supabase** — PostgreSQL + Auth + RLS + Realtime + Storage
- **Zod** — End-to-end schema validation
- No separate Express — Next.js API Routes are sufficient.

### Authentication
- **JWT** via `jose` — Stateless auth for Admin and Employee portals.
- **bcryptjs** — Password hashing.

### Email
- **Resend** — Modern email API (inquiry notifications).
- **React Email** — Build emails as React components (Phase 2).

### Storage
- **AWS S3** or **Supabase Storage** — Resumes, media.
- **Cloudinary** — Image CDN if needed later.

### SEO & Performance
- **Next/image** — Automatic optimization, lazy load, blur placeholders.
- **Plaiceholder** — Blur placeholder generation.
- **Schema.org JSON-LD** — Structured data for Google.
- **Target:** Lighthouse 90+ on all pages.

### Hosting
- **Vercel** — Best for Next.js (ISR, Edge Functions, Analytics).
- **Supabase Cloud** — Database hosting.

### State Management
- **Zustand** — Lightweight global state (admin filters, UI state).
- **TanStack Query** — Server state and data fetching.

### Developer Tools
- ESLint + Prettier
- TypeScript strict mode
- Turbopack for dev builds

---

## NPM Dependencies Summary

```bash
# Core
next react react-dom typescript tailwindcss

# UI Libraries
@shadcn/ui class-variance-authority clsx tailwind-merge
# (Aceternity UI components are copy-paste, no npm package)

# Animation
gsap @gsap/react framer-motion lenis

# Backend / DB
@supabase/supabase-js @supabase/ssr zod

# Auth
jose bcryptjs

# Forms
react-hook-form @hookform/resolvers

# Icons
lucide-react

# Email
resend

# Images
sharp plaiceholder
```

## Confidence Level: High
This matches the 2025-26 "Marketing / Business Website" gold standard.
