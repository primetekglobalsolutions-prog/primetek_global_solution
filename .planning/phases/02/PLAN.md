# Phase 2: Job Board & Recruitment — PLAN

**Phase**: 2 of 3
**Goal**: Launch the Careers module to attract and manage new talent.
**Depends on**: Phase 1 (Foundation & Marketing) ✅
**Requirements**: WEB-04, WEB-05, ADM-04

## Success Criteria

1. Visitor can browse and filter job postings on the public site.
2. Visitor can upload a resume and apply for a specific role.
3. Admin can create, edit, and view applications for job postings.

---

## Plan 02-01: Careers Frontend (Public)

### Overview
Build the public-facing careers page where visitors can browse job openings, filter by category/location, and apply with a resume upload.

### Tasks

#### 02-01-A: Database Schema & API Routes
**Files**: `src/app/api/jobs/route.ts`, `src/app/api/applications/route.ts`, `src/lib/validations.ts`

1. Add Zod schemas for `Job` and `Application` models
2. Create `GET /api/jobs` — fetch active jobs with optional filters
3. Create `GET /api/jobs/[id]` — fetch single job details
4. Create `POST /api/applications` — submit application with resume file upload
5. Store resume files in Supabase Storage `resumes` bucket (or local for demo)

#### 02-01-B: Careers Listing Page
**Files**: `src/app/(public)/careers/page.tsx`, `src/components/sections/JobFilters.tsx`, `src/components/sections/JobCard.tsx`

1. Create `/careers` page with SEO metadata
2. Build `JobFilters` component (search, department, location, type dropdowns)
3. Build `JobCard` component (title, badge, location, salary, CTA)
4. Implement empty state
5. Add Careers to Navbar navigation

#### 02-01-C: Job Detail & Application Page
**Files**: `src/app/(public)/careers/[id]/page.tsx`, `src/components/sections/ApplicationForm.tsx`

1. Create `/careers/[id]` dynamic page with full job details
2. Build `ApplicationForm` (name, email, phone, experience, cover letter, resume upload)
3. Resume upload: PDF/DOCX only, max 5MB, drag-and-drop zone

---

## Plan 02-02: Recruitment Management (Admin)

### Overview
Extend the admin dashboard to manage job postings and review applications.

### Tasks

#### 02-02-A: Admin Job Management
**Files**: `src/app/admin/(dashboard)/jobs/page.tsx`, `src/components/admin/JobForm.tsx`, new/edit pages

1. Create admin `/admin/jobs` page with table, status toggle, search
2. Build `JobForm` component (shared for create/edit)
3. Create `/admin/jobs/new` and `/admin/jobs/[id]/edit` pages
4. API routes: POST, PUT, PATCH for admin job CRUD
5. Add "Jobs" to admin sidebar

#### 02-02-B: Application Review Dashboard
**Files**: `src/app/admin/(dashboard)/applications/page.tsx`, `src/components/admin/ApplicationDetail.tsx`

1. Create admin `/admin/applications` page with table, filters
2. Build `ApplicationDetail` modal (full info, resume download, status selector, notes)
3. API routes: GET/PATCH for admin application management
4. Add "Applications" to admin sidebar
5. Update dashboard stats

---

## File Impact Summary

### New Files (~18)
- src/app/(public)/careers/page.tsx
- src/app/(public)/careers/[id]/page.tsx
- src/app/api/jobs/route.ts
- src/app/api/jobs/[id]/route.ts
- src/app/api/applications/route.ts
- src/app/api/admin/jobs/route.ts
- src/app/api/admin/jobs/[id]/route.ts
- src/app/api/admin/applications/route.ts
- src/app/api/admin/applications/[id]/route.ts
- src/app/admin/(dashboard)/jobs/page.tsx
- src/app/admin/(dashboard)/jobs/new/page.tsx
- src/app/admin/(dashboard)/jobs/[id]/edit/page.tsx
- src/app/admin/(dashboard)/applications/page.tsx
- src/components/sections/JobFilters.tsx
- src/components/sections/JobCard.tsx
- src/components/sections/ApplicationForm.tsx
- src/components/admin/JobForm.tsx
- src/components/admin/ApplicationDetail.tsx

### Modified Files (~5)
- src/lib/validations.ts — Add Job + Application schemas
- src/components/admin/Sidebar.tsx — Add Jobs + Applications nav items
- src/components/layout/Navbar.tsx — Add Careers link
- src/app/admin/(dashboard)/page.tsx — Add job/application stats

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Resume storage | Supabase Storage (local fallback) | Scalable file hosting |
| Max resume size | 5MB | Sufficient for PDF/DOCX |
| Job data | Demo data, Supabase later | No DB dependency needed |
| Application pipeline | 4 stages (new/reviewing/shortlisted/rejected) | Standard recruitment flow |

---
*Plan created: 2026-04-28*
