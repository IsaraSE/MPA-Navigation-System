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

**Sprint Goal:** Prepare the development environment, agree on the vision, and set up the initial backlog.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Sasmitha | Scrum Master (SM)      | - Organize planning meeting<br>- Define sprint schedule and Scrum events<br>- Make sure team understands Agile roles |
| Dinithi  | Product Owner (PO)     | - Write project vision statement<br>- Draft initial product backlog<br>- Prioritize features for Sprint 1 |
| Isara    | Full-Stack Developer   | - Set up MERN project structure<br>- Configure MongoDB Atlas<br>- Connect backend with frontend starter code |
| Olivia   | Full-Stack Developer   | - Deploy skeleton app online (Heroku/Render)<br>- Set up CI/CD pipeline<br>- Create simple wireframes for core screens |

**Deliverables:**
- Deployed MERN project skeleton  
- Wireframes for login, map, and reporting forms  
- Initial prioritized product backlog in ClickUp  

---

## 🗓️ Sprint 1 – Core Setup & Map

**Sprint Goal:** Allow user login and show a map with Marine Protected Areas (MPAs).  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Isara    | Scrum Master (SM)      | - Run daily standups<br>- Track progress on ClickUp<br>- Remove blockers |
| Olivia   | Product Owner (PO)     | - Refine backlog for authentication and map features<br>- Prioritize user stories<br>- Check stakeholder expectations |
| Sasmitha | Full-Stack Developer   | - Build map UI<br>- Show static polygons for MPAs<br>- Create basic navigation layout |
| Dinithi  | Full-Stack Developer   | - Implement user authentication (JWT)<br>- Create user roles<br>- Connect backend login with frontend |

**Deliverables:**
- Login, logout, and register features working  
- Map displays protected zones  
- Deployed increment showing login + map  

---

## 🗓️ Sprint 2 – Reporting Features

**Sprint Goal:** Let users report hotspots and pollution incidents, and view them on the map.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Olivia   | Scrum Master (SM)      | - Lead Scrum ceremonies<br>- Monitor sprint tasks<br>- Help resolve blockers |
| Sasmitha | Product Owner (PO)     | - Prioritize reporting features<br>- Update backlog based on feedback<br>- Approve acceptance criteria |
| Isara    | Full-Stack Developer   | - Create hotspot reporting form<br>- Show hotspot markers on map<br>- Test form submissions |
| Dinithi  | Full-Stack Developer   | - Create pollution report form<br>- Build list view of reports<br>- Implement backend APIs for reports |

**Deliverables:**
- Hotspot reports visible on map  
- Pollution reports created and listed  
- Database stores reports reliably  

---

## 🗓️ Sprint 3 – Alerts & Filtering

**Sprint Goal:** Add alert notifications and improve usability with filtering.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Sasmitha | Scrum Master (SM)      | - Facilitate daily Scrum<br>- Track burndown<br>- Support developers |
| Dinithi  | Product Owner (PO)     | - Refine backlog for alerts/filtering<br>- Clarify requirements for proximity alerts<br>- Approve filtering design |
| Isara    | Full-Stack Developer   | - Add vessel simulation marker<br>- Make report markers clickable<br>- Show detailed info when clicked |
| Olivia   | Full-Stack Developer   | - Add proximity alerts when vessel enters MPA<br>- Add filter options for reports<br>- Test alert system |

**Deliverables:**
- Moving vessel marker  
- Alerts for entering MPAs  
- Working filters on map  
- Clickable report markers with details  

---

## 🗓️ Sprint 4 – Polishing & Finalization

**Sprint Goal:** Refine the system, add user profiles, and prepare the final demo.  

| Member   | Role                   | Responsible Tasks |
|----------|------------------------|-------------------|
| Isara    | Scrum Master (SM)      | - Facilitate sprint review and retrospective<br>- Track final sprint tasks<br>- Ensure readiness for demo |
| Olivia   | Product Owner (PO)     | - Approve final backlog<br>- Coordinate demo presentation<br>- Gather final feedback |
| Sasmitha | Full-Stack Developer   | - Build user profile page<br>- Fix UI bugs<br>- Refine frontend design |
| Dinithi  | Full-Stack Developer   | - Optimize backend for performance<br>- Ensure final deployment<br>- Fix remaining bugs |

**Deliverables:**
- Final working system (map + reports + alerts + filters)  
- User profile page completed  
- Polished, bug-free demo ready  
- Final report, presentation slides, and Scrum evidence  

---

## ✅ Definition of Done (DoD)

A backlog item is Done when:

- Code is reviewed and merged into main branch  
- Tests (unit + integration) are completed  
- Feature works smoothly on desktop and mobile  
- Deployed to staging and verified by the team  
- Documentation updated with usage instructions  
