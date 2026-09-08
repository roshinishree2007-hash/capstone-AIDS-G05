# AI Lab GPU & Workstation Time-Slot Reservation System

[![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade, 3-tier full-stack laboratory resource management system engineered for Artificial Intelligence & Data Science students to schedule dedicated high-performance GPU workstations (NVIDIA RTX 4090, A100 Tensor Core, H100 PCIe, RTX A6000) for deep learning training workloads.

---

## 📌 Problem Statement & Solution

### The Challenge
AI and Data Science students frequently encounter resource contention when competing for a limited pool of high-end GPU workstations. In the absence of an automated scheduler, students face double bookings, zero schedule transparency, monopolization of hardware by long-running jobs, and wasted physical lab trips.

### The Solution
The **AI Lab GPU & Workstation Reservation System** introduces:
- **Live Workstation Availability Dashboard**: Real-time visibility into 20 GPU nodes across the lab.
- **Microsecond Conflict Prevention**: Backend JPQL interval overlap queries guarantee atomic double-booking prevention.
- **Fair-Share Policy Enforcement**: Strict 2-hour maximum reservation duration and 1 active slot per student per day policy.
- **Lab Assistant Control Desk**: Physical attendance check-in workflow, GPU node release upon training completion, and hardware maintenance toggles.
- **Dual-Screen Responsiveness**: Fully optimized interface for both laptop/desktop workstations and mobile smartphones.

---

## 🏗️ 3-Tier Enterprise Architecture

```
[ Tier 1: Presentation Tier ]
  ├── Semantic HTML5 & CSS3 Glassmorphism UI
  ├── Bootstrap 5 Responsive Grid (Laptop & Mobile)
  ├── Modern Vanilla JavaScript (ES6+ async/await & Fetch API)
  └── Dual-Portal: Student Reservation & Lab Assistant Desk
        │
        │  HTTP REST / JSON (CORS Configured)
        ▼
[ Tier 2: Application Tier ]
  ├── Spring Boot 3 (Java 17+)
  ├── Spring Web REST Controllers (@RestController)
  ├── Service Layer with Business Rules (@Service, @Transactional)
  ├── Jakarta Validation & Global Exception Advice (@RestControllerAdvice)
  └── Spring Data JPA Repository Layer
        │
        │  JDBC / Hikari Connection Pool (Port 3306)
        ▼
[ Tier 3: Data Tier ]
  ├── MySQL 8.0 Engine (`ai_lab_reservation`)
  ├── Normalized Relational Schema: `students`, `workstations`, `lab_bookings`
  └── Composite Indexes for Instant Overlap Query Execution
```

---

## 🚀 Quick Start (Local Run on Windows)

### 1-Click Automated Runner
Double-click `run_project.bat` in the project root:
```cmd
run_project.bat
```
The automated script will:
1. Validate Java 17+ environment.
2. Check MySQL connection on port 3306.
3. Build and launch the Spring Boot backend on `http://localhost:8080`.
4. Open the responsive frontend in your default browser.

### Manual Launch

#### Backend (Spring Boot 3):
```cmd
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

#### Frontend:
Open `frontend/index.html` directly in any web browser, or serve statically:
```cmd
cd frontend
npx serve -l 5500
```
Visit `http://localhost:5500`.

---

## 🖥️ 20 AI Lab GPU Fleet Inventory

The system comes pre-seeded with 20 realistic AI workstations:

| ID | Code | Workstation Name | GPU Hardware | VRAM | CPU Model | RAM | Location |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `WS-GPU-01` | Workstation Alpha 1 | NVIDIA GeForce RTX 4090 | 24 GB | Intel i9-14900K (24C) | 128 GB | Room 304 - Row 1 |
| 2 | `WS-GPU-02` | Workstation Alpha 2 | NVIDIA GeForce RTX 4090 | 24 GB | Intel i9-14900K (24C) | 128 GB | Room 304 - Row 1 |
| 3 | `WS-GPU-03` | Workstation Alpha 3 | NVIDIA GeForce RTX 4090 | 24 GB | AMD Ryzen 9 7950X | 128 GB | Room 304 - Row 1 |
| 4 | `WS-GPU-04` | Workstation Alpha 4 | NVIDIA GeForce RTX 4090 | 24 GB | AMD Ryzen 9 7950X | 128 GB | Room 304 - Row 1 |
| 5 | `WS-GPU-05` | Workstation Titan 1 | NVIDIA A100 Tensor Core | 80 GB | AMD EPYC 7763 (64C) | 256 GB | Cluster Rack A |
| 6 | `WS-GPU-06` | Workstation Titan 2 | NVIDIA A100 Tensor Core | 80 GB | AMD EPYC 7763 (64C) | 256 GB | Cluster Rack A |
| 7 | `WS-GPU-07` | Workstation Titan 3 | NVIDIA H100 PCIe | 80 GB | Intel Xeon Plat 8480+ | 256 GB | Cluster Rack A |
| 8 | `WS-GPU-08` | Workstation Pro 1 | NVIDIA RTX A6000 | 48 GB | Threadripper 5975WX | 128 GB | Room 304 - Row 2 |
| 9 | `WS-GPU-09` | Workstation Pro 2 | NVIDIA RTX A6000 | 48 GB | Threadripper 5975WX | 128 GB | Room 304 - Row 2 |
| 10 | `WS-GPU-10` | Workstation Pro 3 | NVIDIA RTX A5000 | 24 GB | Intel i9-13900K | 64 GB | Room 304 - Row 2 |
| 11 | `WS-GPU-11` | Workstation Beta 1 | NVIDIA GeForce RTX 3090 Ti | 24 GB | Intel i9-12900K | 64 GB | Room 304 - Row 3 |
| 12 | `WS-GPU-12` | Workstation Beta 2 | NVIDIA GeForce RTX 3090 | 24 GB | Intel i9-12900K | 64 GB | Room 304 - Row 3 |
| 13 | `WS-GPU-13` | Workstation Beta 3 | NVIDIA GeForce RTX 3090 | 24 GB | AMD Ryzen 9 5950X | 64 GB | Room 304 - Row 3 |
| 14 | `WS-GPU-14` | Workstation Beta 4 | NVIDIA GeForce RTX 3090 | 24 GB | AMD Ryzen 9 5950X | 64 GB | Room 304 - Row 3 |
| 15 | `WS-GPU-15` | Workstation Gamma 1 | NVIDIA GeForce RTX 4080 | 16 GB | Intel i7-14700K | 64 GB | Room 304 - Row 4 |
| 16 | `WS-GPU-16` | Workstation Gamma 2 | NVIDIA GeForce RTX 4080 | 16 GB | Intel i7-14700K | 64 GB | Room 304 - Row 4 |
| 17 | `WS-GPU-17` | Workstation Gamma 3 | NVIDIA GeForce RTX 4070 Ti | 12 GB | AMD Ryzen 7 7800X3D | 64 GB | Room 304 - Row 4 |
| 18 | `WS-GPU-18` | Workstation Gamma 4 | NVIDIA GeForce RTX 4070 Ti | 12 GB | AMD Ryzen 7 7800X3D | 64 GB | Room 304 - Row 4 |
| 19 | `WS-GPU-19` | Workstation Delta 1 | Dual RTX 4090 (NVLink) | 48 GB | Threadripper 7970X | 192 GB | Room 304 - Row 5 |
| 20 | `WS-GPU-20` | Workstation Delta 2 | Dual RTX 4090 (NVLink) | 48 GB | Threadripper 7970X | 192 GB | Room 304 - Row 5 |

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/workstations` | Retrieve all 20 GPU workstations | `200 OK` |
| `GET` | `/api/workstations/{id}` | Retrieve single workstation specs | `200 OK` / `404` |
| `GET` | `/api/workstations/available` | Retrieve currently available workstations | `200 OK` |
| `PUT` | `/api/workstations/{id}/status` | Update status (e.g. Maintenance mode) | `200 OK` |
| `GET` | `/api/bookings` | Retrieve all reservations | `200 OK` |
| `GET` | `/api/bookings/{id}` | Retrieve single reservation | `200 OK` / `404` |
| `POST` | `/api/bookings` | Create new reservation | `201 Created` / `400` / `409` |
| `PUT` | `/api/bookings/{id}/checkin` | Check in student upon physical lab entry | `200 OK` |
| `PUT` | `/api/bookings/{id}/release` | Release workstation session and reset GPU | `200 OK` |
| `DELETE` | `/api/bookings/{id}` | Cancel reservation | `200 OK` |

---

## 🛡️ Business Rules Enforced

1. **Duration Limit:** Time slot cannot exceed 2 hours (120 minutes).
2. **Daily Limit:** A student can hold at most 1 active reservation per calendar day.
3. **Conflict Rejection:** Workstation time-slot collision detection (`startA < endB AND endA > startB`).
4. **Maintenance Shield:** Workstations flagged as `MAINTENANCE` cannot be reserved.
5. **Temporal Validity:** Start time must strictly precede End time; dates cannot be in the past.
6. **Required Metadata:** Roll number, name, valid email, workstation, date, time, project title, and model framework.
7. **Assistant Check-In:** Controlled transition from `CONFIRMED` to `IN_USE`.
8. **Assistant Release:** Controlled transition from `IN_USE` to `COMPLETED` and GPU restoration to `AVAILABLE`.
9. **No Ghost Reservations:** Released or cancelled bookings do not block future slots.
10. **Unified JSON Errors:** Standardized schema `{ timestamp, status, error, message, path }`.

---

## 📊 Technical Presentation
An interactive, zero-dependency academic technical presentation is located at:
```
presentation/index.html
```
Open in any browser to present 8 slides with keyboard navigation (<kbd>&larr;</kbd> <kbd>&rarr;</kbd>).

---

## 📑 Runbook & Testing Documentation
Comprehensive documentation matching academic Runbook Sheets 8 to 12 and Postman test collections are available in:
- `docs/RUNBOOK.md`
- `docs/postman_collection.json`
