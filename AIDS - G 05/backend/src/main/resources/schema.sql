CREATE DATABASE IF NOT EXISTS ai_lab_reservation;
USE ai_lab_reservation;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS lab_bookings;
DROP TABLE IF EXISTS workstations;
DROP TABLE IF EXISTS students;

-- Table: students
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) DEFAULT 'Artificial Intelligence & Data Science',
    semester INT DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: workstations
CREATE TABLE workstations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workstation_code VARCHAR(20) NOT NULL UNIQUE,
    workstation_name VARCHAR(100) NOT NULL,
    gpu_model VARCHAR(80) NOT NULL,
    vram_gb INT NOT NULL,
    cpu_model VARCHAR(100) NOT NULL,
    ram_gb INT NOT NULL,
    storage_info VARCHAR(100) NOT NULL,
    status ENUM('AVAILABLE', 'RESERVED', 'IN_USE', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    lab_location VARCHAR(50) NOT NULL DEFAULT 'AI Deep Learning Lab - Room 304',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: lab_bookings
CREATE TABLE lab_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    workstation_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    project_title VARCHAR(150) NOT NULL,
    model_framework VARCHAR(100) NOT NULL,
    status ENUM('CONFIRMED', 'IN_USE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    checked_in_at TIMESTAMP NULL,
    released_at TIMESTAMP NULL,
    assistant_notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_workstation FOREIGN KEY (workstation_id) REFERENCES workstations(id) ON DELETE CASCADE
);

-- Index for performance on time slot queries and conflict detection
CREATE INDEX idx_booking_date_workstation ON lab_bookings(booking_date, workstation_id, status);
CREATE INDEX idx_booking_student_date ON lab_bookings(student_id, booking_date, status);

-- Seed realistic 20 Workstations
INSERT INTO workstations (workstation_code, workstation_name, gpu_model, vram_gb, cpu_model, ram_gb, storage_info, status, lab_location) VALUES
('WS-GPU-01', 'Workstation Alpha 1', 'NVIDIA GeForce RTX 4090', 24, 'Intel Core i9-14900K (24 Cores)', 128, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 1'),
('WS-GPU-02', 'Workstation Alpha 2', 'NVIDIA GeForce RTX 4090', 24, 'Intel Core i9-14900K (24 Cores)', 128, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 1'),
('WS-GPU-03', 'Workstation Alpha 3', 'NVIDIA GeForce RTX 4090', 24, 'AMD Ryzen 9 7950X (16 Cores)', 128, '2TB NVMe PCIe 4.0 SSD', 'RESERVED', 'AI Deep Learning Lab - Row 1'),
('WS-GPU-04', 'Workstation Alpha 4', 'NVIDIA GeForce RTX 4090', 24, 'AMD Ryzen 9 7950X (16 Cores)', 128, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 1'),
('WS-GPU-05', 'Workstation Titan 1', 'NVIDIA A100 Tensor Core', 80, 'AMD EPYC 7763 (64 Cores)', 256, '4TB NVMe Enterprise SSD', 'IN_USE', 'AI Deep Learning Lab - Cluster Rack A'),
('WS-GPU-06', 'Workstation Titan 2', 'NVIDIA A100 Tensor Core', 80, 'AMD EPYC 7763 (64 Cores)', 256, '4TB NVMe Enterprise SSD', 'AVAILABLE', 'AI Deep Learning Lab - Cluster Rack A'),
('WS-GPU-07', 'Workstation Titan 3', 'NVIDIA H100 PCIe', 80, 'Intel Xeon Platinum 8480+ (56 Cores)', 256, '7.68TB NVMe Enterprise SSD', 'AVAILABLE', 'AI Deep Learning Lab - Cluster Rack A'),
('WS-GPU-08', 'Workstation Pro 1', 'NVIDIA RTX A6000', 48, 'AMD Threadripper PRO 5975WX (32 Cores)', 128, '4TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 2'),
('WS-GPU-09', 'Workstation Pro 2', 'NVIDIA RTX A6000', 48, 'AMD Threadripper PRO 5975WX (32 Cores)', 128, '4TB NVMe PCIe 4.0 SSD', 'MAINTENANCE', 'AI Deep Learning Lab - Row 2'),
('WS-GPU-10', 'Workstation Pro 3', 'NVIDIA RTX A5000', 24, 'Intel Core i9-13900K (24 Cores)', 64, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 2'),
('WS-GPU-11', 'Workstation Beta 1', 'NVIDIA GeForce RTX 3090 Ti', 24, 'Intel Core i9-12900K (16 Cores)', 64, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 3'),
('WS-GPU-12', 'Workstation Beta 2', 'NVIDIA GeForce RTX 3090', 24, 'Intel Core i9-12900K (16 Cores)', 64, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 3'),
('WS-GPU-13', 'Workstation Beta 3', 'NVIDIA GeForce RTX 3090', 24, 'AMD Ryzen 9 5950X (16 Cores)', 64, '2TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 3'),
('WS-GPU-14', 'Workstation Beta 4', 'NVIDIA GeForce RTX 3090', 24, 'AMD Ryzen 9 5950X (16 Cores)', 64, '2TB NVMe PCIe 4.0 SSD', 'RESERVED', 'AI Deep Learning Lab - Row 3'),
('WS-GPU-15', 'Workstation Gamma 1', 'NVIDIA GeForce RTX 4080', 16, 'Intel Core i7-14700K (20 Cores)', 64, '1TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 4'),
('WS-GPU-16', 'Workstation Gamma 2', 'NVIDIA GeForce RTX 4080', 16, 'Intel Core i7-14700K (20 Cores)', 64, '1TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 4'),
('WS-GPU-17', 'Workstation Gamma 3', 'NVIDIA GeForce RTX 4070 Ti', 12, 'AMD Ryzen 7 7800X3D (8 Cores)', 64, '1TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 4'),
('WS-GPU-18', 'Workstation Gamma 4', 'NVIDIA GeForce RTX 4070 Ti', 12, 'AMD Ryzen 7 7800X3D (8 Cores)', 64, '1TB NVMe PCIe 4.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 4'),
('WS-GPU-19', 'Workstation Delta 1', 'Dual NVIDIA RTX 4090 (SLI/NVLink)', 48, 'AMD Threadripper 7970X (32 Cores)', 192, '4TB NVMe PCIe 5.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 5'),
('WS-GPU-20', 'Workstation Delta 2', 'Dual NVIDIA RTX 4090 (SLI/NVLink)', 48, 'AMD Threadripper 7970X (32 Cores)', 192, '4TB NVMe PCIe 5.0 SSD', 'AVAILABLE', 'AI Deep Learning Lab - Row 5');

-- Seed Sample Students
INSERT INTO students (roll_number, full_name, email, department, semester) VALUES
('AI2024-001', 'Aarav Sharma', 'aarav.sharma@college.edu', 'Artificial Intelligence & Data Science', 4),
('AI2024-014', 'Diya Patel', 'diya.patel@college.edu', 'Artificial Intelligence & Data Science', 4),
('AI2024-027', 'Rohan Iyer', 'rohan.iyer@college.edu', 'Artificial Intelligence & Data Science', 4),
('AI2024-039', 'Sneha Reddy', 'sneha.reddy@college.edu', 'Artificial Intelligence & Data Science', 4);

-- Seed Sample Initial Bookings for Testing
INSERT INTO lab_bookings (student_id, workstation_id, booking_date, start_time, end_time, project_title, model_framework, status, checked_in_at, assistant_notes) VALUES
(1, 3, CURDATE(), '09:00:00', '11:00:00', 'Vision Transformer (ViT) Fine-tuning on Medical Imaging', 'PyTorch 2.3 + HuggingFace', 'CONFIRMED', NULL, 'Student reserved morning slot for ViT fine-tuning'),
(2, 5, CURDATE(), '10:00:00', '12:00:00', 'LLaMA-3 8B Quantized LoRA Parameter-Efficient Fine-Tuning', 'PyTorch + vLLM + Unsloth', 'IN_USE', CURRENT_TIMESTAMP, 'Checked in by Lab Assistant. High VRAM usage verified.'),
(3, 14, CURDATE(), '14:00:00', '16:00:00', 'YOLOv10 Real-time Drone Surveillance Object Detection', 'Ultralytics + TensorRT', 'CONFIRMED', NULL, 'Scheduled afternoon session');
