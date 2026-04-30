# Phase 5: Leave & WFH Management

**Phase**: 5 of 5
**Goal**: Implement a robust Leave Management system and an automated WFH Request flow with Admin approval.
**Depends on**: Phase 4 ✅
**Requirements**: 
- NEW-04: Leave Request System (Sick, Casual, Earned)
- NEW-05: WFH Detection & Request Flow
- NEW-06: Admin Approvals Hub

## Success Criteria

1. Employees can apply for leaves with date ranges and reasons.
2. Employees out of office radius are prompted to request WFH instead of being blocked.
3. Admin has a dedicated dashboard to approve/reject Leave and WFH requests.
4. Approved WFH requests update attendance to "Approved WFH" (treated as Present).
5. Leave and WFH statuses are correctly reflected in Excel Exports.

---

## Plan 05-01: Database & API Foundation

### Overview
Setup the storage and server-side logic for requests.

### Tasks

#### 05-01-A: Schema Update
**Files**: `supabase_schema.sql` (reference)
1. Create `leave_requests` table.
2. Update `attendance` table status constraints to support WFH states.

#### 05-01-B: Leave Server Actions
**Files**: `src/app/employee/leaves/actions.ts`, `src/app/admin/approvals/actions.ts`
1. `applyForLeave`: Create a new leave request.
2. `getEmployeeLeaves`: Fetch leaves for the current employee.
3. `getPendingApprovals`: Fetch all pending leaves and WFH requests for admin.
4. `updateRequestStatus`: Approve/Reject logic.

#### 05-01-C: WFH Logic Hardening
**Files**: `src/app/employee/attendance/actions.ts`
1. Update `checkIn` to return `outOfRadius: true` if distance > radius.
2. Add `requestWFH` action to create an attendance record with `status: 'Pending WFH'`.

---

## Plan 05-02: Employee Experience (PWA)

### Overview
Update the PWA to support the new request flows.

### Tasks

#### 05-02-A: WFH Request Prompt
**Files**: `src/app/employee/attendance/AttendanceClient.tsx`
1. Detect `outOfRadius` response from `checkIn`.
2. Show a premium modal: "Outside Office Radius. Request WFH?".
3. Handle WFH submission.

#### 05-02-B: Leave Management UI
**Files**: `src/app/employee/leaves/page.tsx`, `src/components/employee/LeaveRequestForm.tsx`, `src/components/employee/LeaveList.tsx`
1. Create a dedicated "Leaves" tab.
2. Build a clean form for leave application.
3. Show a status list of current/past leaves.

---

## Plan 05-03: Admin Approvals Hub

### Overview
Build the command center for HR/Admin to manage requests.

### Tasks

#### 05-03-A: Approvals Dashboard
**Files**: `src/app/admin/approvals/page.tsx`, `src/app/admin/approvals/ApprovalsClient.tsx`
1. Create a new page for approvals.
2. Implement tabs: "Leave Requests" and "WFH Requests".
3. Add search and filtering by employee/date.

#### 05-03-B: Action Handlers
**Files**: `src/components/admin/ApprovalCard.tsx`
1. Build a card component for requests with "Approve" and "Reject" buttons.
2. Add confirmation dialogs and loading states.

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| WFH Storage | `attendance` table | Keeps daily presence logs in one place, avoiding duplicate tables for one day. |
| Leave Status | `Pending` default | Manual HR oversight is standard for enterprise HR. |
| Distance Calc | Server-side Haversine | Prevent spoofing while maintaining accuracy. |

---
*Plan created: 2026-05-01*
