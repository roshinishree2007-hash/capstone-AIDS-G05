package com.ailab.reservation.config;

import com.ailab.reservation.entity.LabBooking;
import com.ailab.reservation.entity.Student;
import com.ailab.reservation.entity.Workstation;
import com.ailab.reservation.repository.LabBookingRepository;
import com.ailab.reservation.repository.StudentRepository;
import com.ailab.reservation.repository.WorkstationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final WorkstationRepository workstationRepository;
    private final StudentRepository studentRepository;
    private final LabBookingRepository bookingRepository;

    public DataInitializer(WorkstationRepository workstationRepository,
                           StudentRepository studentRepository,
                           LabBookingRepository bookingRepository) {
        this.workstationRepository = workstationRepository;
        this.studentRepository = studentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {
        if (workstationRepository.count() == 0) {
            log.info("Initializing 20 AI Lab GPU Workstations...");

            List<Workstation> workstations = Arrays.asList(
                new Workstation("WS-GPU-01", "Workstation Alpha 1", "NVIDIA GeForce RTX 4090", 24, "Intel Core i9-14900K (24 Cores)", 128, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 1"),
                new Workstation("WS-GPU-02", "Workstation Alpha 2", "NVIDIA GeForce RTX 4090", 24, "Intel Core i9-14900K (24 Cores)", 128, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 1"),
                new Workstation("WS-GPU-03", "Workstation Alpha 3", "NVIDIA GeForce RTX 4090", 24, "AMD Ryzen 9 7950X (16 Cores)", 128, "2TB NVMe PCIe 4.0 SSD", "RESERVED", "AI Deep Learning Lab - Row 1"),
                new Workstation("WS-GPU-04", "Workstation Alpha 4", "NVIDIA GeForce RTX 4090", 24, "AMD Ryzen 9 7950X (16 Cores)", 128, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 1"),
                new Workstation("WS-GPU-05", "Workstation Titan 1", "NVIDIA A100 Tensor Core", 80, "AMD EPYC 7763 (64 Cores)", 256, "4TB NVMe Enterprise SSD", "IN_USE", "AI Deep Learning Lab - Cluster Rack A"),
                new Workstation("WS-GPU-06", "Workstation Titan 2", "NVIDIA A100 Tensor Core", 80, "AMD EPYC 7763 (64 Cores)", 256, "4TB NVMe Enterprise SSD", "AVAILABLE", "AI Deep Learning Lab - Cluster Rack A"),
                new Workstation("WS-GPU-07", "Workstation Titan 3", "NVIDIA H100 PCIe", 80, "Intel Xeon Platinum 8480+ (56 Cores)", 256, "7.68TB NVMe Enterprise SSD", "AVAILABLE", "AI Deep Learning Lab - Cluster Rack A"),
                new Workstation("WS-GPU-08", "Workstation Pro 1", "NVIDIA RTX A6000", 48, "AMD Threadripper PRO 5975WX (32 Cores)", 128, "4TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 2"),
                new Workstation("WS-GPU-09", "Workstation Pro 2", "NVIDIA RTX A6000", 48, "AMD Threadripper PRO 5975WX (32 Cores)", 128, "4TB NVMe PCIe 4.0 SSD", "MAINTENANCE", "AI Deep Learning Lab - Row 2"),
                new Workstation("WS-GPU-10", "Workstation Pro 3", "NVIDIA RTX A5000", 24, "Intel Core i9-13900K (24 Cores)", 64, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 2"),
                new Workstation("WS-GPU-11", "Workstation Beta 1", "NVIDIA GeForce RTX 3090 Ti", 24, "Intel Core i9-12900K (16 Cores)", 64, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 3"),
                new Workstation("WS-GPU-12", "Workstation Beta 2", "NVIDIA GeForce RTX 3090", 24, "Intel Core i9-12900K (16 Cores)", 64, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 3"),
                new Workstation("WS-GPU-13", "Workstation Beta 3", "NVIDIA GeForce RTX 3090", 24, "AMD Ryzen 9 5950X (16 Cores)", 64, "2TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 3"),
                new Workstation("WS-GPU-14", "Workstation Beta 4", "NVIDIA GeForce RTX 3090", 24, "AMD Ryzen 9 5950X (16 Cores)", 64, "2TB NVMe PCIe 4.0 SSD", "RESERVED", "AI Deep Learning Lab - Row 3"),
                new Workstation("WS-GPU-15", "Workstation Gamma 1", "NVIDIA GeForce RTX 4080", 16, "Intel Core i7-14700K (20 Cores)", 64, "1TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 4"),
                new Workstation("WS-GPU-16", "Workstation Gamma 2", "NVIDIA GeForce RTX 4080", 16, "Intel Core i7-14700K (20 Cores)", 64, "1TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 4"),
                new Workstation("WS-GPU-17", "Workstation Gamma 3", "NVIDIA GeForce RTX 4070 Ti", 12, "AMD Ryzen 7 7800X3D (8 Cores)", 64, "1TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 4"),
                new Workstation("WS-GPU-18", "Workstation Gamma 4", "NVIDIA GeForce RTX 4070 Ti", 12, "AMD Ryzen 7 7800X3D (8 Cores)", 64, "1TB NVMe PCIe 4.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 4"),
                new Workstation("WS-GPU-19", "Workstation Delta 1", "Dual NVIDIA RTX 4090 (SLI/NVLink)", 48, "AMD Threadripper 7970X (32 Cores)", 192, "4TB NVMe PCIe 5.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 5"),
                new Workstation("WS-GPU-20", "Workstation Delta 2", "Dual NVIDIA RTX 4090 (SLI/NVLink)", 48, "AMD Threadripper 7970X (32 Cores)", 192, "4TB NVMe PCIe 5.0 SSD", "AVAILABLE", "AI Deep Learning Lab - Row 5")
            );

            workstationRepository.saveAll(workstations);
            log.info("Successfully seeded 20 AI workstations.");

            // Demo Students
            Student s1 = studentRepository.save(new Student("AI2024-001", "Aarav Sharma", "aarav.sharma@college.edu", "Artificial Intelligence & Data Science", 4));
            Student s2 = studentRepository.save(new Student("AI2024-014", "Diya Patel", "diya.patel@college.edu", "Artificial Intelligence & Data Science", 4));
            Student s3 = studentRepository.save(new Student("AI2024-027", "Rohan Iyer", "rohan.iyer@college.edu", "Artificial Intelligence & Data Science", 4));

            // Demo Bookings
            Workstation ws3 = workstationRepository.findByWorkstationCode("WS-GPU-03").orElse(null);
            Workstation ws5 = workstationRepository.findByWorkstationCode("WS-GPU-05").orElse(null);
            Workstation ws14 = workstationRepository.findByWorkstationCode("WS-GPU-14").orElse(null);

            if (ws3 != null) {
                LabBooking b1 = new LabBooking(s1, ws3, LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(11, 0),
                        "Vision Transformer (ViT) Fine-tuning on Medical Imaging", "PyTorch 2.3 + HuggingFace");
                b1.setAssistantNotes("Student scheduled morning slot for ViT fine-tuning");
                bookingRepository.save(b1);
            }

            if (ws5 != null) {
                LabBooking b2 = new LabBooking(s2, ws5, LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(12, 0),
                        "LLaMA-3 8B Quantized LoRA Parameter-Efficient Fine-Tuning", "PyTorch + vLLM + Unsloth");
                b2.setStatus("IN_USE");
                b2.setCheckedInAt(LocalDateTime.now());
                b2.setAssistantNotes("Checked in by Lab Assistant. High VRAM allocated.");
                bookingRepository.save(b2);
            }

            if (ws14 != null) {
                LabBooking b3 = new LabBooking(s3, ws14, LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0),
                        "YOLOv10 Real-time Drone Surveillance Object Detection", "Ultralytics + TensorRT");
                b3.setAssistantNotes("Scheduled afternoon session");
                bookingRepository.save(b3);
            }

            log.info("Initial demo students and bookings seeded successfully.");
        }
    }
}
