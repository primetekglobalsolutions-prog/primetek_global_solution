# PRD: Advanced Attendance Excel Export

## Overview
Integrate a customized Excel export feature for the Attendance module. The export must generate an Excel file exactly matching the provided Python `openpyxl` script format.

## Requirements
1. **Excel Generation**:
   - Generate a multi-sheet `.xlsx` file using `exceljs` (or similar JS library) in Next.js.
   - Sheet 1: "Guide" (Instructions and Legend).
   - Sheets 2-13: One sheet for each month of the selected year (e.g., Jan, Feb, Mar...).

2. **Data Integration**:
   - Fetch all employees from the `employees` table.
   - Fetch attendance records for the target year from the `attendance` table.
   - Populate the month sheets with actual employee names and attendance status (P, A, L, HD, WO).

3. **Formatting & Styling**:
   - Replicate the exact styling from the Python script:
     - Colors: DARK_TEAL ("1B4D4F"), MID_TEAL ("2A7C7F"), LIGHT_TEAL ("E0F2F1"), WHITE ("FFFFFF"), WO_BG ("FFEBEE").
     - Borders on cells.
     - Merged headers ("PRIMETEK GLOBAL SOLUTIONS", "Attendance Register - {Month} {Year}").
     - Freeze panes at "C5".
     - Data validation dropdowns for attendance codes.
   - Pre-fill formulas for summary columns ("Present", "Absent", "Leave", "Working Days").

4. **User Interface**:
   - Replace or enhance the existing "Export CSV" button in `src/app/admin/attendance/AttendanceClient.tsx` to trigger this Excel export.
   - No need for check-in time or log hours in this specific sheet layout (just the daily status code).

## Constraints
- Use the existing Supabase database schema (`attendance` and `employees` tables).
- Must work within the Next.js App Router environment (likely as a Server Action or API Route that returns the file blob/buffer).
