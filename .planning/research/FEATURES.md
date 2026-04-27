# Features Research — Primetek Global Solutions

## Core Module Analysis

### 1. Public Portfolio Website
- **Table Stakes:** Hero section, responsive navigation, service descriptions, and contact form.
- **Differentiators:** 
    - **Industry-Specific Landing Pages:** Tailored content for Healthcare, IT, and Finance.
    - **Interactive Job Board:** Real-time filtering and status tracking.
    - **Premium Aesthetics:** Glassmorphism, smooth scroll (Lenis), and subtle micro-animations.

### 2. Admin CMS & Dashboard
- **Table Stakes:** Lead management, content editing, and basic metrics.
- **Differentiators:**
    - **Lead Scoring:** Highlight inquiries from larger companies.
    - **Exportable Analytics:** One-click CSV/PDF for attendance and leads.
    - **Audit Logs:** Track who changed what in the CMS.

### 3. Employee HR Portal
- **Table Stakes:** Secure login and check-in/out.
- **Differentiators:**
    - **PWA Experience:** Add to home screen, offline support for history.
    - **Location Verification:** Visual map confirmation during check-in.
    - **Attendance Visualization:** Calendar heatmaps for monthly attendance.

## Anti-Features (Avoid in Phase 1)
- **Real-time Chat:** Increases complexity; use WhatsApp/Email integration instead.
- **Full Payroll:** Highly complex; stick to attendance logs for Phase 1.
- **Native Mobile Apps:** PWA provides 90% of the value for 20% of the cost.

## Complexity Assessment
| Feature | Complexity | Dependency |
|---------|------------|------------|
| Inquiry Form | Low | None |
| Admin Dashboard | Medium | DB Setup |
| Attendance GPS | High | Browser API + SaaS Sync |
| PWA Setup | Low | SSL + Service Workers |
