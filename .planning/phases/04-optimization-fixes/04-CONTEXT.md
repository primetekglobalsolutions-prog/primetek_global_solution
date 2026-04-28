# Phase 4: Optimization & Expansion - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning
**Source:** PRD Express Path (.planning/PRD-excel-export.md)

<domain>
## Phase Boundary

Integrate a customized Excel export feature for the Attendance module. The export must generate an Excel file exactly matching the provided Python `openpyxl` script format.
</domain>

<decisions>
## Implementation Decisions

### Excel Generation
- Generate a multi-sheet `.xlsx` file using `exceljs` in Next.js.
- Sheet 1: "Guide" (Instructions and Legend).
- Sheets 2-13: One sheet for each month of the selected year (e.g., Jan, Feb, Mar...).

### Data Integration
- Fetch all employees from the `employees` table.
- Fetch attendance records for the target year from the `attendance` table.
- Populate the month sheets with actual employee names and attendance status (P, A, L, HD, WO).

### Formatting & Styling
- Replicate the exact styling from the provided Python script:
  - Colors: DARK_TEAL ("1B4D4F"), MID_TEAL ("2A7C7F"), LIGHT_TEAL ("E0F2F1"), WHITE ("FFFFFF"), WO_BG ("FFEBEE").
  - Borders on cells.
  - Merged headers.
  - Freeze panes at "C5".
  - Data validation dropdowns for attendance codes.
- Pre-fill formulas for summary columns ("Present", "Absent", "Leave", "Working Days").

### User Interface
- Replace or enhance the existing "Export CSV" button in `src/app/admin/attendance/AttendanceClient.tsx` to trigger this Excel export.
- No need for check-in time or log hours in this specific sheet layout.

### the agent's Discretion
- Best approach for creating the Excel file (API route vs Server Action) to handle file downloads seamlessly in Next.js App Router.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Attendance Module
- `src/app/admin/attendance/AttendanceClient.tsx` — Target for the new Export button
- `src/app/admin/attendance/actions.ts` — Existing data fetching logic
- `supabase_schema.sql` — Schema for `employees` and `attendance` tables
</canonical_refs>

<specifics>
## Specific Ideas

- The generated file should be named `Primetek_Attendance_2026_Master.xlsx` (or dynamically use the current year).
- Ensure the formulas dynamically calculate based on the generated cells.
</specifics>

<deferred>
## Deferred Ideas

None — PRD covers phase scope
</deferred>

---

*Phase: 04-optimization-fixes*
*Context gathered: 2026-04-28 via PRD Express Path*
