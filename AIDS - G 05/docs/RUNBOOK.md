# AI Lab GPU & Workstation Time-Slot Reservation System — Master Runbook

> **Project Identity:** AI Lab GPU & Workstation Time-Slot Reservation System  
> **Domain:** Artificial Intelligence Laboratory Resource Management  
> **Architecture:** Decoupled 3-Tier Full-Stack Web Application  
> **Target Audience:** AI/Data Science Students & Lab Management Assistants  

---

# SHEET 8: REQUIREMENTS & RUNBOOK DATA

## 1. Project Overview & Problem Statement
Students training deep learning models (e.g., Vision Transformers, Large Language Models, Diffusion Models) frequently compete for a limited number of high-end GPU workstations in the AI laboratory. Manual paper logbooks and informal messaging lead to double bookings, zero schedule transparency, monopolization of hardware, and wasted research hours. 

The **AI Lab GPU & Workstation Reservation System** solves this by providing a fair-share, real-time web portal that enforces atomic time-slot booking, strict policy compliance (maximum 2-hour duration and 1 active booking per day), live availability status across 20 GPU nodes, and an administrative desk for physical check-in and GPU release.

---

## 2. Stakeholder Personas

| Attribute | Persona 1: AI / Research Student | Persona 2: AI Lab Assistant |
| :--- | :--- | :--- |
| **Primary Role** | 2nd-4th Year AI & Data Science Student | Laboratory Staff / System Administrator |
| **Goals** | 1. Find an available GPU workstation matching model VRAM requirements.<br>2. Reserve guaranteed compute time-slots for model training.<br>3. Prevent conflicting double bookings with peers.<br>4. Monitor active reservation status. | 1. Monitor real-time status of all 20 workstations.<br>2. Verify student identity and perform arrival check-in.<br>3. Release workstations when training jobs conclude.<br>4. Mark faulty nodes into maintenance mode. |
| **Frustrations** | 1. Arriving at the lab to find all GPUs occupied.<br>2. Conflicting bookings where multiple students claim one machine.<br>3. Hardware monopolization by long-running unauthorized jobs. | 1. Disorganized manual paper logs and unauthorized walk-ins.<br>2. Inability to track who is currently running jobs.<br>3. No-shows holding idle workstations hostage. |
| **Technical Savviness** | Medium to High (PyTorch, TensorFlow, CUDA) | Medium (Lab administration, basic OS maintenance) |

---

## 3. User Stories

| Story ID | User Role | Feature Request (I want...) | Business Benefit (So that...) | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | Student | View real-time status of all 20 GPU workstations | I can immediately spot available machines without walking through the lab rows. | Must Have |
| **US-02** | Student | Inspect detailed GPU specifications (VRAM, CPU, RAM, Storage) | I can select a node with adequate VRAM (e.g. 24GB or 80GB) for my model architecture. | Must Have |
| **US-03** | Student | Reserve an available workstation for a selected date and time slot | I have guaranteed compute access for my research experiments. | Must Have |
| **US-04** | Student | Have the system enforce a maximum 2-hour reservation ceiling | Hardware is fairly distributed and no single student can monopolize GPUs. | Must Have |
| **US-05** | Student | Have the backend atomically reject any overlapping time slots | Double bookings are physically impossible in the lab. | Must Have |
| **US-06** | Lab Assistant | Check in students on arrival and release workstations upon departure | Idle nodes are promptly recycled back to the public pool and attendance is recorded. | Must Have |

---

## 4. Given / When / Then Acceptance Criteria

### Scenario 1: Valid Reservation Creation
- **Given:** Workstation `WS-GPU-01` has status `AVAILABLE` on `2026-09-08`.
- **When:** Student `AI2024-042` submits a reservation for `10:00` to `12:00` (2 hours) with valid project metadata.
- **Then:** The system creates the booking with status `CONFIRMED`, returns HTTP `201 Created`, and marks the workstation `RESERVED`.

