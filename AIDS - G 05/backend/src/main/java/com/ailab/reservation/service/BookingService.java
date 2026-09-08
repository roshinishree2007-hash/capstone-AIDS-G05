package com.ailab.reservation.service;

import com.ailab.reservation.dto.BookingRequestDTO;
import com.ailab.reservation.dto.BookingResponseDTO;

import java.util.List;

public interface BookingService {
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO getBookingById(Long id);
    BookingResponseDTO createBooking(BookingRequestDTO requestDTO);
    BookingResponseDTO checkInBooking(Long id);
    BookingResponseDTO releaseBooking(Long id, String assistantNotes);
    void cancelBooking(Long id);
    List<BookingResponseDTO> getBookingsByWorkstation(Long workstationId);
}
