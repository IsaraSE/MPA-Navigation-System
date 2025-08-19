# EcoMarineWay: Team Roles & Sprint Responsibilities

👥 **Team Members:** Sasmitha, Isara, Dinithi, Olivia 
 
🔁 **Project:** 5-Sprint Agile Development (Sprint 0 + 4 development sprints)  

🎯 **Goal:** Build a Minimum Viable Product (MVP) for Marine Protected Area (MPA) navigation, reporting, and alerts.  

---

## 🧩 Overview: Team Roles & Responsibilities

| Role                  | General Responsibilities |
|--------------------------|---------------------------|
| **Product Owner (PO)** | Defines the project vision, manages and prioritizes the product backlog, makes sure features match stakeholder needs |
| **Scrum Master (SM)** | Facilitates Scrum meetings (planning, daily standups, reviews, retrospectives), supports the team, removes obstacles, ensures Scrum rules are followed |
| **Full-Stack Dev** | Builds and connects both frontend (React) and backend (Node.js + MongoDB), integrates APIs, tests features, and ensures the app works as expected |

---

## 🔁 Role Rotation & Handover

* PO and SM rotate across sprints as assigned above to share ownership and learning.
* At the end of each sprint the outgoing PO/SM writes a short **handover note** (1–2 bullets) in ClickUp to the incoming role covering: blockers, pending decisions, and open technical debts.

---

## 🔌 REST API (initial)

| Method | Path                      | Purpose                                                               | Auth       |
| ------ | ------------------------- | --------------------------------------------------------------------- | ---------- |
| POST   | `/api/auth/signup`        | Register user                                                         | Public     |
| POST   | `/api/auth/login`         | Obtain JWT                                                            | Public     |
| GET    | `/api/users/me`           | Current user profile                                                  | JWT        |
| GET    | `/api/mpa`                | List MPA zones (geojson bbox or all)                                  | Public     |
| POST   | `/api/reports`            | Create report (hotspot/pollution)                                     | JWT        |
| GET    | `/api/reports`            | List reports (approved + own pending)                                 | Public/JWT |
| GET    | `/api/reports/:id`        | Get one report                                                        | Public     |
| PATCH  | `/api/reports/:id/status` | Admin approve/reject                                                  | Admin      |
| POST   | `/api/alerts/check`       | Send `{lat,lng}` → server returns alert(s) if inside MPA/near hotspot | JWT        |

---

## 📍 Frontend Pages

* **Public:** Home/Map (view MPAs & markers), Login, Signup.
* **Authenticated:** Report Form (Hotspot/Pollution), My Profile (my reports), Live Simulate (move marker, see alerts).
* **Admin:** Simple moderation table (approve/reject reports).

---

## 🗓️ Sprint Plans

> **Timebox:** 1–2 weeks per sprint. Each sprint includes planning, daily stand-ups, review, and retrospective.

---

### 🗓️ Sprint 0 — Setup & Planning

**Sprint Goal:** Environments ready; skeleton apps deploy; initial backlog.

**Backend (Isara)**

* [ ] Create Node/Express project scaffold (`/server`).
* [ ] Connect to **MongoDB Atlas** via env vars.
* [ ] Health endpoint `GET /health`.
* [ ] Seed script for 1–2 demo MPA polygons (GeoJSON) using **turf** types.
* [ ] CI: run `npm test`, `npm run lint`.

**Frontend (Olivia)**

* [ ] Create React + Vite app (`/web`) with Tailwind.
* [ ] Install Leaflet; render base map (OpenStreetMap tiles).
* [ ] Project layout (Navbar, Container, Footer).
* [ ] CI: build check.

**Process (Sasmitha, Dinithi)**

* [ ] ClickUp: space, lists (Product Backlog, Sprint Backlog, Bugs).
* [ ] Define **DoD**, **Definition of Ready**, working agreements.
* [ ] Release plan + risk log.

**Deliverables**

* ✅ BE & FE skeleton deployed (Render/Railway & Netlify).
* ✅ ClickUp board with initial epics/stories and priorities.
* ✅ Repo README with run scripts & environment setup.

**Acceptance Criteria**

* App URLs accessible publicly; `/health` returns 200.
* Base map loads in FE deploy.

---

### 🗓️ Sprint 1 — Authentication & Static Map

**Sprint Goal:** Users can sign up/login; map shows MPA zones.

**Backend (Isara)**

* [ ] `/api/auth/signup`, `/api/auth/login` with JWT.
* [ ] `/api/users/me` (JWT).
* [ ] `/api/mpa` returns seeded polygons (GeoJSON).
* [ ] Unit tests: auth & mpa (Jest + Supertest).
* [ ] Input validation (express-validator/Zod).

**Frontend (Olivia)**

* [ ] Auth pages (Signup/Login) with form validation.
* [ ] JWT storage (httpOnly cookie or localStorage + interceptor).
* [ ] Protected route for “Report” & “Profile”.
* [ ] Leaflet: render MPA polygons; legend & basic controls.

**Scrum (Sasmitha)**