### Scenario 2: Overlapping Booking Rejection (Rule 3)
- **Given:** Workstation `WS-GPU-03` is already reserved from `09:00` to `11:00`.
- **When:** Another student attempts to reserve `WS-GPU-03` from `10:00` to `12:00` on the same date.
- **Then:** The backend rejects the request with HTTP `409 Conflict` and message: `"Workstation is already reserved for an overlapping time slot."`

### Scenario 3: Exceeding 2-Hour Duration Limit (Rule 1)
- **Given:** An available workstation.
- **When:** A student selects a time slot from `09:00` to `12:00` (3 hours).
- **Then:** The client validation flags the error, and if submitted, the backend rejects with HTTP `400 Bad Request`: `"Reservation duration exceeds maximum allowed limit of 2 hours."`

### Scenario 4: Multiple Active Bookings on Same Day (Rule 2)
- **Given:** Student `AI2024-001` already holds an active `CONFIRMED` reservation for today.
- **When:** The same student attempts to create a second reservation on the same date.
- **Then:** The system aborts with HTTP `409 Conflict`: `"Student already has an active reservation on this date. Policy allows maximum 1 active reservation per day."`

### Scenario 5: Lab Assistant Check-In Lifecycle (Rule 7)
- **Given:** A booking with ID `1` in `CONFIRMED` state.
- **When:** The lab assistant triggers `PUT /api/bookings/1/checkin`.
- **Then:** The booking status updates to `IN_USE`, `checked_in_at` timestamp is saved, and workstation status switches to `IN_USE`.

### Scenario 6: Workstation Release Lifecycle (Rules 8 & 9)
- **Given:** A booking in `IN_USE` state on workstation `WS-GPU-05`.
- **When:** The lab assistant triggers `PUT /api/bookings/2/release`.
- **Then:** The booking status transitions to `COMPLETED`, `released_at` timestamp is logged, and workstation `WS-GPU-05` resets to `AVAILABLE`.

---

## 5. MoSCoW Feature Matrix

| Category | Features Included |
| :--- | :--- |
| **Must Have** | Workstation availability grid, GPU specifications viewer, 2-hour max slot limit, atomic overlap conflict prevention, 1 active reservation/day policy, mandatory student metadata (roll number, email, project title, model framework), lab assistant check-in desk, workstation release button, REST API, MySQL 8.0 persistence. |
| **Should Have** | Real-time search by GPU model / workstation code, status badge filters, student booking history table, KPI metric summary counters, toast notification feedback. |
| **Could Have** | Automated waitlist queue, hardware telemetry stats (VRAM temperature), email reminders before slot start. |
| **Won't Have** | Commercial payment gateways, cloud GPU provisioning (AWS/GCP), external social media login. |

---

# SHEET 9: ARCHITECTURE SPECIFICATION

## 3-Tier Enterprise Architecture
The system is constructed following the decoupled 3-tier enterprise pattern:

```
[ Tier 1: Presentation Layer ]
  - HTML5, CSS3, Bootstrap 5, Modern Vanilla JavaScript (ES6+)
  - Fetch API for async network communications
  - Dynamic DOM rendering, dual Student/Assistant views
  - Runs on: http://localhost:5500
           │
           │  HTTP REST (JSON Payloads / CORS Enabled)
           ▼
[ Tier 2: Application Layer ]
  - Java 17+, Spring Boot 3.2.x
  - Spring Web REST Controllers (@RestController)
  - Business Logic Services (@Service, @Transactional)
  - Jakarta Validation (@Valid)
  - Global Exception Handling (@RestControllerAdvice)
  - Spring Data JPA Repository Layer
  - Runs on: http://localhost:8080
           │
           │  JDBC / Hikari Connection Pool (Port 3306)
           ▼
[ Tier 3: Data Tier ]
  - MySQL 8.0 Relational Database Engine (`ai_lab_reservation`)
  - Normalized 3NF tables (students, workstations, lab_bookings)
  - Referential foreign keys & composite indices on (booking_date, workstation_id)
  - Runs on: localhost:3306
```

