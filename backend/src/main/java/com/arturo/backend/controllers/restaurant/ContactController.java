package com.arturo.backend.controllers.restaurant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arturo.backend.DTO.restaurant.ContactRequest;
import com.arturo.backend.DTO.restaurant.ContactResponse;
import com.arturo.backend.service.restaurant.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/users/contact")
    public ResponseEntity<ContactResponse> sendContactEmail(@Valid @RequestBody ContactRequest contact, @RequestHeader("Authorization") String authorizationHeader ) {
        String jwt = authorizationHeader.substring(7);
        
        String subject = "Mensaje del usuario con nombre " + contact.getName();
        String body = "Nombree: " + contact.getName() + "\n" +
                      "Email: " + contact.getEmail() + "\n\n" +
                      "Mensaje: " + contact.getMessage();

        try {
            contactService.sendEmail("arturoportfoliofullstack@gmail.com", subject, body, jwt);
                return new ResponseEntity<>(new ContactResponse("Mensaje enviado! Gracias por contactarnos"), HttpStatus.OK);
        } catch (Exception e) {
                return new ResponseEntity<>(new ContactResponse("Error enviando el mensaje. Por favor, prueba otra vez"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}