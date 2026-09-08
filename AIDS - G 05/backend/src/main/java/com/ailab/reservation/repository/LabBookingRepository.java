package com.ailab.reservation.repository;

import com.ailab.reservation.entity.LabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface LabBookingRepository extends JpaRepository<LabBooking, Long> {

    List<LabBooking> findAllByOrderByBookingDateDescStartTimeDesc();

    List<LabBooking> findByWorkstationId(Long workstationId);

    List<LabBooking> findByStatus(String status);

    // Overlapping booking query for the same workstation
    @Query("SELECT b FROM LabBooking b WHERE b.workstation.id = :workstationId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status IN ('CONFIRMED', 'IN_USE') " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<LabBooking> findOverlappingBookings(
            @Param("workstationId") Long workstationId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    // Check student's active bookings on the same date (Rule 2: max 1 per day)
    @Query("SELECT COUNT(b) FROM LabBooking b WHERE b.student.id = :studentId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status IN ('CONFIRMED', 'IN_USE')")
    long countActiveBookingsByStudentAndDate(
            @Param("studentId") Long studentId,
            @Param("bookingDate") LocalDate bookingDate
    );

    // Find active bookings on workstation right now
    @Query("SELECT b FROM LabBooking b WHERE b.workstation.id = :workstationId " +
           "AND b.status IN ('CONFIRMED', 'IN_USE')")
    List<LabBooking> findActiveBookingsByWorkstation(@Param("workstationId") Long workstationId);
}
