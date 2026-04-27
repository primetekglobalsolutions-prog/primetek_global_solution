# Phase 1 Research: Foundation & Marketing

## Key Findings

### Architecture Decision: Integrated Next.js (No Separate Express)
**Research confirms:** For 90% of use cases, a separate Express backend is unnecessary. Next.js 15 App Router handles API routes, Server Actions, and server-side logic natively. This reduces latency and simplifies deployment.

**Decision:** Use Next.js API Routes (`app/api/`) instead of Express. If we need Express later (e.g., WebSockets for Phase 2+), we can add it as a separate service.

### Stack Specifics
- **Next.js 15** with App Router and `src/` directory pattern
- **Tailwind CSS v4** with CSS-first configuration
- **Supabase** for PostgreSQL + Auth + RLS
- **Zod** for end-to-end validation
- **Framer Motion** for page transitions and micro-animations
- **Lenis** for smooth scrolling
- **Lucide React** for icons
- **React Hook Form + Zod** for forms
- **Resend** for transactional email (inquiry notifications)

### Portfolio Design Best Practices
1. **Dual-persona navigation:** "Find Talent" vs "Find a Job" segmentation
2. **Outcome-driven hero:** Answer "Who, What, Result" in 5 seconds
3. **Mobile-first:** All critical flows must work on 320px
4. **Social proof:** Outcome-based testimonials, not just logos
5. **Persistent CTAs:** Sticky "Contact Us" throughout

### SEO Architecture
- Server-rendered pages for all public routes
- JSON-LD structured data (Organization, JobPosting)
- Proper meta tags, Open Graph, and Twitter Cards
- Semantic HTML5 elements throughout

### Database Schema (Phase 1 Tables)
```sql
-- users (admin only in Phase 1)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin')) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- inquiries (leads from contact form)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  requirement TEXT NOT NULL,
  status TEXT CHECK (status IN ('new','contacted','qualified','closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### File Structure
```
src/
├── app/
│   ├── (public)/           # Public marketing pages
│   │   ├── page.tsx         # Home
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── industries/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/              # Protected admin routes
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Dashboard
│   │   ├── login/page.tsx
│   │   └── inquiries/page.tsx
│   ├── api/
│   │   ├── inquiries/route.ts
│   │   └── auth/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                 # Reusable primitives
│   ├── sections/           # Page sections (Hero, Stats, etc.)
│   └── admin/              # Admin-specific components
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   ├── validations.ts      # Zod schemas
│   └── utils.ts
└── styles/
    └── globals.css
```

## RESEARCH COMPLETE
