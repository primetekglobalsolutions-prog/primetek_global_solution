# Pitfalls Research — Primetek Global Solutions

## Critical Risks

### 1. GPS Spoofing & Accuracy
- **Risk:** Employees can use fake location apps to check in from home.
- **Prevention:** 
    - Implement anti-spoofing checks (check for `mocked` flag in browser location API).
    - Use Wi-Fi SSID detection as a fallback validation.
    - Log IP address as a secondary location check.

### 2. API Rate Limits (SaaS Integration)
- **Risk:** Keka/Zoho APIs have strict rate limits (e.g., 50 requests/min).
- **Prevention:** 
    - Implement a queue system (BullMQ or similar) for background sync.
    - Cache common data (employee names/profiles) to avoid redundant API calls.

### 3. Mobile Location Permissions
- **Risk:** Users may deny location access, breaking the attendance system.
- **Prevention:**
    - Provide a clear UI explanation *before* the browser prompt.
    - Design a graceful fallback (e.g., "Manual entry with reason" + Admin flag).

### 4. SEO & Job Board Indexing
- **Risk:** Job postings in a JS-heavy app might not be indexed by Google Jobs.
- **Prevention:**
    - Use Next.js SSR/ISR for job pages.
    - Implement JSON-LD schema (JobPosting) on every listing.

### 5. Admin Scope Creep
- **Risk:** Admin dashboard becomes a full ERP, blowing out the timeline.
- **Prevention:**
    - Lock Phase 1 to "Leads + Jobs + Attendance Logs" only.
    - Relegate Payroll and Leave management to Phase 2.
