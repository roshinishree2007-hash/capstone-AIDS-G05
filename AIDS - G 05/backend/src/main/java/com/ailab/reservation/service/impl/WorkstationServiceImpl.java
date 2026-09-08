package com.ailab.reservation.service.impl;

import com.ailab.reservation.dto.WorkstationDTO;
import com.ailab.reservation.dto.WorkstationStatusUpdateDTO;
import com.ailab.reservation.entity.Workstation;
import com.ailab.reservation.exception.ResourceNotFoundException;
import com.ailab.reservation.repository.WorkstationRepository;
import com.ailab.reservation.service.WorkstationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkstationServiceImpl implements WorkstationService {

    private final WorkstationRepository workstationRepository;

    public WorkstationServiceImpl(WorkstationRepository workstationRepository) {
        this.workstationRepository = workstationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkstationDTO> getAllWorkstations() {
        return workstationRepository.findAllByOrderByIdAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WorkstationDTO getWorkstationById(Long id) {
        Workstation ws = workstationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workstation not found with ID: " + id));
        return mapToDTO(ws);
    }

    @Override
    public WorkstationDTO updateStatus(Long id, WorkstationStatusUpdateDTO statusUpdateDTO) {
        Workstation ws = workstationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workstation not found with ID: " + id));

        ws.setStatus(statusUpdateDTO.getStatus());
        Workstation saved = workstationRepository.save(ws);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkstationDTO> getAvailableWorkstations() {
        return workstationRepository.findByStatus("AVAILABLE").stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private WorkstationDTO mapToDTO(Workstation ws) {
        return new WorkstationDTO(
                ws.getId(),
                ws.getWorkstationCode(),
                ws.getWorkstationName(),
                ws.getGpuModel(),
                ws.getVramGb(),
                ws.getCpuModel(),
                ws.getRamGb(),
                ws.getStorageInfo(),
                ws.getStatus(),
                ws.getLabLocation(),
                ws.getCreatedAt(),
                ws.getUpdatedAt()
        );
    }
}
