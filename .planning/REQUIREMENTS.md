# Requirements: Primetek Global Solutions Platform

**Defined:** 2026-04-27
**Core Value:** Showcase expertise and capture enterprise leads while providing a seamless self-service experience for employees.

## v1 Requirements

### Public Portfolio (WEB)
- [ ] **WEB-01**: User can view Hero section with clear CTA (Call to Action).
- [ ] **WEB-02**: User can browse company services (Staffing, Consulting, Outsourcing).
- [ ] **WEB-03**: User can view About Us story and vision/mission.
- [ ] **WEB-04**: User can browse job listings with category/location filters.
- [ ] **WEB-05**: User can apply for jobs via form with resume upload (PDF/DOCX).
- [ ] **WEB-06**: User can submit a lead inquiry form with Name, Email, Company, and Requirement.

### Admin CMS & Operations (ADM)
- [ ] **ADM-01**: Admin can login securely with email and password.
- [ ] **ADM-02**: Admin can view dashboard metrics (Lead count, Employee status, Job applications).
- [ ] **ADM-03**: Admin can view and filter incoming inquiries/leads.
- [ ] **ADM-04**: Admin can create, edit, and deactivate job postings.
- [ ] **ADM-05**: Admin can add and manage employee records.
- [ ] **ADM-06**: Admin can view and export attendance logs (CSV).

### Employee Portal (EMP)
- [ ] **EMP-01**: Employee can login securely via JWT-based auth.
- [ ] **EMP-02**: Employee can check-in with GPS location validation.
- [ ] **EMP-03**: Employee can check-out with automatic duration calculation.
- [ ] **EMP-04**: Employee can view their personal monthly attendance history.
- [ ] **EMP-05**: Employee can update their basic profile (Contact, Photo).

### Authentication & Security (SEC)
- [ ] **SEC-01**: JWT-based session management for Admin and Employee portals.
- [ ] **SEC-02**: Protected routes for Admin and Employee modules.
- [ ] **SEC-03**: Input validation and sanitization for all forms (Zod).

## v2 Requirements

### Advanced HR (HR)
- **HR-01**: Leave request system (Apply, Approve/Reject).
- **HR-02**: Role-Based Access Control (RBAC) for Admin team.
- **HR-03**: Analytics dashboard with monthly growth trends.

### Mobile & UX (UX)
- **UX-01**: Offline support for attendance history (Service Worker).
- **UX-02**: Real-time notifications for job applications.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity, use WhatsApp/Email redirect instead. |
| Payroll processing | Heavy regulatory complexity, defer to Phase 3/ERP integration. |
| Native Mobile App | PWA provides mobile access at lower cost. |
| Video Interviewing | Bandwidth/Complexity, use external tools for now. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WEB-01 | Phase 1 | Pending |
| WEB-02 | Phase 1 | Pending |
| WEB-03 | Phase 1 | Pending |
| WEB-04 | Phase 2 | Pending |
| WEB-05 | Phase 2 | Pending |
| WEB-06 | Phase 1 | Pending |
| ADM-01 | Phase 1 | Pending |
| ADM-02 | Phase 1 | Pending |
| ADM-03 | Phase 1 | Pending |
| ADM-04 | Phase 2 | Pending |
| ADM-05 | Phase 3 | Pending |
| ADM-06 | Phase 3 | Pending |
| EMP-01 | Phase 3 | Pending |
| EMP-02 | Phase 3 | Pending |
| EMP-03 | Phase 3 | Pending |
| EMP-04 | Phase 3 | Pending |
| EMP-05 | Phase 3 | Pending |
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-27*
*Last updated: 2026-04-27 after initial definition*
