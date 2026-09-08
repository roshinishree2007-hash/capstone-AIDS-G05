package com.ailab.reservation.service;

import com.ailab.reservation.dto.WorkstationDTO;
import com.ailab.reservation.dto.WorkstationStatusUpdateDTO;

import java.util.List;

public interface WorkstationService {
    List<WorkstationDTO> getAllWorkstations();
    WorkstationDTO getWorkstationById(Long id);
    WorkstationDTO updateStatus(Long id, WorkstationStatusUpdateDTO statusUpdateDTO);
    List<WorkstationDTO> getAvailableWorkstations();
}
