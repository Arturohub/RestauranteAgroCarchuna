package com.arturo.backend.DTO.restaurant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactResponse {

    private String message;

    public ContactResponse(String message) {
        this.message = message;
    }
}
