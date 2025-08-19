# 🌊 EcoMarineWay

**EcoMarineWay** is a low-impact maritime navigation alert application for ships to navigate safely through marine protected areas (MPAs).

**Status:** 🚧 Development in progress  
**Timeline:** 🗓️ Sprint 0 + 4 development sprints (8 weeks)  
**MVP Goal:** 🎯 Deliver the core features required for ships to navigate MPAs safely.

---

## 📝 Overview
EcoMarineWay helps ships avoid protected areas, report marine hotspots and pollution, and receive alerts for safe navigation.

---

## 🛠️ Tech Stack
- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Database:** MongoDB Atlas  
- **Deployment:** Netlify / Render  
- **Project Management:** ClickUp  

---

## ⭐ MVP Features
- **🗺️ Interactive Map:** View and navigate MPAs on an interactive map.  
- **⚠️ Proximity Alerts:** Receive notifications when approaching protected areas or reported hotspots.  
- **🐟 Hotspot Reporting:** Submit and view marine animal sightings.  
- **🛢️ Pollution Reporting:** Report pollution incidents with location details.  
- **🔍 Map Filtering:** Filter visible reports by type (hotspots or pollution).  

---

## 🚀 Agile Sprint Plan

### Sprint 0 – Setup & Planning
**Goal:** Establish development environment, project setup, and initial backlog.  
**Tasks:**
- Create GitHub repo & branch strategy.  
- Set up MERN skeleton (React + Express + MongoDB Atlas).  
- Configure CI/CD (deploy skeleton to Netlify/Render).  
- Set up ClickUp workspace, backlog, and board.  
- Design wireframes for core screens (map, report form, login).  

**Deliverables:**
- Working MERN skeleton deployed online.  
- Wireframes for core features.  
- Initial prioritized product backlog in ClickUp.  

---

### Sprint 1 – Core Setup & Map
**Goal:** Enable user access and provide a basic map with MPAs.  
**Tasks:**
- Implement user signup/login (JWT) and roles (user/admin).  
- Build interactive map with static MPA polygons.  
- Create basic UI layout and navigation.  
- Write initial test cases for authentication.  

**Deliverables:**
- Users can register/login/logout.  
- Map with visible protected zones.  
- Deployed increment demonstrating login + map.  

---

### Sprint 2 – Reporting Features
**Goal:** Allow users to report and view hotspots and pollution incidents.  
**Tasks:**
- Build hotspot reporting form (location + species + notes).  
- Display hotspot markers on map.  
- Implement pollution report form (location + description).  
- Create list view of reports.  
- Add backend APIs for reports.  

**Deliverables:**
- Hotspot reports visible on map.  
- Pollution reports created and listed.  
- Database stores reports reliably.  

---

### Sprint 3 – Alerts & Filtering
**Goal:** Improve usability with alerts and filtering.  
**Tasks:**
- Implement simulated vessel path with moving marker.  
- Add proximity alert when near hotspots/protected areas.  
- Implement map filtering (toggle hotspots/pollution).  
- Improve UI for report details (click marker to view info).  

**Deliverables:**
- Vessel marker moves along a path.  
- Alerts shown when entering protected zones/hotspots.  
- Filter buttons working on map.  
- Usable clickable markers.  

---

### Sprint 4 – Polishing & Finalization
**Goal:** Refine the system, add profile view, and prepare for presentation.  
**Tasks:**
- Add basic user profile page (list of user’s submitted reports).  
- Fix bugs and improve UI styling.  
- Write documentation for features.  
- Prepare burndown charts, sprint logs, and final report.  
- Run rehearsal for demo/presentation.  

**Deliverables:**
- Final integrated system (map + reports + alerts + filters).  
- User profile page functional.  
- Polished UI and bug-free demo.  
- Final report + presentation slides + evidence of Scrum events.  

---

## 🏗️ Agile Practices
- **Daily Standups:** 15 mins, sync progress and blockers  
- **Sprint Reviews:** Demo features to stakeholders  
- **Retrospectives:** Reflect and improve team process  
- **User Testing:** At least 5 test users per sprint  
- **Backlog Grooming:** Weekly refinement using MoSCoW prioritization  

---

## ✅ Definition of Done (DoD)
A feature is considered "Done" when:
- Code is peer-reviewed and merged  
- Unit/integration tests pass  
- Responsive and accessible UI  
- Documented in project wiki  
- Tested in staging environment  

---

## 📌 Backlog & Scope Management
- **MVP focus:** Only must-have features included  
- **Change control:** New requests go to backlog for post-MVP  
- **Lean approach:** Use existing APIs and component libraries to save development time  

---

## 🔒 Key Technical Considerations
- **Security:** HTTPS, JWT authentication, Stripe PCI compliance  
- **Performance:** Optimized API responses, lazy loading  
- **Trust:** Transparent impact reporting, verified charities (TBD post-MVP)  
- **Scalability:** Flexible MongoDB schema supports reporting growth  

---

## ⚠️ Risk Management

| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature creep | Timeline delays | Strict backlog control, MoSCoW prioritization |
| Payment integration delays | Blocked donation flow | Prioritize Stripe; PayPal as stretch goal |
| Poor donor trust | Low conversion | Usability testing, trust badges, clear impact data |
| Team bandwidth | Missed deadlines | Parallel frontend/backend work, reuse components |

---

## 🤝 Stakeholder Engagement
- Regular demos after each sprint  
- Feedback incorporated into backlog  
- Maintain open communication through ClickUp & Slack  

---

## 🎯 Conclusion
EcoMarineWay helps ships navigate safely through MPAs while enabling community-driven reporting of marine wildlife and pollution incidents.  

---

## 📂 Project Resources
- Figma Wireframes (link when available)  
- API Documentation (to be created)
