# Phase 3: Employee HR & Attendance — PLAN

**Phase**: 3 of 3
**Goal**: Implement the internal employee portal with location-based attendance tracking.
**Depends on**: Phase 2 ✅
**Requirements**: ADM-05, ADM-06, EMP-01, EMP-02, EMP-03, EMP-04, EMP-05

## Success Criteria

1. Employee can login to their dedicated portal.
2. Employee can check-in/out with location validation (map feedback).
3. Admin can manage employee records and export attendance logs.

---

## Plan 03-01: Employee Portal Core (Auth + Profile)

### Overview
Build the employee-facing portal with separate JWT auth, profile management, and a dedicated layout.

### Tasks

#### 03-01-A: Employee Auth System
**Files**: `src/app/api/auth/employee-login/route.ts`, `src/app/employee/login/page.tsx`, `src/components/employee/EmployeeLoginForm.tsx`

1. Create demo employee credentials (stored in demo-data for now)
2. Create `POST /api/auth/employee-login` — authenticate employee, create JWT with `role: 'employee'`
3. Create `/employee/login` page — clean login form matching admin style
4. Update `middleware.ts` — protect `/employee` routes (except `/employee/login`), verify `role === 'employee'`

#### 03-01-B: Employee Layout & Dashboard
**Files**: `src/app/employee/layout.tsx`, `src/app/employee/(portal)/layout.tsx`, `src/app/employee/(portal)/page.tsx`, `src/components/employee/EmployeeSidebar.tsx`

1. Create `EmployeeSidebar` — nav items: Dashboard, Attendance, Profile, Logout
2. Create employee portal layout with sidebar (same route group pattern as admin)
3. Create employee dashboard page:
   - Today's check-in status
   - Current month summary (days present, late, absent)
   - Quick check-in/out button
   - Recent attendance history (last 7 days)

#### 03-01-C: Employee Profile Management
**Files**: `src/app/employee/(portal)/profile/page.tsx`, `src/components/employee/ProfileForm.tsx`

1. Create `/employee/profile` page
2. Build `ProfileForm` component:
   - Name, email, phone, department, designation
   - Profile photo upload (with preview)
   - Emergency contact
3. Create `PATCH /api/employee/profile` route

---

## Plan 03-02: Attendance Tracking (GPS + Check-in/out)

### Overview
Implement location-based attendance with GPS validation, anti-spoofing measures, and real-time status updates.

### Tasks

#### 03-02-A: GPS Location Service
**Files**: `src/lib/location.ts`, `src/components/employee/LocationStatus.tsx`

1. Create `location.ts` utility:
   - `getCurrentPosition()` — wrapper around Browser Geolocation API
   - `isWithinRadius(lat, lng, officeLat, officeLng, radiusMeters)` — Haversine distance
   - Office location config (demo: Hyderabad office coordinates)
   - Validation radius: 500m default
2. Build `LocationStatus` component:
   - Shows current GPS coordinates
   - Distance from office
   - Green/red indicator (within/outside radius)
   - Map preview using OpenStreetMap static tile (no API key needed)

#### 03-02-B: Check-in/out Flow
**Files**: `src/app/employee/(portal)/attendance/page.tsx`, `src/components/employee/AttendancePanel.tsx`, `src/app/api/employee/attendance/route.ts`

1. Create `POST /api/employee/attendance` — record check-in or check-out:
   - Validates GPS coordinates are within office radius
   - Calculates duration on check-out (auto from check-in time)
   - Stores: employee_id, date, check_in_time, check_out_time, location_lat, location_lng, status
2. Build `AttendancePanel` component:
   - Large check-in/check-out button (changes state based on status)
   - Live clock display
   - GPS permission request with graceful fallback
   - Location validation feedback (green tick / red warning)
   - Duration timer (running since check-in)
3. Create `/employee/attendance` page with AttendancePanel + monthly history

#### 03-02-C: Attendance History & Calendar View
**Files**: `src/components/employee/AttendanceCalendar.tsx`, `src/components/employee/AttendanceHistory.tsx`

1. Build `AttendanceCalendar` — monthly calendar grid:
   - Color-coded days (green=present, red=absent, yellow=late, gray=weekend/holiday)
   - Click day to see details (check-in/out time, duration)
