package com.arturo.backend.controllers.restaurant;

import java.time.LocalDate;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.restaurant.Booking;

import com.arturo.backend.service.restaurant.BookingService;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @GetMapping("/admin/bookings")
    public List<Booking> getAllBookings(@RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        return bookingService.getAllBookings(jwt);
    }

    @GetMapping("bookings/date/{date}")
    public List<Booking> getBookingsByDate(@PathVariable LocalDate date) {
        return bookingService.getBookingsByDate(date);
    }


    @PostMapping("/users/bookings")
    public ResponseEntity<String> createBooking(@RequestBody Booking booking, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        try {
            Booking createdBooking = bookingService.createBooking(booking, jwt);
            return ResponseEntity.ok("Muchas gracias por la reserva! Has reservado para el turno " + createdBooking.getTurno() + " a la hora " + createdBooking.getTime() + " del día " + createdBooking.getDate());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @PutMapping("/users/bookings/{id}")
    public ResponseEntity<String> updateBooking(@PathVariable Long id, @RequestBody Booking booking, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        Booking updatedBooking = bookingService.updateBooking(id, booking, jwt);
        return ResponseEntity.ok("Haz actualizado con éxito tu reserva. Has reservado para el turno " + updatedBooking.getTurno() + " a la hora " + updatedBooking.getTime() + " del día " + updatedBooking.getDate());
    }
    
    @DeleteMapping("/users/bookings/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        bookingService.deleteBooking(id, jwt);
        return ResponseEntity.ok("La reserva se ha eliminado con éxito!");
    }

    @GetMapping("/bookings/available/{date}/{turno}")
    public ResponseEntity<Integer> getAvailableSpace(@PathVariable LocalDate date, @PathVariable String turno) {
        int availableSpace = bookingService.getAvailableSpaceForDateAndTurno(date, turno);
        return ResponseEntity.ok(availableSpace);
    }
}
