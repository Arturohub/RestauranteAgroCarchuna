package com.arturo.backend.repository.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arturo.backend.DTO.restaurant.DishMenu;

import jakarta.transaction.Transactional;

public interface DishMenuRepository extends JpaRepository<DishMenu, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM DishMenu dm WHERE dm.dish.id = :dishId")
    void deleteByDishId(@Param("dishId") Long dishId);
}
