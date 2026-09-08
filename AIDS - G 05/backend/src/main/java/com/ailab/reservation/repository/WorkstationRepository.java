package com.ailab.reservation.repository;

import com.ailab.reservation.entity.Workstation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkstationRepository extends JpaRepository<Workstation, Long> {
    Optional<Workstation> findByWorkstationCode(String workstationCode);
    List<Workstation> findByStatus(String status);
    List<Workstation> findAllByOrderByIdAsc();
}