* [ ] Daily standups, burndown chart, impediment tracking.

**Product (Dinithi)**

* [ ] Refine acceptance criteria for auth & map stories.
* [ ] Define simple roles: `user`, `admin`.

**Deliverables**

* ✅ Register/login/logout works end-to-end.
* ✅ MPA polygons visible on the map.
* ✅ Deployed increment demonstrating auth + map.

**Acceptance Criteria**

* New user can sign up, log in, refresh page, stays authenticated.
* MPA polygons load within 2s on typical campus Wi-Fi.

---

### 🗓️ Sprint 2 — Reporting (Hotspots & Pollution)

**Sprint Goal:** Users submit/view reports; DB stores & lists them.

**Backend (Isara)**

* [ ] `POST /api/reports` (validate payload, attach user).
* [ ] `GET /api/reports` (filters: type, bbox; approved + own pending).
* [ ] `GET /api/reports/:id`.
* [ ] Admin `PATCH /api/reports/:id/status`.
* [ ] Image upload stub (optional v1: URLs only).
* [ ] Tests: create/list/status change.

**Frontend (Olivia)**

* [ ] Report form (Hotspot: species+notes; Pollution: description).
* [ ] Map click → prefill lat/lng in form.
* [ ] Markers layer for reports; popup with details.
* [ ] “My Reports” table in Profile (status badges).

**Scrum (Sasmitha)**

* [ ] Enforce DoD; track test coverage trend.

**Product (Dinithi)**

* [ ] Approve UX copy, fields, moderation flow.
* [ ] Stakeholder check-in; backlog updates.

**Deliverables**

* ✅ Create & list hotspot/pollution reports.
* ✅ Map markers for reports with popups.
* ✅ Admin can approve/reject.

**Acceptance Criteria**

* Invalid submissions are rejected with clear messages.
* Approved reports appear on public map; pending visible only to owner.

---

### 🗓️ Sprint 3 — Alerts & Map Filtering

**Sprint Goal:** Show proximity/zone alerts; improve map usability.

**Backend (Isara)**

* [ ] `POST /api/alerts/check` receives `{lat,lng}`.
* [ ] Server uses **turf.js**: inside MPA or within 500m of hotspot → returns alert payload.
* [ ] Configurable threshold via env var.
* [ ] Tests for geometry logic.

**Frontend (Olivia)**

* [ ] “Simulate Vessel” page: play/pause path, moving marker.
* [ ] On position change → call `/alerts/check` → toast/banner alert.
* [ ] Filters: toggle layers (MPAs / Hotspots / Pollution).
* [ ] Marker detail panel (click → expanded info).

**Scrum/Product (Sasmitha/Dinithi)**

* [ ] Track burndown; refine alert UX acceptance criteria.

**Deliverables**

* ✅ Moving vessel marker demo.
* ✅ Real-time alerts when entering MPAs/near hotspots.
* ✅ Layer filter controls.

**Acceptance Criteria**

* Alert shown within 500ms of position update (mocked path).
* Filters persist while navigating pages.

---

### 🗓️ Sprint 4 — Profiles, Polish, Docs & Demo

**Sprint Goal:** Finalize UX, profiles, performance, and documentation.

**Backend (Isara)**

* [ ] `/api/users/me` returns user’s reports summary.
* [ ] Simple caching headers for static MPA.
* [ ] Pagination on list endpoints.

**Frontend (Olivia)**

* [ ] Profile page: list user’s submissions; quick links to map.
* [ ] UI polish: empty states, loading skeletons, error toasts.
* [ ] Basic accessibility pass (labels, keyboard nav).

**Scrum (Sasmitha)**

* [ ] Sprint review & retro, final burndown & velocity snapshot.

**Product (Dinithi)**

* [ ] Final acceptance, demo script, slide deck, README/docs.

**Deliverables**

* ✅ Final integrated system (map + reports + alerts + filters).
* ✅ Profile page & polished UI.
* ✅ Final report, slides, and Scrum evidence (screenshots of board, burndown, commits).

**Acceptance Criteria**

* Happy path demo runs without errors on deployed URLs.
* README includes setup, .env examples, and API docs.

---

## ✅ Definition of Done (DoD)

A story is **Done** when:

* Code merged to `main` via PR with review and passing CI.
* Unit/integration tests cover key paths (≥ minimal agreed coverage).
* UX validated against acceptance criteria on **desktop & mobile** widths.
* Deployed to staging (Netlify + Render) and verified by the team.
* Documentation updated (README, `/docs`, API examples).
* No critical console or server errors.

---

## 🧭 Risks & Mitigations

* **Map performance with many markers:** Use clustering; server pagination/filters.
* **Geometry accuracy:** Use turf.js, test boundary cases.
* **Auth pitfalls:** Use JWT expiry/refresh pattern; guard protected routes.
* **Free-tier limits:** Keep payloads small; static MPA; image uploads optional.

---

## 🚫 Out of Scope (v1)

* Real vessel AIS integration (use simulated paths only).
* Offline support; advanced analytics; push notifications.
* Complex moderation workflows.

---


