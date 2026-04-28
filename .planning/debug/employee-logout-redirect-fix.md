---
status: fixed
trigger: "employee login after login and then logout it redirectlng to admin login page"
created: 2026-04-28
updated: 2026-04-28
---

# Debug Session: Employee Logout Redirect Fix

## Symptoms
- **Expected**: After employee logout, redirect to `/employee/login`.
- **Actual**: Redirects to `/admin/login`.
- **Timeline**: Recent routing migration to root-level `/admin` and `/employee`.
- **Reproduction**: Login as employee -> Logout.

## Current Focus
- **hypothesis**: The logout server action or middleware has a hardcoded redirect to `/admin/login`.
- **test**: Inspect `src/components/pwa/AppSidebar.tsx`.
- **expecting**: Find a `router.replace('/admin/login')` in the shared component.
- **next_action**: Applied role-aware redirect.

## Evidence
- 2026-04-28: Session initialized.
- 2026-04-28: Found hardcoded redirect in `src/components/pwa/AppSidebar.tsx` at line 46.
- 2026-04-28: Applied fix to use `role === 'admin' ? '/admin/login' : '/employee/login'`.

## Resolution
- **root_cause**: Shared PWA sidebar component was hardcoded to redirect to the admin login page regardless of the user's role.
- **fix**: Changed `router.replace('/admin/login')` to a conditional check based on the `role` prop.
- **verification**: Build passed. Manual verification needed by user.

## Eliminated Hypotheses
- **Middleware redirect**: Middleware logic is correct and handles both scopes independently.
- **API route redirect**: Logout API only clears cookies and returns JSON; it does not perform redirects.

