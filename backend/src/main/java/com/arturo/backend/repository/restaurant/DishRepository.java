package com.arturo.backend.repository.restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arturo.backend.DTO.restaurant.Dish;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategory(String category);
}
