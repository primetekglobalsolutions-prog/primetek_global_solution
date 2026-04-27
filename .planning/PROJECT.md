# Primetek Global Solutions Platform

## What This Is
A three-layer digital platform for Primetek Global Solutions, combining a public-facing staffing and consulting portfolio website, an internal admin CMS, and a lightweight employee HR portal. It positions the company as a credible partner while streamlining lead generation and operational HR management.

## Core Value
Showcase expertise and capture enterprise leads while providing a seamless self-service experience for employees.

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Responsive Public Portfolio Website (Hero, About, Services, Industries, Careers, Contact)
- [ ] Lead Generation via Structured Inquiry Forms (with Company field)
- [ ] Admin CMS for Content and Job Management
- [ ] Admin Operations Dashboard (Inquiry, Employee, and Attendance tracking)
- [ ] Employee HR Portal for Attendance Tracking (Check-in/out with location)
- [ ] SaaS HR Tool Integration for Phase 1 Attendance
- [ ] JWT-based Authentication for Admin and Employee access

### Out of Scope
- [ ] Custom Attendance System — Deferred to Phase 2 (using SaaS first)
- [ ] Role-Based Access Control — Deferred to Phase 2
- [ ] Leave Management System — Deferred to Phase 2
- [ ] Advanced Analytics — Deferred to Phase 2
- [ ] Native Mobile App — Using PWA approach instead

## Context
- The project aims to serve enterprise clients and job seekers while managing internal staff operations.
- The company focuses on IT and Non-IT staffing, Consulting, and Outsourcing.
- Transitioning from a manual or fragmented system to a unified platform.

## Constraints
- **Tech Stack**: Next.js + Tailwind CSS, Node.js/Express (or Django), PostgreSQL — Required for scalability and performance.
- **Storage**: AWS S3 — For resumes and images.
- **Auth**: JWT-based — For secure portal access.
- **Timeline**: 8-12 weeks target for full delivery.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Tailwind | Modern, high-performance frontend with rapid styling. | — Pending |
| PostgreSQL over MongoDB | Better suited for relational data (Employees, Attendance, Leads). | — Pending |
| SaaS Attendance for Phase 1 | Faster setup, GPS/mobile readiness, lower initial dev cost. | — Pending |
| PWA for Employee Portal | Cost-effective alternative to native apps while maintaining mobile accessibility. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-27 after initialization*
