package com.arturo.backend.service.restaurant;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.DTO.restaurant.Dish;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.repository.restaurant.DishMenuRepository;
import com.arturo.backend.repository.restaurant.DishRepository;
import com.arturo.backend.service.auth.JwtService;


@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private MyUserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private DishMenuRepository dishMenuRepository;

    public List<Dish> getAllDishes(){
        return dishRepository.findAll();
    }

    public Optional<Dish>getDishById(Long id){
        return dishRepository.findById(id);
    }

    public List<Dish> getDishesByCategory(String category) {
        return dishRepository.findByCategory(category);
    }

    public Dish createDish(Dish dish, String jwt){
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN")) {
            dish.setCreatedAt(LocalDateTime.now());
            dish.setUpdatedAt(LocalDateTime.now());
            return dishRepository.save(dish);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sorry, only ADMIN users can create dishes.");
        }
    }
    
    public Dish updateDish(Long id, Dish updatedDish, String jwt) {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        Optional<Dish> existingDishOptional = dishRepository.findById(id);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN") && existingDishOptional.isPresent()) {
            Dish existingDish = existingDishOptional.get();
            existingDish.setName(updatedDish.getName());
            existingDish.setDescription(updatedDish.getDescription());
            existingDish.setCategory(updatedDish.getCategory());
            existingDish.setImage(updatedDish.getImage());
            existingDish.setAlergenos(updatedDish.getAlergenos());
            existingDish.setUpdatedAt(LocalDateTime.now());
            return dishRepository.save(existingDish);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sorry, only ADMIN users can update dishes.");
        }
    }

    public void deleteDish(Long id, String jwt) {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        Optional<Dish> existingDishOptional = dishRepository.findById(id);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN") && existingDishOptional.isPresent()) {
            dishMenuRepository.deleteByDishId(id);
            dishRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sorry, only ADMIN users can delete dishes.");
        }
    }
}