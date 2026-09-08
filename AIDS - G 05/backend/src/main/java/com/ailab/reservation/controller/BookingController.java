package com.ailab.reservation.controller;

import com.ailab.reservation.dto.BookingRequestDTO;
import com.ailab.reservation.dto.BookingResponseDTO;
import com.ailab.reservation.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO requestDTO) {
        BookingResponseDTO created = bookingService.createBooking(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/checkin")
    public ResponseEntity<BookingResponseDTO> checkInBooking(@PathVariable Long id) {
        BookingResponseDTO updated = bookingService.checkInBooking(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/release")
    public ResponseEntity<BookingResponseDTO> releaseBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = (body != null) ? body.get("assistantNotes") : null;
        BookingResponseDTO updated = bookingService.releaseBooking(id, notes);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok(Map.of(
                "message", "Reservation #" + id + " has been successfully cancelled."
        ));
    }

    @GetMapping("/workstation/{workstationId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByWorkstation(@PathVariable Long workstationId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByWorkstation(workstationId);
        return ResponseEntity.ok(bookings);
    }
}
