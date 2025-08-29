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

### 🗓️ Sprint 0 — Setup & Planning (1 week) [ 9th of August - 16th of August ]
**PO = Dinithi | SM = Sasmitha**

**Sprint Goal:** Environments ready; skeleton apps deploy; initial backlog.

**Backend Initialisation (Isara)**  
* Create Node/Express project
* Connect to **MongoDB Atlas** via env vars.  
* Health endpoint `GET /health`.  
* Seed script for demo MPA polygons (GeoJSON).  
* CI: run `npm test`, `npm run lint`.  

**Frontend Initialisation (Olivia)**  
* Create a React app with Tailwind.  
* Install Leaflet; render base map (OpenStreetMap tiles).  
* Project layout (Navbar, Container, Footer).  
* CI: build check.  

**Process (SM + PO)**  
* ClickUp: space, lists (Product Backlog, Sprint Backlog, Bugs).  
* Define **DoD**, **Definition of Ready**, working agreements.  
* Release plan + risk log.  

**Deliverables:**  
- BE & FE skeleton deployed (Render/Railway & Netlify).  
- ClickUp board with epics/stories and priorities.  
- Repo README with run scripts & env setup.  

---

### 🗓️ Sprint 1 — Authentication & Static Map - (2 weeks) [ 16th of August - 30th of August ]
**PO = Isara | SM = Olivea**

**Sprint Goal:** Users can sign up/login; map shows MPA zones.

**Map Integration (Sasmitha)**  
* `/api/mpa` returns seeded polygons (GeoJSON).  
* Unit tests (auth + mpa).
* Leaflet renders MPA polygons with legend.  

**User Management Features (Dinithi)** 
* Auth pages (Signup/Login) with validation.
* `/api/auth/signup`, `/api/auth/login` with JWT.  
* `/api/users/me` (JWT).    
* JWT storage + protected routes.   

**Scrum (SM)**  
* Facilitate daily standups, burndown, and remove blockers.  

**Product (PO)**  
* Refine acceptance criteria for auth & map stories.  

**Deliverables:**  
- Register/login/logout works end-to-end.  
- MPA polygons visible on the map.  

---

(‼ We will be updating the scope of sprint 2 after re-evaluating the sprint 1 ‼)

### 🗓️ Sprint 2 — Reporting (Hotspots & Pollution)  
**PO = Sasmitha | SM = Olivia**

**Sprint Goal:** Users submit/view reports; DB stores & lists them.

**User reporting feature (Isara)**  
* `POST /api/reports`, `GET /api/reports`, `GET /api/reports/:id`.  
* Admin approval API.  
* Tests: create/list/status change.  

**Frontend (Olivia)**  
* Report form (Hotspot + Pollution).  
* Map click → prefill location.
* Marker layer for reports + popup details.  
* Profile: “My Reports” table with status.  

**Scrum (SM)**  
* Track sprint progress, remove blockers.  

**Product (PO)**  
* Approve UX flow, update backlog.  

**Deliverables:**  
- Create & list hotspot/pollution reports.  
- Map markers with popups.  
- Admin approval working.  

---

### 🗓️ Sprint 3 — Alerts & Map Filtering  
**PO = Dinithi | SM = Olivea**

**Sprint Goal:** Show proximity/zone alerts; improve map usability.

**Backend (Isara)**  
* `/api/alerts/check` with turf.js.  
* Return alerts if inside MPA or near a hotspot
* Geometry tests.  

**Frontend (Olivia)**  
* Vessel simulation page (play/pause).  
* On position change → call `/alerts/check` → show alert.  
* Filters for toggling layers.  
* Marker detail panel.  

**Scrum (SM)**  
* Facilitate sprint events, track burndown.  

**Product (PO)**  
* Define alert UX, approve filtering requirements.  

**Deliverables:**  
- Moving vessel marker demo.  
- Real-time alerts.  
- Map filtering.  

---

### 🗓️ Sprint 4 — Profiles, Polish, Docs & Demo  
**PO = Isara | SM = Sasmitha**

**Sprint Goal:** Finalise UX, profiles, performance, and documentation.

**Backend (Isara)**  
* `/api/users/me` returns user’s reports summary.  
* Pagination + caching for MPAs.  

**Frontend (Olivia)**  
* Profile page: user’s reports list.  
* UI polish (empty states, error handling).  
* Accessibility checks.  

**Scrum (SM)**  
* Sprint review & retrospective.  
* Final burndown & velocity snapshot.  

**Product (PO)**  
* Final acceptance, demo prep, documentation review.  

**Deliverables:**  
- Final integrated system (map + reports + alerts + filters).  
- Profile page working.  
- Final docs, slides, and Scrum evidence.  

---

## ✅ Definition of Done (DoD)

A story is **Done** when:  
* Code merged to `main` via PR with review and passing CI.  
* Tests (unit/integration) cover key paths.  
* UX validated on desktop & mobile.  
* Deployed to staging (Netlify + Render).  
* Documentation updated (README, API docs).  
* No critical console/server errors.  

---

## 🧭 Risks & Mitigations

* **Map performance:** Use clustering & pagination.  
* **Geometry accuracy:** Use turf.js + tests.  
* **Auth pitfalls:** JWT expiry, protected routes.  
* **Free-tier limits:** Small payloads, optional image upload.  

---

## 🚫 Out of Scope (v1)

* Real vessel AIS data (use simulated path only).  
* Offline support & advanced analytics.  
* Push notifications.  
* Complex moderation workflows.  

---
