package com.arturo.backend.controllers.restaurant;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.restaurant.Menu;
import com.arturo.backend.service.restaurant.MenuService;


@RestController
@RequestMapping("/api")
public class MenuController {

    @Autowired
    private MenuService menuService;
    

    @GetMapping("/menus/{date}")
    public ResponseEntity<List<Menu>> getMenuByDate(@PathVariable String date){
        LocalDate localDate = LocalDate.parse(date);
        List<Menu> menus = menuService.getMenuByDate(localDate);
        if(menus.isEmpty()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(menus);
        }
    }

    
    @GetMapping("/admin/menus/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id){
        Optional<Menu> optionalMenu = menuService.getMenuById(id);
        
        if (optionalMenu.isPresent()) {
            Menu menu = optionalMenu.get();
            return ResponseEntity.ok(menu);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    


    @PostMapping("/admin/menus")
    public ResponseEntity<String> createMenu(@RequestBody Menu menu, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        try {
            Menu createdMenu = menuService.createMenu(menu.getDate(), menu.getDishes(), jwt);
            return ResponseEntity.ok("El menú del día  '" + createdMenu.getDate() + "' se ha creado con éxito!");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @PutMapping("/admin/menus/{id}")
    public ResponseEntity<String> updateMenu(@PathVariable Long id, @RequestBody Menu menu, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        try {
            Menu updatedMenu = menuService.updateMenu(id, menu.getDishes(), jwt);
            return ResponseEntity.ok("El Menu del dia '" + updatedMenu.getDate() + "' se ha actualizado con éxito!");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }
}