2. Build `AttendanceHistory` — table view:
   - Columns: date, check-in time, check-out time, duration, status, location
   - Sortable and filterable by month
3. Create `GET /api/employee/attendance` — fetch attendance records with date range filter

---

## Plan 03-03: Admin Employee & Attendance Management

### Overview
Extend the admin dashboard to manage employee records and view/export attendance data.

### Tasks

#### 03-03-A: Admin Employee Management
**Files**: `src/app/admin/(dashboard)/employees/page.tsx`, `src/components/admin/EmployeeForm.tsx`, `src/app/admin/(dashboard)/employees/new/page.tsx`

1. Create admin `/admin/employees` page:
   - Table of all employees (name, email, department, designation, status)
   - Search and filter
   - "Add Employee" button
2. Build `EmployeeForm` component:
   - Fields: name*, email*, phone, department*, designation, password, is_active
3. Create `/admin/employees/new` page
4. API routes: `POST /api/admin/employees`, `PATCH /api/admin/employees/[id]`
5. Add "Employees" to admin sidebar

#### 03-03-B: Admin Attendance Dashboard & Export
**Files**: `src/app/admin/(dashboard)/attendance/page.tsx`, `src/components/admin/AttendanceTable.tsx`

1. Create admin `/admin/attendance` page:
   - Filterable by employee, date range, department
   - Columns: employee name, date, check-in, check-out, duration, location, status
   - Pagination
2. Build CSV export functionality:
   - Export filtered attendance data
   - Columns: Employee, Date, Check-in, Check-out, Hours, Status, Location
   - Download as `primetek-attendance-{date-range}.csv`
3. API route: `GET /api/admin/attendance` — fetch with filters
4. Add "Attendance" to admin sidebar
5. Update dashboard stats with employee + attendance counts

---

## File Impact Summary

### New Files (~25)
```
src/app/employee/login/page.tsx
src/app/employee/layout.tsx
src/app/employee/(portal)/layout.tsx
src/app/employee/(portal)/page.tsx
src/app/employee/(portal)/attendance/page.tsx
src/app/employee/(portal)/profile/page.tsx
src/app/api/auth/employee-login/route.ts
src/app/api/employee/attendance/route.ts
src/app/api/employee/profile/route.ts
src/app/api/admin/employees/route.ts
src/app/api/admin/employees/[id]/route.ts
src/app/api/admin/attendance/route.ts
src/app/admin/(dashboard)/employees/page.tsx
src/app/admin/(dashboard)/employees/new/page.tsx
src/app/admin/(dashboard)/attendance/page.tsx
src/components/employee/EmployeeLoginForm.tsx
src/components/employee/EmployeeSidebar.tsx
src/components/employee/AttendancePanel.tsx
src/components/employee/AttendanceCalendar.tsx
src/components/employee/AttendanceHistory.tsx
src/components/employee/ProfileForm.tsx
src/components/employee/LocationStatus.tsx
src/components/admin/EmployeeForm.tsx
src/components/admin/AttendanceTable.tsx
src/lib/location.ts
```

### Modified Files (~5)
```
src/middleware.ts               → Add /employee route protection
src/lib/demo-data.ts            → Add employee + attendance demo data
src/lib/validations.ts          → Add employee + attendance schemas
src/components/admin/Sidebar.tsx → Add Employees + Attendance nav items
src/app/admin/(dashboard)/page.tsx → Add employee/attendance stats
```

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Employee auth | Separate JWT with role='employee' | Reuses existing auth infra, different permissions |
| GPS library | Native Browser Geolocation API | No dependency, widely supported |
| Distance calc | Haversine formula | Standard geo-distance, no API key |
| Map preview | OpenStreetMap static image | Free, no API key required |
| Office coordinates | Configurable via env/config | Supports multi-office later |
| Attendance anti-spoofing | Server-side GPS validation + timestamp checks | Prevents manual coordinate injection |
| Calendar view | Custom CSS grid | No extra library, matches design system |
| CSV export | Client-side Blob generation | Same pattern as inquiry export |

---
*Plan created: 2026-04-28*
