# Phase 4: Platform Optimization & Feature Expansion

**Phase**: 4 of 4
**Goal**: Address critical bug fixes, performance issues, and implement the Application Profile management system.
**Depends on**: Phase 3 ✅
**Requirements**: NEW-01 (Password Change), NEW-02 (Application Profiles), NEW-03 (Admin UX Fixes)

## Success Criteria

1. Company logo is visible in all dashboards (Admin/Employee).
2. UI response time for button clicks is significantly improved (optimistic updates).
3. Admin and Employees can change their passwords securely.
4. Attendance GPS validation is accurate and robust.
5. Admin can assign "Application Profiles" to employees, and employees can view them.
6. Admin can view full inquiry details and manage applications more effectively.

---

## Plan 04-01: Visual Polish & Critical Bug Fixes

### Overview
Fix branding issues, data truncation, and core attendance logic.

### Tasks

#### 04-01-A: Logo & Branding Fixes
**Files**: `src/components/pwa/AppSidebar.tsx`, `src/components/layout/Navbar.tsx`
1. Replace placeholder logos with the `Logo.tsx` component.
2. Ensure consistent branding across Admin and Employee portals.

#### 04-01-B: Inquiry Details & Admin UX
**Files**: `src/components/admin/InquiryTable.tsx`, `src/app/app/admin/inquiries/actions.ts`
1. Remove strict truncation in `InquiryTable.tsx`.
2. Implement a "View Details" modal or expandable row to show full requirement text.
3. Fix any missing fields in the inquiry view.

#### 04-01-C: Attendance GPS & Validation Fix
**Files**: `src/app/app/employee/attendance/actions.ts`, `src/app/app/employee/attendance/AttendanceClient.tsx`
1. Define office location coordinates (Hyderabad: 17.3850, 78.4867).
2. Implement `isWithinRadius` check in the `checkIn` server action (server-side validation).
3. Fix timezone-dependent date comparison logic in `checkIn` to prevent failures near midnight.
4. Add clear user feedback for "Out of Office Radius" errors.

---

## Plan 04-02: Performance & Security

### Overview
Improve UI responsiveness and add essential security features.

### Tasks

#### 04-02-A: Dashboard Performance Optimization
**Files**: `src/components/ui/Button.tsx`, `src/app/app/admin/applications/ApplicationsClient.tsx`, `src/app/app/employee/attendance/AttendanceClient.tsx`
1. Audit click handlers for blocking logic.
2. Ensure all server actions use `useTransition` or local state for immediate feedback.
3. Optimize table rendering for large datasets.

#### 04-02-B: Password Change Functionality
**Files**: `src/app/api/auth/change-password/route.ts` (or server action), `src/components/profile/PasswordChangeForm.tsx`, `src/app/app/admin/profile/page.tsx`, `src/app/app/employee/profile/page.tsx`
1. Create `PasswordChangeForm` with validation (current password, new password, confirm).
2. Implement secure password update logic using `bcryptjs`.
3. Add "Security" section to profile pages for both roles.

---

## Plan 04-03: Application Profile Management & Assignment

### Overview
Implement the system for admins to assign client profiles to employees for processing.

### Tasks

#### 04-03-A: Schema & Database Update
**Files**: `supabase_schema.sql`, `src/lib/validations.ts`
1. Add `assigned_to` (uuid) column to `applications` table.
2. Create `application_profiles` table:
   - id, application_id, client_name, address, role, phone, email, linkedin, education (json), resume_url, status.
3. Update Zod schemas to include these new fields.

#### 04-03-B: Admin Assignment UI
**Files**: `src/app/app/admin/applications/ApplicationsClient.tsx`, `src/app/app/admin/applications/actions.ts`
1. Add "Assign Employee" dropdown to application detail view.
2. Implement `assignApplication` server action.
3. Add ability for admin to manually "Add Application" with full profile details.

#### 04-03-C: Employee "My Assignments" View
**Files**: `src/app/app/employee/assignments/page.tsx`, `src/components/employee/AssignmentCard.tsx`
1. Create new "Assignments" page in employee portal.
2. Build `AssignmentCard` to display assigned profile info (details, education, resume link).
3. Add "Assignments" to employee sidebar.

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Profile Storage | Separate `application_profiles` table | Keeps `applications` (leads) clean from detailed processing data |
| Assignment Logic | Foreign Key to `employees` | Simple, direct mapping |
| Password Hashing | `bcryptjs` | Industry standard for secure hashing |
| GPS Validation | Server-side haversine | Prevents client-side spoofing |

---
*Plan created: 2026-04-28*
