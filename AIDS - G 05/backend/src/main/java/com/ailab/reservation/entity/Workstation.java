package com.ailab.reservation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workstations")
public class Workstation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "workstation_code", nullable = false, unique = true, length = 20)
    private String workstationCode;

    @Column(name = "workstation_name", nullable = false, length = 100)
    private String workstationName;

    @Column(name = "gpu_model", nullable = false, length = 80)
    private String gpuModel;

    @Column(name = "vram_gb", nullable = false)
    private Integer vramGb;

    @Column(name = "cpu_model", nullable = false, length = 100)
    private String cpuModel;

    @Column(name = "ram_gb", nullable = false)
    private Integer ramGb;

    @Column(name = "storage_info", nullable = false, length = 100)
    private String storageInfo;

    @Column(nullable = false, length = 20)
    private String status = "AVAILABLE"; // AVAILABLE, RESERVED, IN_USE, MAINTENANCE

    @Column(name = "lab_location", nullable = false, length = 80)
    private String labLocation = "AI Deep Learning Lab - Room 304";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Workstation() {
    }

    public Workstation(String workstationCode, String workstationName, String gpuModel, Integer vramGb,
                       String cpuModel, Integer ramGb, String storageInfo, String status, String labLocation) {
        this.workstationCode = workstationCode;
        this.workstationName = workstationName;
        this.gpuModel = gpuModel;
        this.vramGb = vramGb;
        this.cpuModel = cpuModel;
        this.ramGb = ramGb;
        this.storageInfo = storageInfo;
        this.status = status;
        this.labLocation = labLocation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkstationCode() {
        return workstationCode;
    }

    public void setWorkstationCode(String workstationCode) {
        this.workstationCode = workstationCode;
    }

    public String getWorkstationName() {
        return workstationName;
    }

    public void setWorkstationName(String workstationName) {
        this.workstationName = workstationName;
    }

    public String getGpuModel() {
        return gpuModel;
    }

    public void setGpuModel(String gpuModel) {
        this.gpuModel = gpuModel;
    }

    public Integer getVramGb() {
        return vramGb;
    }

    public void setVramGb(Integer vramGb) {
        this.vramGb = vramGb;
    }

    public String getCpuModel() {
        return cpuModel;
    }

    public void setCpuModel(String cpuModel) {
        this.cpuModel = cpuModel;
    }

    public Integer getRamGb() {
        return ramGb;
    }

    public void setRamGb(Integer ramGb) {
        this.ramGb = ramGb;
    }

    public String getStorageInfo() {
        return storageInfo;
    }

    public void setStorageInfo(String storageInfo) {
        this.storageInfo = storageInfo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLabLocation() {
        return labLocation;
    }

    public void setLabLocation(String labLocation) {
        this.labLocation = labLocation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
