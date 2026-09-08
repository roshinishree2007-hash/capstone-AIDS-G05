package com.ailab.reservation.service.impl;

import com.ailab.reservation.dto.BookingRequestDTO;
import com.ailab.reservation.dto.BookingResponseDTO;
import com.ailab.reservation.entity.LabBooking;
import com.ailab.reservation.entity.Student;
import com.ailab.reservation.entity.Workstation;
import com.ailab.reservation.exception.BadRequestException;
import com.ailab.reservation.exception.BookingConflictException;
import com.ailab.reservation.exception.ResourceNotFoundException;
import com.ailab.reservation.repository.LabBookingRepository;
import com.ailab.reservation.repository.StudentRepository;
import com.ailab.reservation.repository.WorkstationRepository;
import com.ailab.reservation.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final LabBookingRepository bookingRepository;
    private final WorkstationRepository workstationRepository;
    private final StudentRepository studentRepository;

    public BookingServiceImpl(LabBookingRepository bookingRepository,
                              WorkstationRepository workstationRepository,
                              StudentRepository studentRepository) {
        this.bookingRepository = bookingRepository;
        this.workstationRepository = workstationRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDescStartTimeDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        LabBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));
        return mapToDTO(booking);
    }

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        LocalDate bookingDate = requestDTO.getBookingDate();
        LocalTime startTime = requestDTO.getStartTime();
        LocalTime endTime = requestDTO.getEndTime();

        // RULE 5: Start time must be before end time & booking date cannot be in the past
        if (!startTime.isBefore(endTime)) {
            throw new BadRequestException("Start time (" + startTime + ") must be strictly before end time (" + endTime + ")");
        }
        if (bookingDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Reservation date cannot be in the past (" + bookingDate + ")");
        }

        // RULE 1: Maximum reservation duration = 2 hours (120 minutes)
        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        if (durationMinutes <= 0) {
            throw new BadRequestException("Reservation duration must be greater than 0 minutes");
        }
        if (durationMinutes > 120) {
            throw new BadRequestException("Reservation duration (" + durationMinutes + " mins) exceeds the maximum allowed limit of 2 hours (120 mins)");
        }

        // Find Workstation
        Workstation workstation = workstationRepository.findById(requestDTO.getWorkstationId())
                .orElseThrow(() -> new ResourceNotFoundException("Workstation not found with ID: " + requestDTO.getWorkstationId()));

        // RULE 4: A reservation cannot be created for an unavailable / maintenance workstation
        if ("MAINTENANCE".equalsIgnoreCase(workstation.getStatus())) {
            throw new BookingConflictException("Workstation " + workstation.getWorkstationCode() + " is currently in MAINTENANCE mode and cannot be reserved.");
        }

        // Find or create Student
        Student student = studentRepository.findByRollNumber(requestDTO.getRollNumber().trim())
                .orElseGet(() -> {
                    // Check if email already used by different roll number
                    studentRepository.findByEmail(requestDTO.getEmail().trim()).ifPresent(existing -> {
                        throw new BadRequestException("The email " + requestDTO.getEmail() + " is already associated with roll number " + existing.getRollNumber());
                    });
                    Student newStudent = new Student(
                            requestDTO.getRollNumber().trim(),
                            requestDTO.getStudentName().trim(),
                            requestDTO.getEmail().trim(),
                            requestDTO.getDepartment(),
                            requestDTO.getSemester()
                    );
                    return studentRepository.save(newStudent);
                });

        // RULE 2: A student can have a maximum of 1 active reservation per day
        long activeCount = bookingRepository.countActiveBookingsByStudentAndDate(student.getId(), bookingDate);
        if (activeCount >= 1) {
            throw new BookingConflictException("Student (" + student.getRollNumber() + " - " + student.getFullName() +
                    ") already has an active reservation on " + bookingDate + ". Policy allows maximum 1 active reservation per day.");
        }

        // RULE 3: Two students cannot reserve the same workstation for overlapping time slots
        List<LabBooking> overlapping = bookingRepository.findOverlappingBookings(
                workstation.getId(), bookingDate, startTime, endTime
        );
        if (!overlapping.isEmpty()) {
            LabBooking conflict = overlapping.get(0);
            throw new BookingConflictException("Time slot conflict: Workstation " + workstation.getWorkstationCode() +
                    " is already reserved from " + conflict.getStartTime() + " to " + conflict.getEndTime() +
                    " on " + bookingDate + " (Booking ID: " + conflict.getId() + ").");
        }

        // RULE 6: Save reservation
        LabBooking booking = new LabBooking(
                student,
                workstation,
                bookingDate,
                startTime,
                endTime,
                requestDTO.getProjectTitle().trim(),
                requestDTO.getModelFramework().trim()
        );

        // If workstation is AVAILABLE, transition to RESERVED
        if ("AVAILABLE".equalsIgnoreCase(workstation.getStatus())) {
            workstation.setStatus("RESERVED");
            workstationRepository.save(workstation);
        }

        LabBooking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    @Override
    public BookingResponseDTO checkInBooking(Long id) {
        LabBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        if ("COMPLETED".equalsIgnoreCase(booking.getStatus()) || "CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot check in a reservation that is already " + booking.getStatus());
        }

        // RULE 7: Lab assistant can check in a reservation
        booking.setStatus("IN_USE");
        booking.setCheckedInAt(LocalDateTime.now());

        // Update Workstation Status to IN_USE
        Workstation ws = booking.getWorkstation();
        ws.setStatus("IN_USE");
        workstationRepository.save(ws);

        LabBooking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    @Override
    public BookingResponseDTO releaseBooking(Long id, String assistantNotes) {
        LabBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        if ("COMPLETED".equalsIgnoreCase(booking.getStatus()) || "CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot release a reservation that is already " + booking.getStatus());
        }

        // RULE 8 & 9: Lab assistant can release workstation; released bookings cannot remain active
        booking.setStatus("COMPLETED");
        booking.setReleasedAt(LocalDateTime.now());
        if (assistantNotes != null && !assistantNotes.trim().isEmpty()) {
            booking.setAssistantNotes(assistantNotes.trim());
        }

        // Free workstation back to AVAILABLE if no other active sessions on it
        Workstation ws = booking.getWorkstation();
        List<LabBooking> remainingActive = bookingRepository.findActiveBookingsByWorkstation(ws.getId())
                .stream()
                .filter(b -> !b.getId().equals(booking.getId()))
                .collect(Collectors.toList());

        if (remainingActive.isEmpty()) {
            ws.setStatus("AVAILABLE");
        } else {
            boolean hasInUse = remainingActive.stream().anyMatch(b -> "IN_USE".equalsIgnoreCase(b.getStatus()));
            ws.setStatus(hasInUse ? "IN_USE" : "RESERVED");
        }
        workstationRepository.save(ws);

        LabBooking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    @Override
    public void cancelBooking(Long id) {
        LabBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        if ("COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot cancel an already completed reservation");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        // Evaluate workstation status
        Workstation ws = booking.getWorkstation();
        List<LabBooking> remainingActive = bookingRepository.findActiveBookingsByWorkstation(ws.getId())
                .stream()
                .filter(b -> !b.getId().equals(booking.getId()))
                .collect(Collectors.toList());

        if (remainingActive.isEmpty() && !"MAINTENANCE".equalsIgnoreCase(ws.getStatus())) {
            ws.setStatus("AVAILABLE");
            workstationRepository.save(ws);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByWorkstation(Long workstationId) {
        return bookingRepository.findByWorkstationId(workstationId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BookingResponseDTO mapToDTO(LabBooking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());

        if (b.getStudent() != null) {
            dto.setStudentId(b.getStudent().getId());
            dto.setRollNumber(b.getStudent().getRollNumber());
            dto.setStudentName(b.getStudent().getFullName());
            dto.setEmail(b.getStudent().getEmail());
            dto.setDepartment(b.getStudent().getDepartment());
            dto.setSemester(b.getStudent().getSemester());
        }

        if (b.getWorkstation() != null) {
            dto.setWorkstationId(b.getWorkstation().getId());
            dto.setWorkstationCode(b.getWorkstation().getWorkstationCode());
            dto.setWorkstationName(b.getWorkstation().getWorkstationName());
            dto.setGpuModel(b.getWorkstation().getGpuModel());
            dto.setVramGb(b.getWorkstation().getVramGb());
            dto.setLabLocation(b.getWorkstation().getLabLocation());
        }

        dto.setBookingDate(b.getBookingDate());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setProjectTitle(b.getProjectTitle());
        dto.setModelFramework(b.getModelFramework());
        dto.setStatus(b.getStatus());
        dto.setCheckedInAt(b.getCheckedInAt());
        dto.setReleasedAt(b.getReleasedAt());
        dto.setAssistantNotes(b.getAssistantNotes());
        dto.setCreatedAt(b.getCreatedAt());

        return dto;
    }
}
