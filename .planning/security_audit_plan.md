# Security Audit-Fix Classification

Following the comprehensive audit of the Primetek HR Portal, I have identified the following findings and classified them according to the `gsd-audit-fix` workflow.

| # | Finding | Severity | Classification | Fix Strategy |
|---|---|---|---|---|
| F-01 | Broken Access Control | High | **auto-fixable** | Add server-side guards to `/api/jobs/[id]` and audit all `/api/` endpoints. |
| F-02 | Brute Force Protection | High | **manual-only** | **Requires confirmation.** Install `rate-limiter-flexible` and implement per-IP throttling. |
| F-03 | Insecure Token Cookie Flags | High | **auto-fixable** | Update `auth-token` cookie flags to `Strict` and `Secure: true`. |
| F-04 | XSS Sanitization Audit | High | **auto-fixable** | Audit rendering of user-supplied content and add `dompurify` defense. |
| F-05 | Missing Security Headers | High | **auto-fixable** | Create `vercel.json` with HSTS, CSP, and X-Frame-Options. |
| F-06 | Clickjacking Protection | High | **auto-fixable** | Implement `frame-ancestors 'none'` in CSP via `vercel.json`. |
| F-07 | Exposed Secrets Audit | High | **auto-fixable** | Ensure no sensitive keys are exposed to client-side. |
| F-08 | IDOR Prevention | High | **auto-fixable** | Add resource ownership checks to API routes handling IDs. |
| F-09 | Non-Generic Error Messages | High | **auto-fixable** | Standardize login responses and implement constant-time verification. |
| F-10 | MFA Integration (TOTP) | High | **manual-only** | **Requires confirmation.** Massive feature adding `otplib`, `qrcode`, and DB schema changes. |

## 📦 Package Installation Request
To proceed with the requested fixes, I need your permission to install the following packages:
1.  **FIX 2 (Rate Limiting)**: `rate-limiter-flexible`
2.  **FIX 4 (XSS)**: `dompurify`, `@types/dompurify`, `jsdom`, `@types/jsdom`
3.  **FIX 10 (MFA)**: `otplib`, `qrcode`, `@types/qrcode`

## 🗄️ Database Schema Request
**FIX 10** requires adding two columns to the `employees` (or `admin_users`) table:
- `mfa_enabled`: boolean (default: false)
- `mfa_secret`: text (encrypted)

## 🛠️ Next Steps
1.  **I will wait for your confirmation** on the packages and database schema changes.
2.  Once confirmed, I will proceed to execute the **auto-fixable** findings (F-01, F-03, F-04, F-05, F-06, F-07, F-08, F-09).
3.  I will then implement the manual ones (F-02, F-10) upon your approval.

Please let me know if I should proceed with the installations and schema updates.
