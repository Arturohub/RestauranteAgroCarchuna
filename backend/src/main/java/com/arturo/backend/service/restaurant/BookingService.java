package com.arturo.backend.service.restaurant;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.DTO.restaurant.Booking;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.repository.restaurant.BookingRepository;
import com.arturo.backend.service.auth.JwtService;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MyUserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public List<Booking> getAllBookings(String jwt){
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN")) {
            return bookingRepository.findAll();
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo los usuarios con permiso pueden ver estos datos.");
        }
    }

    public List<Booking> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByDate(date);
    }

    public List<Booking> getBookingsByTurno(String turno) {
        return bookingRepository.findByTurno(turno);
    }
    public List<Booking> getBookingsByDateAndTurno(LocalDate date, String turno){
        return bookingRepository.findByDateAndTurno(date, turno);
    }

    public Optional<Booking> getBookingByUserAndDate(MyUser userBooker, LocalDate date) {
        return bookingRepository.findByUserBookerAndDate(userBooker, date);
    }

    public Booking createBooking(Booking booking, String jwt){

        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("USER")) {

            booking.setUserBooker(optionalUser.get());
            booking.setCreatedAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());
            

            Optional<Booking> existingBooking = bookingRepository.findByUserBookerAndDateAndTurno(booking.getUserBooker(), booking.getDate(), booking.getTurno());
            if(existingBooking.isPresent()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya hiciste una reserva para la fecha proporcionada.");
            }

            return bookingRepository.save(booking);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo los usuarios pueden crear reservas.");
        }
    }

    public Booking updateBooking(Long id, Booking updatedBooking, String jwt) {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        Optional<Booking> optionalBooking = bookingRepository.findById(id);

        if (optionalBooking.isPresent() && optionalUser.isPresent() && optionalUser.get().equals(optionalBooking.get().getUserBooker())) {
            Booking booking = optionalBooking.get();

            booking.setDate(updatedBooking.getDate());
            booking.setTurno(updatedBooking.getTurno());
            booking.setTime(updatedBooking.getTime());
            booking.setAmountPeople(updatedBooking.getAmountPeople());
            booking.setUpdatedAt(LocalDateTime.now());

            return bookingRepository.save(booking);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo el usuario que ha creado la reserva puede actualizarla");
        }
    }



    public void deleteBooking(Long id, String jwt) {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent() && optionalUser.isPresent() && optionalUser.get().getRole().contains("USER")) {
            bookingRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Perdona, solo los que han creado una reserva, pueden borrarla");
        }
    }

    public int getAvailableSpaceForDateAndTurno(LocalDate date, String turno){
        List<Booking> bookings = bookingRepository.findByDateAndTurno(date, turno);
        int totalBooked = bookings.stream().mapToInt(Booking::getAmountPeople).sum();
        int maxCapacity = 60;
        int availableSpace = maxCapacity - totalBooked;
        return availableSpace;
    }
    
}

