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

## 🗓️ Sprint 0 – Setup & Planning

**Sprint Goal:** Establish development environment, project setup, and initial backlog.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Sasmitha | Scrum Master (SM)      | - Organize planning meeting<br>- Set up ClickUp workspace, backlog, and Scrum board<br>- Define sprint events and team alignment |
| Dinithi  | Product Owner (PO)     | - Define project vision<br>- Create initial backlog in ClickUp<br>- Prioritize features for Sprint 1 |
| Isara    | Full-Stack Developer   | - Create GitHub repo & branch strategy<br>- Set up MERN skeleton (React + Express + MongoDB Atlas) |
| Olivia   | Full-Stack Developer   | - Configure CI/CD and deploy skeleton (Netlify/Render)<br>- Design wireframes for core screens (map, report form, login) |

**Deliverables:**
- Working MERN skeleton deployed online  
- Wireframes for core features  
- Initial prioritized product backlog in ClickUp  

---

## 🗓️ Sprint 1 – Core Setup & Map

**Sprint Goal:** Enable user access and provide a basic map with MPAs.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Isara    | Scrum Master (SM)      | - Facilitate daily standups<br>- Track progress on ClickUp<br>- Remove blockers |
| Olivia   | Product Owner (PO)     | - Refine backlog for authentication and map<br>- Prioritize sprint tasks<br>- Confirm acceptance criteria |
| Sasmitha | Full-Stack Developer   | - Build interactive map with static MPA polygons<br>- Create basic UI layout and navigation |
| Dinithi  | Full-Stack Developer   | - Implement signup/login (JWT)<br>- Add roles (user/admin)<br>- Write initial test cases for authentication |

**Deliverables:**
- Users can register/login/logout  
- Map with visible protected zones  
- Deployed increment demonstrating login + map  

---

## 🗓️ Sprint 2 – Reporting Features

**Sprint Goal:** Allow users to report and view hotspots and pollution incidents.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Olivia   | Scrum Master (SM)      | - Lead Scrum ceremonies<br>- Monitor sprint tasks<br>- Support developers in removing blockers |
| Sasmitha | Product Owner (PO)     | - Prioritize reporting features<br>- Update backlog with stakeholder feedback<br>- Approve acceptance criteria |
| Isara    | Full-Stack Developer   | - Build hotspot reporting form (location + species + notes)<br>- Display hotspot markers on map |
| Dinithi  | Full-Stack Developer   | - Implement pollution report form (location + description)<br>- Create list view of reports<br>- Add backend APIs for reports |

**Deliverables:**
- Hotspot reports visible on map  
- Pollution reports created and listed  
- Database stores reports reliably  

---

## 🗓️ Sprint 3 – Alerts & Filtering

**Sprint Goal:** Improve usability with alerts and filtering.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Sasmitha | Scrum Master (SM)      | - Facilitate daily Scrum<br>- Track burndown chart<br>- Ensure sprint progress |
| Dinithi  | Product Owner (PO)     | - Refine backlog for alerts and filtering<br>- Clarify requirements for proximity alerts<br>- Approve filtering features |
| Isara    | Full-Stack Developer   | - Implement simulated vessel path with moving marker<br>- Improve report details (click marker to view info) |
| Olivia   | Full-Stack Developer   | - Add proximity alerts when vessel nears hotspots/MPAs<br>- Add map filtering (toggle hotspots/pollution)<br>- Test alert functionality |

**Deliverables:**
- Vessel marker moves along a path  
- Alerts shown when entering protected zones/hotspots  
- Filter buttons working on map  
- Usable clickable markers  

---

## 🗓️ Sprint 4 – Polishing & Finalization

**Sprint Goal:** Refine the system, add profile view, and prepare for presentation.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Isara    | Scrum Master (SM)      | - Facilitate sprint review & retrospective<br>- Track final sprint tasks<br>- Prepare team for final demo |
| Olivia   | Product Owner (PO)     | - Approve final backlog<br>- Coordinate presentation prep<br>- Collect final feedback |
| Sasmitha | Full-Stack Developer   | - Add basic user profile page (list of user’s submitted reports)<br>- Fix bugs<br>- Improve UI styling |
| Dinithi  | Full-Stack Developer   | - Optimize backend for performance<br>- Write documentation for features<br>- Ensure final deployment<br>- Prepare burndown charts & logs |

**Deliverables:**
- Final integrated system (map + reports + alerts + filters)  
- User profile page functional  
- Polished UI and bug-free demo  
- Final report, presentation slides, and Scrum evidence  

---

## ✅ Definition of Done (DoD)

A backlog item is Done when:

- Code is reviewed and merged into main branch  
- Tests (unit + integration) are completed  
- Feature works smoothly on desktop and mobile  
- Deployed to staging and verified by the team  
- Documentation updated with usage instructions  
