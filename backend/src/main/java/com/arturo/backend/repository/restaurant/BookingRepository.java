package com.arturo.backend.repository.restaurant;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arturo.backend.DTO.restaurant.Booking;
import com.arturo.backend.DTO.auth.MyUser;


public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findById(Long id);

    List<Booking> findByDate(LocalDate date);

    List<Booking> findByTurno(String turno);

    List<Booking> findByDateAndTurno(LocalDate date, String turno);

    Optional<Booking> findByUserBookerAndDate(MyUser userBooker, LocalDate date);

    Optional<Booking> findByUserBookerAndDateAndTurno(MyUser userBooker, LocalDate date, String turno);
}