---

# SHEET 10: DATABASE DESIGN & DATA DICTIONARY

## 1. Relational Data Dictionary

### Table: `students`
Stores verified university students authorized to book laboratory GPUs.

| Column Name | Data Type | Constraint | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | No | Unique student identifier |
| `roll_number` | VARCHAR(30) | UNIQUE, NOT NULL | No | University student roll/registration number |
| `full_name` | VARCHAR(100) | NOT NULL | No | Student full legal name |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | No | College institutional email address |
| `department` | VARCHAR(50) | DEFAULT 'Artificial Intelligence & Data Science' | Yes | Academic department |
| `semester` | INT | DEFAULT 4 | Yes | Current academic semester |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | No | Record creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | No | Last update timestamp |

### Table: `workstations`
Maintains hardware inventory and operational states of all 20 GPU workstations.

| Column Name | Data Type | Constraint | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | No | Unique workstation record ID |
| `workstation_code` | VARCHAR(20) | UNIQUE, NOT NULL | No | Physical lab tag (e.g. `WS-GPU-01`) |
| `workstation_name` | VARCHAR(100) | NOT NULL | No | Friendly name (e.g. `Workstation Alpha 1`) |
| `gpu_model` | VARCHAR(80) | NOT NULL | No | Installed GPU (e.g. `NVIDIA GeForce RTX 4090`) |
| `vram_gb` | INT | NOT NULL | No | Dedicated video RAM capacity in Gigabytes |
| `cpu_model` | VARCHAR(100) | NOT NULL | No | Processor model (e.g. `Intel Core i9-14900K`) |
| `ram_gb` | INT | NOT NULL | No | System RAM in Gigabytes (e.g. `128`) |
| `storage_info` | VARCHAR(100) | NOT NULL | No | Solid state drive configuration |
| `status` | ENUM | NOT NULL, DEFAULT 'AVAILABLE' | No | State: `AVAILABLE`, `RESERVED`, `IN_USE`, `MAINTENANCE` |
| `lab_location` | VARCHAR(80) | NOT NULL | No | Physical desk/row location in Room 304 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | No | System onboarding timestamp |

### Table: `lab_bookings`
Records time-slot reservations, session state transitions, and project metadata.

| Column Name | Data Type | Constraint | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | No | Unique reservation ID |
| `student_id` | BIGINT | FOREIGN KEY &rarr; students(id) | No | Reference to reserving student |
| `workstation_id` | BIGINT | FOREIGN KEY &rarr; workstations(id) | No | Reference to booked workstation |
| `booking_date` | DATE | NOT NULL | No | Date of reservation |
| `start_time` | TIME | NOT NULL | No | Reservation slot start time |
| `end_time` | TIME | NOT NULL | No | Reservation slot end time (max +2h) |
| `project_title` | VARCHAR(150) | NOT NULL | No | Research / academic project title |
| `model_framework` | VARCHAR(100) | NOT NULL | No | Deep learning frameworks used |
| `status` | ENUM | NOT NULL, DEFAULT 'CONFIRMED' | No | `CONFIRMED`, `IN_USE`, `COMPLETED`, `CANCELLED` |
| `checked_in_at` | TIMESTAMP | NULL | Yes | Physical lab arrival timestamp |
| `released_at` | TIMESTAMP | NULL | Yes | Session completion timestamp |
| `assistant_notes` | VARCHAR(255) | NULL | Yes | Remarks from lab assistant |

---

# SHEET 11: REST API CONTRACT & BUSINESS RULES

## 1. REST API Contract Table

