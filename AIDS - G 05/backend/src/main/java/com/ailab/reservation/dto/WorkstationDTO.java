package com.ailab.reservation.dto;

import java.time.LocalDateTime;

public class WorkstationDTO {

    private Long id;
    private String workstationCode;
    private String workstationName;
    private String gpuModel;
    private Integer vramGb;
    private String cpuModel;
    private Integer ramGb;
    private String storageInfo;
    private String status; // AVAILABLE, RESERVED, IN_USE, MAINTENANCE
    private String labLocation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkstationDTO() {
    }

    public WorkstationDTO(Long id, String workstationCode, String workstationName, String gpuModel,
                          Integer vramGb, String cpuModel, Integer ramGb, String storageInfo,
                          String status, String labLocation, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.workstationCode = workstationCode;
        this.workstationName = workstationName;
        this.gpuModel = gpuModel;
        this.vramGb = vramGb;
        this.cpuModel = cpuModel;
        this.ramGb = ramGb;
        this.storageInfo = storageInfo;
        this.status = status;
        this.labLocation = labLocation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
