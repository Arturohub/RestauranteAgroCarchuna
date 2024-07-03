package com.arturo.backend.controllers.auth;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.LoginForm;
import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.service.auth.JwtService;
import com.arturo.backend.service.auth.MyUserDetailsService;
import com.arturo.backend.service.auth.MyUserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AuthController {

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private MyUserService myUserService;

    @GetMapping("/api/admin/auth/users")
    public ResponseEntity<List<MyUser>> getAllUsers() {
    List<MyUser> users = myUserRepository.findAll();
    return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @GetMapping("/api/admin/auth/users/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username, @RequestHeader("Authorization") String authorizationHeader) {
        String jwt = authorizationHeader.substring(7);
        try {
            MyUser user = myUserService.getUserByUsernameIfAdmin(username, jwt);
            return ResponseEntity.ok(user);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @GetMapping("/wtf")
    public ResponseEntity<String> handleLogin() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Perdona, tus credenciales no te permiten tener acceso a estas rutas");
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> createUser(@RequestBody MyUser user){
        Optional<MyUser> existingUser = myUserRepository.findByUsername(user.getUsername());
        if(existingUser.isPresent()){
            return new ResponseEntity<>(Map.of("message", "Ya existe un usuario con este nombre. Por favor, escoge otro nombre de usuario"), HttpStatus.NOT_ACCEPTABLE);
        }
    
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if("arturochicavilla@hotmail.com".equals(user.getEmail())){
            user.setRole("ADMIN,USER");
        } else {
            user.setRole("USER");
        }
        myUserRepository.save(user);
        return new ResponseEntity<>(Map.of("message", "El usuario se ha registrado con éxito. Gracias por registrarte!"), HttpStatus.OK);
    }
    

    @PostMapping("api/auth/login")
    public String authenticateAndGetToken(@RequestBody LoginForm loginForm){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginForm.username()));

        } else {
            throw new UsernameNotFoundException("Usuario o contraseña no encontradas. Por favor, inténtalo de nuevo o regístrate");
        }
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        Cookie cookie = new Cookie("miniArturoToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
}

    

}
