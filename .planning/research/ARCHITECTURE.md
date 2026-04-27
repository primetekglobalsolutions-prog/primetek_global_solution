# Architecture Research — Primetek Global Solutions

## System Components

### 1. Frontend (Next.js 15)
- **Public App:** SSR (Server Side Rendering) for SEO.
- **Admin App:** Client-side heavy with protected routes.
- **Employee App:** Mobile-optimized PWA with location API access.

### 2. Backend (Express.js)
- **REST API:** Centralized logic for inquiries, jobs, and employee management.
- **Middleware:** JWT validation, input sanitization, and rate limiting.

### 3. Data Store (PostgreSQL)
- **Tables:** `users`, `employees`, `attendance`, `inquiries`, `jobs`, `applications`.
- **Relational Integrity:** Cascading deletes for employee history and job applications.

### 4. Third-Party Integrations
- **HR SaaS (Zoho/Keka):** Attendance data sync via OAuth 2.0.
- **AWS S3:** Media and document storage.
- **Email (Resend):** Transactional notifications for leads and jobs.

## Data Flow Map

1. **Lead Generation:**
   `Visitor -> Inquiry Form -> Express API -> PostgreSQL -> Admin Dashboard (Real-time update via Polling/Websockets)`

2. **Attendance (SaaS Sync):**
   `Employee -> PWA Check-in -> Browser Geolocation -> Express API -> PostgreSQL (Local Log) -> SaaS HR API (Background Sync)`

## Build Order Recommendation
1. **Core:** Database Schema + Auth System.
2. **Phase 1A:** Public Website + Inquiry Form (Lead Gen first).
3. **Phase 1B:** Admin CMS (Content control).
4. **Phase 2:** Employee Portal + SaaS HR Integration.
