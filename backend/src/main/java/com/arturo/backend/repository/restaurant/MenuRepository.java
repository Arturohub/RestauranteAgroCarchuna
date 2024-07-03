package com.arturo.backend.repository.restaurant;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arturo.backend.DTO.restaurant.Menu;

import java.time.LocalDate;


public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByDate(LocalDate date);
    Optional<Menu> findById(Long id);
}