| HTTP Method | URL Endpoint | Purpose | Request Body | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/workstations` | Retrieve all 20 workstations | None | `200 OK` | `500` |
| **GET** | `/api/workstations/{id}` | Retrieve specific workstation | None | `200 OK` | `404, 500` |
| **GET** | `/api/workstations/available` | List only available workstations | None | `200 OK` | `500` |
| **PUT** | `/api/workstations/{id}/status` | Update hardware status (Maintenance) | `{"status": "MAINTENANCE"}` | `200 OK` | `400, 404, 500` |
| **GET** | `/api/bookings` | Retrieve all reservation records | None | `200 OK` | `500` |
| **GET** | `/api/bookings/{id}` | Retrieve specific reservation | None | `200 OK` | `404, 500` |
| **POST** | `/api/bookings` | Create new time-slot reservation | BookingRequestDTO (JSON) | `201 Created` | `400, 404, 409` |
| **PUT** | `/api/bookings/{id}/checkin` | Check in student upon lab arrival | None | `200 OK` | `400, 404, 500` |
| **PUT** | `/api/bookings/{id}/release` | Release workstation session | `{"assistantNotes": "..."}` | `200 OK` | `400, 404, 500` |
| **DELETE** | `/api/bookings/{id}` | Cancel reservation | None | `200 OK` | `400, 404, 500` |

---

# SHEET 12: TESTING, RUNBOOK & POSTMAN GUIDE

## 1. Setup & Launch Instructions
1. **Prerequisites:**
   - Java 17 or higher (`java -version`).
   - MySQL 8.0 Server running on port `3306` (or XAMPP MySQL).
   - Apache Maven (or run via IDE).
2. **Database Initialization:**
   - Execute `backend/src/main/resources/schema.sql` in MySQL, OR allow Spring Boot's built-in `DataInitializer` to automatically seed all 20 workstations and demo data at startup.
3. **One-Click Execution:**
   - Double-click `run_project.bat` from the project root.
   - The script runs prerequisite checks, builds the Spring Boot backend on port `8080`, and opens the frontend on `http://localhost:5500`.

## 2. Postman Test Scenarios

### Test 1: Create Valid Reservation
- **Endpoint:** `POST http://localhost:8080/api/bookings`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "rollNumber": "AI2024-055",
  "studentName": "Kavya Murthy",
  "email": "kavya.murthy@college.edu",
  "workstationId": 1,
  "bookingDate": "2026-09-08",
  "startTime": "13:00:00",
  "endTime": "15:00:00",
  "projectTitle": "Stable Diffusion LoRA Training for Medical Diagrams",
  "modelFramework": "PyTorch + Diffusers"
}
```
- **Expected Response:** HTTP `201 Created`, JSON payload with generated booking ID and status `CONFIRMED`.

### Test 2: Overlapping Reservation Rejection
- Submit identical workstation ID and overlapping time slot (`14:00:00` to `16:00:00`).
- **Expected Response:** HTTP `409 Conflict`, error message: `"Time slot conflict: Workstation WS-GPU-01 is already reserved..."`.

### Test 3: Exceeding 2 Hours Duration
- Submit start time `09:00:00` and end time `12:30:00` (3.5 hours).
- **Expected Response:** HTTP `400 Bad Request`, error message: `"Reservation duration exceeds the maximum allowed limit of 2 hours"`.

### Test 4: Student Daily Limit Rejection
- Submit another reservation for student `AI2024-055` on `2026-09-08`.
- **Expected Response:** HTTP `409 Conflict`, error message: `"Student already has an active reservation on this date."`.

### Test 5: Lab Assistant Check-In
- **Endpoint:** `PUT http://localhost:8080/api/bookings/1/checkin`
- **Expected Response:** HTTP `200 OK`, status updated to `IN_USE`.

### Test 6: Lab Assistant Workstation Release
- **Endpoint:** `PUT http://localhost:8080/api/bookings/1/release`
- **Body:** `{"assistantNotes": "Job finished successfully; GPU memory cleared."}`
- **Expected Response:** HTTP `200 OK`, status updated to `COMPLETED`, workstation restored to `AVAILABLE`.
