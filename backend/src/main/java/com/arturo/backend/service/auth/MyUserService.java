package com.arturo.backend.service.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.repository.auth.MyUserRepository;

@Service
public class MyUserService {

    @Autowired
    private MyUserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public MyUser getUserByUsernameIfAdmin(String username, String jwt) {
        String requestingUsername = jwtService.extractUsername(jwt);
        Optional<MyUser> requestingUser = userRepository.findByUsername(requestingUsername);

        if (requestingUser.isPresent() && requestingUser.get().getRole().contains("ADMIN")) {
            Optional<MyUser> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                return user.get();
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Lo siento, solo los usuarios con permiso pueden ver estos datos.");
        }
    }
}
