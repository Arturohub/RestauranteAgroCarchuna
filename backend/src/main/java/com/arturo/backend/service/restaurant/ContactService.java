package com.arturo.backend.service.restaurant;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.service.auth.JwtService;

@Service
public class ContactService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MyUserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public void sendEmail(String to, String subject, String body, String jwt) throws Exception {
        String username = jwtService.extractUsername(jwt);
        Optional<MyUser> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isPresent() && optionalUser.get().getRole().contains("USER")) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Perdona, tienes que registrarte o logearte para poder enviar un mensaje.");
        }
    }
}