package com.arturo.backend.repository.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;

import com.arturo.backend.DTO.auth.MyUser;



public interface MyUserRepository extends JpaRepository<MyUser, Long>{

    Optional <MyUser> findByUsername(String username);

    // @Query(value = "SELECT * FROM restaurant_users WHERE email = :email", nativeQuery = true)
    // Optional <MyUser> findByEmail(String email);
}
