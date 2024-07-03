package com.arturo.backend.service.auth;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.repository.auth.MyUserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {

    @Autowired
    private MyUserRepository userRepository;

   @Autowired
    private Environment env;
    private String SECRET;
    private Long VALIDITY;

    @PostConstruct
    public void init() {
        SECRET = env.getProperty("JWT_SECRET");
        VALIDITY = TimeUnit.MINUTES.toMillis(Long.parseLong(env.getProperty("TIME")));
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodedKey);
    }
    
    public String generateToken(UserDetails userDetails) {
        MyUser myUser = getUserFromRepository(userDetails.getUsername());
        Map<String, String> claims = new HashMap<>();
        claims.put("iss", "https");
        claims.put("role", myUser.getRole());
        claims.put("image", myUser.getImage());
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(VALIDITY)))
                .signWith(generateKey())
                .compact();
    }

    private MyUser getUserFromRepository(String username) {
        Optional<MyUser> userOptional = userRepository.findByUsername(username);
        return userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public String extractUsername(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getSubject();
    }

    private Claims getClaims(String jwt) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(jwt.trim())
                .getPayload();
    }

    public boolean isTokenValid(String jwt) throws JwtException {
        try {
            Claims claims = getClaims(jwt);
            if (claims.getExpiration().after(Date.from(Instant.now()))) {
                return true;
            } else {
                throw new JwtException("Please, you need to log in");
            }
        } catch (ExpiredJwtException e) {
            throw new JwtException("Please, you need to log in");
        } catch (JwtException e) {
            throw new JwtException("Please, you need to log in");
        }
    }

}
