package com.ailab.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class WorkstationStatusUpdateDTO {

    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "^(AVAILABLE|RESERVED|IN_USE|MAINTENANCE)$",
            message = "Status must be one of: AVAILABLE, RESERVED, IN_USE, MAINTENANCE")
    private String status;

    private String notes;

    public WorkstationStatusUpdateDTO() {
    }

    public WorkstationStatusUpdateDTO(String status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
