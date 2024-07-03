package com.arturo.backend.controllers.restaurant;


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

import com.arturo.backend.DTO.restaurant.Dish;
import com.arturo.backend.service.restaurant.DishService;

@RestController
@RequestMapping("/api")
public class DishController {

    @Autowired
    private DishService dishService;

    @GetMapping("/dishes")
    public ResponseEntity<List<Dish>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @GetMapping("/dishes/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        return dishService.getDishById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dishes/category/{category}")
    public ResponseEntity<List<Dish>> getDishesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(dishService.getDishesByCategory(category));
    }

    @PostMapping("/admin/dishes")
    public ResponseEntity<String> createDish(@RequestBody Dish dish, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        Dish createdDish = dishService.createDish(dish, jwt);
        return ResponseEntity.ok("Plato " + createdDish.getName() + " creado con éxito");
    }


    @PutMapping("/admin/dishes/{id}")
    public ResponseEntity<String> updateDish(@PathVariable Long id, @RequestBody Dish dish, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        Dish updatedDish = dishService.updateDish(id, dish, jwt);
        return ResponseEntity.ok("Plato '" + updatedDish.getName() + "' actualizado con éxito!");
    }
    
    @DeleteMapping("/admin/dishes/{id}")
    public ResponseEntity<String> deleteDish(@PathVariable Long id, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        dishService.deleteDish(id, jwt);
        return ResponseEntity.ok("El plato se ha eliminado con éxito!");
    }
}