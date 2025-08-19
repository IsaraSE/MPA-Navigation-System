# EcoMarineWay: Team Roles & Sprint Responsibilities

**Members:** Sasmitha, Isara, Dinithi, Olivia

**Purpose:**
This document defines clear, simple responsibilities for each team member across Sprint 0 + 4 development sprints (bi-weekly sprints). It keeps accountability clear while allowing role rotation for the Product Owner (PO) and Scrum Master (SM).

---

## 🧩 Team Roles (overview)

* **Product Owner (PO)** – owns product vision, prioritizes backlog, and manages stakeholder feedback.
* **Scrum Master (SM)** – runs Scrum events, removes blockers, and keeps the team on process.
* **Full‑Stack Developer (Dev)** – implements features, writes tests, and helps with deployment.

> Note: Only two members are hands-on developers in each sprint, but everyone helps with testing, documentation and demos.

---

## 📅 Sprint assignments (2-week sprints)

Each sprint block lists the PO, SM and the two active developers plus short responsibilities tied to the sprint goals.

### Sprint 0 – Planning & Setup

**PO:** Dinithi
**SM:** Sasmitha
**Devs:** Isara, Olivia

**Responsibilities:**

* **Dinithi (PO):** define MVP scope for the sprint, prioritize backlog items for Sprint 1, gather stakeholder requirements, approve wireframes.
* **Sasmitha (SM):** set up ClickUp board, run Sprint 0 planning and backlog grooming sessions, ensure CI/CD and repo rules are decided.
* **Isara (Dev):** initialize the MERN skeleton, create initial repo structure, push basic frontend and backend scaffolding.
* **Olivia (Dev):** set up MongoDB Atlas project, configure environment variables, deploy initial skeleton to Netlify/Render.

**Sprint 0 Deliverables:** repo + branch strategy, MERN skeleton deployed, wireframes, prioritized backlog.

---

### Sprint 1 – Core Setup & Map

**PO:** Olivia
**SM:** Isara
**Devs:** Sasmitha, Dinithi

**Responsibilities:**

* **Olivia (PO):** finalize acceptance criteria for auth and map; review demo and accept or log changes.
* **Isara (SM):** run daily standups, unblock devs, track Sprint progress and tests for auth flows.
* **Sasmitha (Dev):** implement user signup/login (JWT) and roles; write basic auth tests.
* **Dinithi (Dev):** integrate interactive map and static MPA polygons; ensure map loads and markers display.

**Sprint 1 Deliverables:** working auth flows, basic map with protected zones, deployed increment.

---

### Sprint 2 – Reporting Features

**PO:** Sasmitha
**SM:** Dinithi
**Devs:** Isara, Olivia

**Responsibilities:**

* **Sasmitha (PO):** define report fields and acceptance criteria (hotspot & pollution), decide required validations.
* **Dinithi (SM):** coordinate API contract, ensure backend endpoints are ready, run integration checks.
* **Isara (Dev):** build hotspot reporting form and map marker flow; implement frontend validations.
* **Olivia (Dev):** create backend APIs for reports, persist reports to MongoDB, add list view endpoint.

**Sprint 2 Deliverables:** report forms, backend APIs, markers/list view visible on map.

---

### Sprint 3 – Alerts & Filtering

**PO:** Isara
**SM:** Olivia
**Devs:** Sasmitha, Dinithi

**Responsibilities:**

* **Isara (PO):** set proximity alert rules and UX expectations; approve demo behaviour.
* **Olivia (SM):** ensure simulated vessel flow works in staging and lead testing sessions.
* **Sasmitha (Dev):** implement vessel marker simulation, UI for alerts and popups.
* **Dinithi (Dev):** add map filters and clickable marker details; connect alerts to report data.

**Sprint 3 Deliverables:** moving vessel simulation, functioning proximity alerts, map filters, info popups.

---

### Sprint 4 – Polishing & Finalization

**PO:** Dinithi
**SM:** Sasmitha
**Devs:** Isara, Olivia

**Responsibilities:**

* **Dinithi (PO):** approve final acceptance for profile & reports pages; collect final stakeholder feedback.
* **Sasmitha (SM):** run final sprint ceremonies, coordinate bug-fix priorities, and prepare demo checklist.
* **Isara (Dev):** build basic user profile page (user’s reports) and finalize unit tests for frontend.
* **Olivia (Dev):** polish backend endpoints, run staging deployment, prepare migration/data snapshots for demo.

**Sprint 4 Deliverables:** polished UI, user profile, tested system, final demo materials and presentation evidence.

---

## ✅ Definition of Done (DoD) (team-wide)

A backlog item is Done when:

* Code is peer-reviewed and merged to main (or merge branch)
* Unit and integration tests pass or test plan documented
* Feature is responsive and accessible
* Feature is deployed to staging for QA
* Documentation (README or wiki) updated with usage notes

---

## 🔁 Role Rotation & Handover

* PO and SM rotate across sprints as assigned above to share ownership and learning.
* At the end of each sprint the outgoing PO/SM writes a short **handover note** (1–2 bullets) in ClickUp to the incoming role covering: blockers, pending decisions, and open technical debts.

---

## 📣 Communication & Tools

* **Daily updates:** 15-minute standups on working days (3 days/week)
* **Primary tools:** ClickUp (tasks), GitHub (code), Slack/Discord (chat), Figma (wireframes)
* **Demo:** each sprint review includes a 5–10 minute demo + feedback capture in ClickUp

---

## ✍️ Final notes

* Keep responsibilities light and focused for each two-week sprint.
* If a team member is blocked for more than a day, escalate to the SM immediately.
* Use MoSCoW priority: Must / Should / Could / Won't for quick backlog decisions.