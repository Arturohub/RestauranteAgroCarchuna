package com.arturo.backend.service.restaurant;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.DTO.restaurant.Dish;
import com.arturo.backend.DTO.restaurant.Menu;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.repository.restaurant.MenuRepository;
import com.arturo.backend.service.auth.JwtService;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MyUserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public Menu createMenu(LocalDate date, List<Dish> dishes, String jwt){
        List<Menu> existingMenus = menuRepository.findByDate(date);
        if (!existingMenus.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un menú para la fecha proporcionada. Por favor, comprueba la fecha introducida o actualiza el menú creado anteriormente");
        }       

        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN")) {
            Menu menu = new Menu();
            menu.setDate(date);
            menu.setDishes(dishes);

        return menuRepository.save(menu);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo los administradores pueden crear nuevos menus.");
        }
    }

    public List<Menu> getMenuByDate(LocalDate date) {
        return menuRepository.findByDate(date);
    }

    public Optional<Menu> getMenuById(Long id) {
        return menuRepository.findById(id);
    }

    public Menu updateMenu(Long id, List<Dish> dishes, String jwt) {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        Optional<Menu> optionalMenu = menuRepository.findById(id);
        if (optionalUser.isPresent() && optionalUser.get().getRole().contains("ADMIN") && optionalMenu.isPresent()) {
            Menu menu = optionalMenu.get();
            menu.setDishes(dishes);
            return menuRepository.save(menu);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo los administradores pueden actualizar nuevos menus.");
        }
    }

}
