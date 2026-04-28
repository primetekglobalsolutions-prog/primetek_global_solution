# Roadmap: Primetek Global Solutions Platform

## Overview
This roadmap outlines the development of a comprehensive three-layer platform for Primetek Global Solutions. We begin by establishing the marketing foundation and lead generation, followed by the recruitment job board, and concluding with the employee HR portal and attendance synchronization.

## Phases

- [x] **Phase 1: Foundation & Marketing** - Core stack setup and public-facing portfolio with inquiry tracking.
- [x] **Phase 2: Job Board & Recruitment** - Interactive job listings and application management for talent acquisition.
- [x] **Phase 3: Employee HR & Attendance** - Secure portal for staff with location-verified attendance and history. (MIGRATED TO PWA)
- [ ] **Phase 4: Optimization & Expansion** - Bug fixes, performance tuning, and Application Profile assignment.

## Phase Details

### Phase 1: Foundation & Marketing
**Goal**: Establish the platform's core infrastructure and launch the public marketing site to begin capturing leads.
**Depends on**: Nothing
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-06, ADM-01, ADM-02, ADM-03, SEC-01, SEC-02, SEC-03
**Success Criteria**:
  1. Public website is live with Hero, About, and Services sections.
  2. Visitor can submit an inquiry form and receive a confirmation.
  3. Admin can login and view the new inquiry in a secure dashboard.
**Plans**: 3 plans

Plans:
- [x] 01-01: Core Setup (Next.js, Tailwind v4, Express, PostgreSQL, S3).
- [x] 01-02: Public Portfolio Frontend (Responsive design, Lucide icons, Framer Motion).
- [x] 01-03: Inquiry Lead Flow (API endpoints, Zod validation, Email notification).

### Phase 2: Job Board & Recruitment
**Goal**: Launch the Careers module to attract and manage new talent.
**Depends on**: Phase 1
**Requirements**: WEB-04, WEB-05, ADM-04
**Success Criteria**:
  1. Visitor can browse and filter job postings on the public site.
  2. Visitor can upload a resume and apply for a specific role.
  3. Admin can create, edit, and view applications for job postings.
**Plans**: 2 plans

Plans:
- [x] 02-01: Careers Frontend (Job list, Filters, Application form).
- [x] 02-02: Recruitment Management (Admin job CRUD, Application tracking).

### Phase 3: Employee HR & Attendance
**Goal**: Implement the internal employee portal with location-based attendance tracking.
**Depends on**: Phase 2
**Requirements**: ADM-05, ADM-06, EMP-01, EMP-02, EMP-03, EMP-04, EMP-05
**Success Criteria**:
  1. Employee can login to their dedicated portal.
  2. Employee can check-in/out with location validation (map feedback).
  3. Admin can manage employee records and export attendance logs.
**Plans**: 3 plans

Plans:
- [x] 03-01: Employee Portal Core (JWT Auth, Profile management, PWA setup).
- [x] 03-02: Attendance Tracking (GPS logic, Anti-spoofing, Browser Location API).
- [x] 03-03: SaaS HR Integration & Export (Sync with Zoho/Keka, CSV export).

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Marketing | 3/3 | Completed | 2026-04-28 |
| 2. Job Board & Recruitment | 2/2 | Completed | 2026-04-28 |
| 3. Employee HR & Attendance | 3/3 | Completed | 2026-04-28 |
| 4. Optimization & Expansion | 0/3 | In Progress | - |

---
*Roadmap updated: 2026-04-28*
