package com.ailab.reservation.controller;

import com.ailab.reservation.dto.WorkstationDTO;
import com.ailab.reservation.dto.WorkstationStatusUpdateDTO;
import com.ailab.reservation.service.WorkstationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workstations")
public class WorkstationController {

    private final WorkstationService workstationService;

    public WorkstationController(WorkstationService workstationService) {
        this.workstationService = workstationService;
    }

    @GetMapping
    public ResponseEntity<List<WorkstationDTO>> getAllWorkstations() {
        List<WorkstationDTO> workstations = workstationService.getAllWorkstations();
        return ResponseEntity.ok(workstations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkstationDTO> getWorkstationById(@PathVariable Long id) {
        WorkstationDTO workstation = workstationService.getWorkstationById(id);
        return ResponseEntity.ok(workstation);
    }

    @GetMapping("/available")
    public ResponseEntity<List<WorkstationDTO>> getAvailableWorkstations() {
        List<WorkstationDTO> available = workstationService.getAvailableWorkstations();
        return ResponseEntity.ok(available);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<WorkstationDTO> updateWorkstationStatus(
            @PathVariable Long id,
            @Valid @RequestBody WorkstationStatusUpdateDTO statusUpdateDTO) {
        WorkstationDTO updated = workstationService.updateStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(updated);
    }
}
